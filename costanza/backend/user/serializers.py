from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from rest_framework import serializers

# Obtém o modelo CustomUser definido em settings.py
User = get_user_model()


class CustomUserCreateSerializer(UserCreateSerializer):
    """
    Serializer usado para REGISTRO de novos usuários (POST /api/auth/users/).
    Se o frontend não enviar `username`, geramos automaticamente a partir do email
    (parte antes do @) garantindo unicidade adicionando um sufixo quando necessário.
    """

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'password', 'username')

    # Torna o campo username opcional na validação inicial
    username = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        # Se username não foi fornecido, gere a partir do email
        if not validated_data.get('username'):
            email = validated_data.get('email', '')
            base = email.split('@')[0] if email else 'user'
            username_candidate = slugify(base) or 'user'

            original = username_candidate
            counter = 0
            # Garanta unicidade
            while User.objects.filter(username=username_candidate).exists():
                counter += 1
                username_candidate = f"{original}{counter}"

            validated_data['username'] = username_candidate

        return super().create(validated_data)


class CustomUserSerializer(UserSerializer):
    """
    Serializer usado para LEITURA de dados do usuário (GET /api/auth/users/me/).
    """

    class Meta(UserSerializer.Meta):
        model = User
        # Campos que serão retornados ao frontend após login/registro/GET /me
        fields = ('id', 'email', 'username')
        read_only_fields = ('email',)