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
    class Meta:
        model = Trilha
        fields = [
            'id',
            'title',
            'slug',
            'description',
        ]


class TrilhaDetailSerializer(serializers.ModelSerializer):
    modules = ModuloSerializer(many=True, read_only=True)

    class Meta:
        model = Trilha
        fields = [
            'id',
            'title',
            'slug',
            'description',
            'modules',
        ]
