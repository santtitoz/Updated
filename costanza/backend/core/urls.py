"""
URL configuration for costanza project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # ----------------------------------------------------
    # --- 1. ROTAS DE AUTENTICAÇÃO (DJOSER + JWT + OAuth) ---
    # ----------------------------------------------------
    
    # Rotas base do Djoser (users/, activation, reset de senha)
    # DEVE VIR PRIMEIRO, para que as rotas menores sejam resolvidas depois.
    # Ex: POST /api/auth/users/ (Registro)
    path('api/auth/', include('djoser.urls')),
    
    # Rotas para JWT: /api/auth/jwt/create (Login), /api/auth/jwt/refresh, /api/auth/jwt/verify
    path('api/auth/', include('djoser.urls.jwt')), 
    
    # Rotas para Autenticação Social (Djoser Social Endpoints)
    # Endpoint de troca de código: POST /api/auth/o/github/
    path('api/auth/', include('djoser.social.urls')), 
    
    # Rotas de redirecionamento do Allauth (necessárias para o fluxo OAuth)
    # Ex: GET /accounts/github/login/
    path('accounts/', include('allauth.urls')), 
    
    # Alias para compatibilidade com frontend - Token Refresh
    path('api/token/', include('djoser.urls.jwt')),


    # ----------------------------------------------------
    # --- 2. ROTAS DE DOCUMENTAÇÃO (DRF SPECTACULAR) ---
    # ----------------------------------------------------
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),


    # ----------------------------------------------------
    # --- 3. ROTAS DA SUA API (v1) ---
    # ----------------------------------------------------
    
    # Rotas de usuários e autenticação
    path('api/v1/users/', include('user.api.v1.router')),
    # Rotas de amizades
    path('api/v1/friends/', include('friends.api.v1.router')),
    # Rotas de eventos universitários
    path('api/v1/events/', include('events.api.v1.router')),
    # Rotas do sistema de estudos
    path('api/v1/trilhas/', include('trilhas.api.v1.router')),
]

# Adiciona URLs para servir arquivos de mídia em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)