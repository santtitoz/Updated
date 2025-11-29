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
    nome = serializers.SerializerMethodField()
    arroba = serializers.SerializerMethodField()

    def get_nome(self, obj):
        return obj.profile.nome if hasattr(obj, 'profile') else None

    def get_arroba(self, obj):
        return obj.profile.arroba if hasattr(obj, 'profile') else None

    class Meta:
        model = CustomUser
        # Campos que queremos exibir na API
        fields = ('id', 'username', 'email', 'date_joined', 'nome', 'arroba')

# Serializer para o modelo Profile com ações personalizadas
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'user', 'nome', 'arroba', 'stack', 'bio', 'skills', 'xp', 'exercicios_concluidos', 'trilhas_concluidas', 'dias_conectados')
        read_only_fields = ('id', 'user', 'xp', 'exercicios_concluidos', 'trilhas_concluidas', 'dias_conectados')
        extra_kwargs = {
            'stack': {'required': False, 'allow_blank': True},
            'bio': {'required': False, 'allow_blank': True},
            'skills': {'required': False, 'allow_blank': True},
            'nome': {'required': False}, # Nome pode ser opcional na atualização parcial? Melhor deixar required se for vazio. Mas allow_blank=False por padrão.
            'arroba': {'required': False}
        } 
