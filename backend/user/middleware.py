from django.shortcuts import redirect
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import RefreshToken
import urllib.parse


class SocialAuthTokenMiddleware(MiddlewareMixin):
    """
    Middleware que intercepta redirects para o callback social e adiciona tokens JWT
    """
    
    def process_response(self, request, response):
        # Verifica se é um redirect (status 302)
        if response.status_code == 302:
            location = response.get('Location', '')
            
            print(f"[MIDDLEWARE] Redirect detectado para: {location}")
            
            # Verifica se está redirecionando para o social-callback
            if 'social-callback' in location and request.user.is_authenticated:
                print(f"[MIDDLEWARE] Usuário autenticado: {request.user.email}")
                
                # Gera tokens JWT
                refresh = RefreshToken.for_user(request.user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)
                
                print(f"[MIDDLEWARE] Tokens gerados")
                
                # Adiciona os parâmetros à URL
                params = {
                    'access': access_token,
                    'refresh': refresh_token,
                    'user_id': request.user.id,
                    'user_email': request.user.email,
                    'user_username': request.user.username or request.user.email,
                }
                
                # Se a URL já tem query params, adiciona com &, senão com ?
                separator = '&' if '?' in location else '?'
                new_location = f"{location}{separator}{urllib.parse.urlencode(params)}"
                
                print(f"[MIDDLEWARE] Nova URL: {new_location[:100]}...")
                
                # Atualiza o redirect
                response['Location'] = new_location
        
        return response
