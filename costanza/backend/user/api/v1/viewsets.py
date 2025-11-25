# viewsets.py (garantir a importação)

from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import UserSerializer, UserRegisterSerializer, ProfileSerializer
from user.models import CustomUser, Profile
from user.permissions import IsAdminOrSelf

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSelf]

# ViewSet para o modelo Profile com ações personalizadas
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSelf]

# Ações personalizadas para o ProfileViewSet, completar exercícios, trilhas e registrar dias conectados
    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def retrieve_profile(self, request, pk=None):
        """GET /api/profile/<user_id>/"""
        profile = self.get_object()
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
# Ação personalizada para atualizar o perfil do usuário
    @action(detail=True, methods=['put'], permission_classes=[permissions.IsAuthenticated])
    def update_profile(self, request, pk=None):
        """PUT /api/profile/<user_id>/"""
        profile = self.get_object()
        if request.user.id != profile.user.id:
            return Response({"detail": "Você não tem permissão para editar este perfil."}, status=403)
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
# Ação personalizada para completar um exercício
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def completar_exercicio(self, request, pk=None):
        """Atualiza os campos ao completar um exercício."""
        profile = self.get_object()
        profile.exercicios_concluidos += 1
        profile.xp += request.data.get('xp_ganho', 0)
        profile.save()
        return Response({"detail": "Exercício concluído com sucesso!", "xp": profile.xp, "exercicios_concluidos": profile.exercicios_concluidos})
# Ação personalizada para completar uma trilha
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def completar_trilha(self, request, pk=None):
        """Atualiza os campos ao completar uma trilha."""
        profile = self.get_object()
        profile.trilhas_concluidas += 1
        profile.save()
        return Response({"detail": "Trilha concluída com sucesso!", "trilhas_concluidas": profile.trilhas_concluidas})
# Ação personalizada para registrar um dia conectado
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def registrar_dia_conectado(self, request, pk=None):
        """Incrementa o número de dias conectados."""
        profile = self.get_object()
        profile.dias_conectados += 1
        profile.save()
        return Response({"detail": "Dia conectado registrado com sucesso!", "dias_conectados": profile.dias_conectados})