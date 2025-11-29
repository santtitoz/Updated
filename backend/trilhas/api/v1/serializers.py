from rest_framework import serializers

from trilhas.models import Atividade, ProgressoAtividade, Modulo, Trilha


class AtividadeSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    completed_at = serializers.SerializerMethodField()

    class Meta:
        model = Atividade
        fields = [
            'id',
            'title',
            'description',
            'content',
            'order',
            'xp_reward',
            'status',
            'completed_at',
        ]
        read_only_fields = ['status', 'completed_at']

    def _get_progress_map(self):
        return self.context.get('progress_map') or {}

    def get_status(self, obj):
        progress = self._get_progress_map().get(obj.id)
        if progress:
            return progress.status
        return ProgressoAtividade.Status.PENDING

    def get_completed_at(self, obj):
        progress = self._get_progress_map().get(obj.id)
        if progress and progress.completed_at:
            return progress.completed_at
        return None


class ModuloSerializer(serializers.ModelSerializer):
    activities = AtividadeSerializer(many=True, read_only=True)

    class Meta:
        model = Modulo
        fields = [
            'id',
            'title',
            'description',
            'order',
            'activities',
        ]


class TrilhaListSerializer(serializers.ModelSerializer):
    # Campo calculado: Conta quantos módulos existem nessa trilha
    modules_count = serializers.IntegerField(source='modules.count', read_only=True)
    
    # Transforma o ID do autor em Nome (String)
    author = serializers.StringRelatedField()

    class Meta:
        model = Trilha
        fields = [
            'id',
            'title',
            'slug',
            'description',
            # Novos campos visuais
            'category',
            'image',
            'author',
            'duration',
            'modules_count',
        ]

class TrilhaDetailSerializer(serializers.ModelSerializer):
    modules = ModuloSerializer(many=True, read_only=True)
    author = serializers.StringRelatedField() # Adicionado aqui também

    class Meta:
        model = Trilha
        fields = [
            'id',
            'title',
            'slug',
            'description',
            # Novos campos visuais
            'category',
            'image',
            'author',
            'duration',
            'modules', # Mantém a lista de módulos para o detalhe
        ]
