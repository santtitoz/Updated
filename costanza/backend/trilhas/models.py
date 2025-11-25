from django.conf import settings
from django.db import models
from django.utils import timezone


class Trilha(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['title']

    def __str__(self) -> str:
        return self.title


class Modulo(models.Model):
    trilha = models.ForeignKey(Trilha, related_name='modules', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(help_text='Posição sequencial dentro da trilha.')

    class Meta:
        ordering = ['order']
        unique_together = ('trilha', 'order')

    def __str__(self) -> str:
        return f"{self.trilha.title} - {self.title}"


class Atividade(models.Model):
    module = models.ForeignKey(Modulo, related_name='activities', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    content = models.TextField(blank=True)
    order = models.PositiveIntegerField(help_text='Posição sequencial dentro do módulo.')
    xp_reward = models.PositiveIntegerField(default=10, help_text='XP concedido ao concluir a atividade.')

    class Meta:
        ordering = ['order']
        unique_together = ('module', 'order')

    def __str__(self) -> str:
        return f"{self.module.title} - {self.title}"


class ProgressoAtividade(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pendente'
        COMPLETED = 'completed', 'Concluída'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='activity_progress', on_delete=models.CASCADE)
    activity = models.ForeignKey(Atividade, related_name='progress_records', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'activity')

    def mark_completed(self) -> None:
        self.status = self.Status.COMPLETED
        self.completed_at = timezone.now()
        self.save(update_fields=['status', 'completed_at'])

    def __str__(self) -> str:
        return f"{self.user} - {self.activity} ({self.status})"
