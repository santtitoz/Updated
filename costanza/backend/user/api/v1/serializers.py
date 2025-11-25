from rest_framework import serializers
from user.models import CustomUser, Profile

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        # Campos que queremos exibir na API
        fields = ('id', 'username', 'email', 'date_joined')

# Serializer para o modelo Profile com ações personalizadas
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'user', 'nome', 'arroba', 'stack', 'bio', 'skills', 'xp', 'exercicios_concluidos', 'trilhas_concluidas', 'dias_conectados') 
