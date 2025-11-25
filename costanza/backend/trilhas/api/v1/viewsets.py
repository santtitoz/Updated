from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from trilhas.models import Atividade, ProgressoAtividade, Trilha
from trilhas.api.v1.serializers import (
    AtividadeSerializer,
    TrilhaDetailSerializer,
    TrilhaListSerializer,
)


class TrilhaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Trilha.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return TrilhaListSerializer
        return TrilhaDetailSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.action == 'retrieve':
            user = self.request.user
            progress = ProgressoAtividade.objects.filter(
                user=user,
                activity__module__trail=self.get_object(),
            )
            progress_map = {p.activity_id: p for p in progress}
            context['progress_map'] = progress_map
        return context


class AtividadeViewSet(viewsets.GenericViewSet):
    queryset = Atividade.objects.all()
    serializer_class = AtividadeSerializer

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        activity = self.get_object()
        user = request.user

        # Check if the user has completed the previous activities
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
            progress, created = ProgressoAtividade.objects.select_for_update().get_or_create(
                user=user,
                activity=activity,
                defaults={'status': ProgressoAtividade.Status.COMPLETED}
            )

            if not created and progress.status == ProgressoAtividade.Status.COMPLETED:
                return Response(
                    {'detail': 'Atividade já concluída.'},
                    status=status.HTTP_200_OK
                )

            progress.status = ProgressoAtividade.Status.COMPLETED
            progress.save()

            # Update user's profile
            profile = user.profile
            profile.xp += activity.xp_reward
            profile.save()

        return Response(
            {'detail': f'Atividade "{activity.title}" concluída com sucesso!'},
            status=status.HTTP_200_OK
        )
