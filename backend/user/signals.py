from django.dispatch import receiver
from allauth.account.signals import user_logged_in
from rest_framework_simplejwt.tokens import RefreshToken
import urllib.parse
import logging

logger = logging.getLogger(__name__)


@receiver(user_logged_in)
def redirect_with_tokens(sender, request, user, **kwargs):
    """
    Signal que é chamado quando um usuário faz login (incluindo login social).
    Gera tokens JWT e redireciona para o frontend.
    """
    logger.info(f"Signal user_logged_in called for user: {user.email}")
    
    # Verifica se é um login social (não tem session_key 'traditional_login')
    if not request.session.get('traditional_login'):
        logger.info("Social login detected, generating JWT tokens")
        
        # Gera tokens JWT
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        # Cria parâmetros
        params = {
            'access': access_token,
            'refresh': refresh_token,
            'user_id': user.id,
            'user_email': user.email,
            'user_username': user.username or user.email,
        }
        
        redirect_url = f"http://localhost:3000/auth/social-callback?{urllib.parse.urlencode(params)}"
        logger.info(f"Setting redirect URL: {redirect_url}")
        
        # Define o redirect URL na sessão para ser usado pelo adapter
        request.session['social_redirect_url'] = redirect_url

from django.db.models.signals import post_save
from .models import CustomUser, Profile

@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Cria um perfil padrão
        Profile.objects.create(
            user=instance,
            nome=instance.username or instance.email.split('@')[0],
            arroba=instance.email.split('@')[0],
            stack="Iniciante",
            bio="Olá! Sou novo por aqui.",
            skills="Python, Django"
        )

