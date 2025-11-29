from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from rest_framework_simplejwt.tokens import RefreshToken
import urllib.parse


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    """
    Adapter customizado que gera JWT tokens após login social
    """
    
    def get_login_redirect_url(self, request):
        """
        Sobrescreve o redirect após login social para incluir tokens JWT
        """
        print("=" * 80)
        print("CUSTOM ADAPTER: get_login_redirect_url called")
        print(f"User authenticated: {request.user.is_authenticated}")
        
        if request.user.is_authenticated:
            user = request.user
            print(f"User: {user.email}")
            
            # Gera tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            print(f"Generated access token: {access_token[:50]}...")
            
            # Monta os parâmetros
            params = {
                'access': access_token,
                'refresh': refresh_token,
                'user_id': user.id,
                'user_email': user.email,
                'user_username': user.username or user.email,
            }
            
            # Monta URL de redirecionamento
            redirect_url = f"http://localhost:3000/auth/social-callback?{urllib.parse.urlencode(params)}"
            print(f"Redirecting to: {redirect_url[:100]}...")
            print("=" * 80)
            
            return redirect_url
        
        print("User not authenticated, using default redirect")
        print("=" * 80)
        
        # Fallback
        return super().get_login_redirect_url(request)
