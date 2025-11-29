from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS, BasePermission

from events.models import Event, EventParticipant
from events.api.v1.serializers import EventSerializer, EventParticipantSerializer


# Permissão personalizada
class IsAdminOrReadOnly(BasePermission):
    """
    Permite acesso total apenas a administradores.
    Usuários comuns podem apenas ler (GET, HEAD, OPTIONS).
    """
    def has_permission(self, request, view):
        # Métodos de leitura são sempre permitidos
        if request.method in SAFE_METHODS:
            return True
        # Escrita apenas para usuários staff (admin)
        return bool(request.user and request.user.is_staff)


class EventViewSet(viewsets.ModelViewSet):
    """
    ViewSet principal para gerenciar eventos.
    - Leitura pública (qualquer usuário)
    - Escrita apenas para administradores (staff)
    - Registro e cancelamento de participação para usuários autenticados
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAdminOrReadOnly]

    def perform_create(self, serializer):
        """
        Ao criar um evento, define o criador como o usuário autenticado (admin).
        """
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def register(self, request, pk=None):
        """
        Inscreve o usuário autenticado no evento.
        """
        event = self.get_object()
        user = request.user

        # Impede duplicação
        if EventParticipant.objects.filter(event=event, user=user).exists():
            return Response(
                {"detail": "Usuário já inscrito neste evento."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verifica limite
        if event.max_participants and event.participants.count() >= event.max_participants:
            return Response(
                {"detail": "Número máximo de participantes atingido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        participant = EventParticipant.objects.create(event=event, user=user)
        return Response(EventParticipantSerializer(participant).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def unregister(self, request, pk=None):
        """
        Remove o usuário autenticado da lista de participantes.
        """
        event = self.get_object()
        user = request.user

        participation = EventParticipant.objects.filter(event=event, user=user).first()
        if not participation:
            return Response(
                {"detail": "Usuário não está inscrito neste evento."},
                status=status.HTTP_400_BAD_REQUEST
            )

        participation.delete()
        return Response(
            {"detail": "Usuário removido do evento com sucesso."},
            status=status.HTTP_204_NO_CONTENT
        )

    def get_queryset(self):
        """
        Retorna apenas eventos públicos, mas administradores veem todos.
        """
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return Event.objects.all()
        return Event.objects.filter(is_public=True)
