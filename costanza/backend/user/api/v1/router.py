from django.urls import path, include
from rest_framework.routers import DefaultRouter # <-- Importamos o router
from .viewsets import RegisterView, UserViewSet, ProfileViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# 1. Criamos a instância do router
router = DefaultRouter()

# 2. Registramos nosso ViewSet no router
#    Isso diz: "crie todas as URLs para o UserViewSet sob o prefixo 'management'"
router.register(r'management', UserViewSet, basename='user-management')
# Cria todas as URLs para o ProfileViewSet sob o prefixo 'profile'
router.register(r'profile', ProfileViewSet, basename='profile')

# 3. Adicionamos as URLs do router às nossas urlpatterns
urlpatterns = [
    # Rotas manuais para ações específicas
    path('register/', RegisterView.as_view(), name='user-register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    # Rotas geradas automaticamente pelo router
    path('', include(router.urls)), # <-- A MÁGICA ACONTECE AQUI
]