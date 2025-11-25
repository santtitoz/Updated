from django.shortcuts import redirect
from django.views import View
from django.http import HttpResponseRedirect
from allauth.socialaccount.models import SocialLogin
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from rest_framework_simplejwt.tokens import RefreshToken
import urllib.parse
from django.contrib.auth import login as auth_login


def custom_github_callback(request):
    """
    View customizada para processar o callback do GitHub OAuth
    e gerar tokens JWT para o frontend
    """
    # Primeiro, processa o callback normal do Allauth
    from allauth.socialaccount.providers.github.views import oauth2_login, oauth2_callback
    
    # Se for um callback (tem 'code' nos params)
    code = request.GET.get('code')
    if not code:
        return redirect('http://localhost:3000/auth/login?error=no_code')
    
    # Tenta fazer login através do Allauth
    # Isso processa o OAuth e cria/atualiza o usuário
    try:
        # O Allauth já processa isso automaticamente via signals
        # Então vamos apenas redirecionar de volta para o fluxo normal
        # e deixar o adapter cuidar do resto
        from allauth.socialaccount.helpers import complete_social_login
        from allauth.socialaccount.models import SocialApp
        from allauth.socialaccount.providers.github.provider import GitHubProvider
        
        # Apenas redireciona para o handler padrão do allauth
        return oauth2_callback(request)
        
    except Exception as e:
        print(f"Error in GitHub callback: {e}")
        return redirect(f'http://localhost:3000/auth/login?error={str(e)}')
