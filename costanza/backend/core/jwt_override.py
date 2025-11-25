from django.contrib.auth import get_user_model
from rest_framework import exceptions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as BaseTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView as BaseTokenObtainPairView

User = get_user_model()


class TokenObtainPairSerializer(BaseTokenObtainPairSerializer):
    """Override do serializer padrão para permitir autenticação por email + password.

    Se o cliente enviar 'email' em vez de 'username', buscamos o usuário e
    populamos 'username' para que o fluxo de validação padrão continue.
    """

    def validate(self, attrs):
        # Se veio 'email', converte para 'username' usando o usuário correspondente
        email = attrs.get('email')
        if email and not attrs.get(self.username_field):
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise exceptions.AuthenticationFailed('Credenciais inválidas.')

            # Popula o campo username que o serializer base espera
            attrs[self.username_field] = user.get_username()

        return super().validate(attrs)


class TokenObtainPairView(BaseTokenObtainPairView):
    """View que usa o TokenObtainPairSerializer acima para aceitar email+password."""
    serializer_class = TokenObtainPairSerializer
