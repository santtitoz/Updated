from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from friends.models import FriendRequest, Friendship
from .serializers import FriendRequestSerializer, FriendshipSerializer
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()


class FriendRequestViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSerializer

    def get_queryset(self):
        return FriendRequest.objects.filter(to_user=self.request.user)

    def create(self, request):
        """
        Enviar uma nova solicitação de amizade.
        POST /api/friends/request/
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        to_user = serializer.validated_data['to_user']
        from_user = request.user

        if to_user == from_user:
            return Response({"detail": "Você não pode enviar uma solicitação para si mesmo."}, status=status.HTTP_400_BAD_REQUEST)

        if Friendship.objects.filter(Q(user1=from_user, user2=to_user) | Q(user1=to_user, user2=from_user)).exists():
            return Response({"detail": "Vocês já são amigos."}, status=status.HTTP_400_BAD_REQUEST)

        if FriendRequest.objects.filter(from_user=from_user, to_user=to_user).exists():
            return Response({"detail": "Solicitação de amizade já enviada."}, status=status.HTTP_400_BAD_REQUEST)
        
        if FriendRequest.objects.filter(from_user=to_user, to_user=from_user).exists():
            return Response({"detail": "Você já tem uma solicitação pendente deste usuário."}, status=status.HTTP_400_BAD_REQUEST)

        friend_request = FriendRequest.objects.create(from_user=from_user, to_user=to_user)
        return Response(self.get_serializer(friend_request).data, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        Listar todas as solicitações de amizade pendentes recebidas.
        GET /api/friends/requests/
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['put'])
    def accept(self, request, pk=None):
        """
        Aceitar uma solicitação de amizade.
        PUT /api/friends/request/<request_id>/accept/
        """
        friend_request = get_object_or_404(FriendRequest, id=pk, to_user=request.user)
        
        Friendship.objects.create(user1=friend_request.from_user, user2=friend_request.to_user)
        friend_request.delete()
        
        return Response({"detail": "Solicitação de amizade aceita."}, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        """
        Rejeitar ou cancelar uma solicitação de amizade.
        DELETE /api/friends/request/<request_id>/
        """
        friend_request = get_object_or_404(FriendRequest, id=pk)
        
        if friend_request.to_user != request.user and friend_request.from_user != request.user:
             return Response({"detail": "Você não tem permissão para esta ação."}, status=status.HTTP_403_FORBIDDEN)

        friend_request.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FriendshipViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendshipSerializer

    def get_queryset(self):
        user = self.request.user
        return Friendship.objects.filter(Q(user1=user) | Q(user2=user))

    def list(self, request):
        """
        Listar todos os amigos.
        GET /api/friends/
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        """
        Remover uma amizade.
        DELETE /api/friends/<user_id>/
        """
        friend_to_remove = get_object_or_404(User, id=pk)
        user = request.user

        friendship = Friendship.objects.filter(
            (Q(user1=user, user2=friend_to_remove) | Q(user1=friend_to_remove, user2=user))
        ).first()

        if not friendship:
            return Response({"detail": "Amizade não encontrada."}, status=status.HTTP_404_NOT_FOUND)

        friendship.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
