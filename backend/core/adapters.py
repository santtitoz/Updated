from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.conf import settings
from django.shortcuts import redirect
from django.urls import reverse

class NoFormSocialAccountAdapter(DefaultSocialAccountAdapter):
    """
    Adapter customizado para forçar o redirecionamento imediato para 
    o frontend (Next.js) após a autenticação social, ignorando formulários 
    HTML de confirmação (como /accounts/social/signup/).
    """
    def pre_social_login(self, request, sociallogin):
        """
        Garante que, se houver um conflito ou sucesso, o controle seja 
        devolvido ao frontend para obter o token JWT.
        """
        # Se a conta já existe (Login)
        if sociallogin.is_existing:
            return None # Permite que o allauth processe o login normalmente

        # Se a conta é nova (Signup) ou em conflito
        try:
            # Tenta encontrar um usuário local com o mesmo e-mail
            # Isso é uma forma de forçar a vinculação/login sem formulário
            from django.contrib.auth import get_user_model
            User = get_user_model()
            email = sociallogin.user.email
            if email:
                user = User.objects.get(email=email)
                sociallogin.connect(request, user)
                return redirect(settings.LOGIN_REDIRECT_URL)
        except User.DoesNotExist:
            pass # Nenhuma conta local, continua para o signup/criação normal

        # Se nenhuma das opções acima funcionar e a conta for nova, 
        # forçamos o redirecionamento para o callback do frontend 
        # (o Djoser tratará o token lá)
        if settings.LOGIN_REDIRECT_URL:
            return redirect(settings.LOGIN_REDIRECT_URL)

    def is_open_for_signup(self, request, sociallogin):
        """
        Sempre permite o signup.
        """
        return True