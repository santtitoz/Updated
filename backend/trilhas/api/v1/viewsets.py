from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

# Adicionado Modulo nos imports
from trilhas.models import Atividade, ProgressoAtividade, Trilha, Modulo
# Adicionado ModuloSerializer nos imports
from trilhas.api.v1.serializers import (
    AtividadeSerializer,
    TrilhaDetailSerializer,
    TrilhaListSerializer,
    ModuloSerializer,
)


class TrilhaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Trilha.objects.all()
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return TrilhaListSerializer
        return TrilhaDetailSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        
        # Injeta o mapa de progresso apenas se for detalhe e usuário logado
        if self.action == 'retrieve':
            user = self.request.user
            if user.is_authenticated:
                progress = ProgressoAtividade.objects.filter(
                    user=user,
                    # CORREÇÃO: O campo no model Modulo é 'trilha', não 'trail'
                    activity__module__trilha=self.get_object(),
                )
                progress_map = {p.activity_id: p for p in progress}
                context['progress_map'] = progress_map
        return context


# --- NOVO: ViewSet para Módulos ---
class ModuloViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Modulo.objects.all()
    serializer_class = ModuloSerializer
    permission_classes = [permissions.AllowAny]
# ----------------------------------


class AtividadeViewSet(viewsets.GenericViewSet):
    queryset = Atividade.objects.all()
    serializer_class = AtividadeSerializer
    # Permite qualquer um ler as atividades, mas apenas autenticados completarem
    # Se quiser restringir leitura, mude para permissions.IsAuthenticated
    permission_classes = [permissions.AllowAny] 

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def complete(self, request, pk=None):
        activity = self.get_object()
        user = request.user

        # Verifica se o usuário completou as atividades anteriores deste módulo
        previous_activities = Atividade.objects.filter(
            module=activity.module,
            order__lt=activity.order
        ).order_by('-order')

        for prev_activity in previous_activities:
            if not ProgressoAtividade.objects.filter(
                user=user,
                activity=prev_activity,
                status=ProgressoAtividade.Status.COMPLETED
            ).exists():
                return Response(
                    {'detail': f'Você deve primeiro completar a atividade anterior: "{prev_activity.title}".'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        with transaction.atomic():
            # Usa select_for_update para evitar condições de corrida (race conditions)
            progress, created = ProgressoAtividade.objects.select_for_update().get_or_create(
                user=user,
                activity=activity,
                defaults={
                    'status': ProgressoAtividade.Status.COMPLETED,
                    'completed_at': timezone.now()
                }
            )

            if not created and progress.status == ProgressoAtividade.Status.COMPLETED:
                return Response(
                    {'detail': 'Atividade já concluída.'},
                    status=status.HTTP_200_OK
                )

            # Se já existia mas não estava completa, ou acabou de criar
            progress.status = ProgressoAtividade.Status.COMPLETED
            progress.completed_at = timezone.now()
            progress.save()

            # Atualiza o XP do usuário (Profile)
            # Verifica se o usuário tem profile antes de tentar salvar
            if hasattr(user, 'profile'):
                profile = user.profile
                profile.xp += activity.xp_reward
                profile.save()

        return Response(
            {'detail': f'Atividade "{activity.title}" concluída com sucesso!'},
            status=status.HTTP_200_OK
        )