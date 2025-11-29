from django.db import models
from django.conf import settings

"""Armazenamento de imagens em base64.
Para simplificar
e seguir a solicitação, os thumbnails e banners agora serão armazenados como
strings (base64). Isso evita a dependência de sistema de arquivos para uploads
e facilita consumo direto pela API frontend.
"""

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    organization = models.CharField(max_length=100) 
    start_datetime = models.DateTimeField()  
    end_datetime = models.DateTimeField()    
    location = models.CharField(max_length=200)
    # thumbnail será a imagem codificada em base64 (PNG ou JPEG)
    thumbnail = models.TextField(
        null=True,
        blank=True,
        help_text="Imagem em base64 (data URI ou conteúdo base64) para listagem"
    )

    # banner será a imagem codificada em base64 (PNG ou JPEG)
    banner = models.TextField(
        null=True,
        blank=True,
        help_text="Imagem em base64 (data URI ou conteúdo base64) para cabeçalho"
    )

    # cretator é o usuário que criou o evento
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='created_events',
        on_delete=models.CASCADE
    )
    # Data de criação e atualização automática
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    max_participants = models.PositiveIntegerField(null=True, blank=True)
    is_public = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    # Ordenar eventos pela data de início
    class Meta:
        ordering = ['start_datetime']


class EventParticipant(models.Model):
    ROLE_CHOICES = [
        ('attendee', 'Attendee'),
        ('organizer', 'Organizer'),
        ('speaker', 'Speaker'),
    ]

    event = models.ForeignKey(
        Event,
        related_name='participants',
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='event_participations',
        on_delete=models.CASCADE
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='attendee')
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'user')
        ordering = ['registered_at']

    def __str__(self):
        return f"{self.user.username} - {self.event.title} ({self.role})"