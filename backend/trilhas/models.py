from django.conf import settings
from django.db import models
from django.utils import timezone

class Trilha(models.Model):
    # Opções de Categoria para o Front (Abas)
    CATEGORIAS = [
        ('Fundamentos', 'Fundamentos'),
        ('Front-end', 'Front-end'),
        ('Back-end', 'Back-end'),
        ('DevOps', 'DevOps'),
        ('Mobile', 'Mobile'),
        ('Dados', 'Banco de Dados'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    
    # --- CAMPOS VISUAIS ---
    category = models.CharField(
        max_length=50, 
        choices=CATEGORIAS, 
        default='Fundamentos',
        help_text="Categoria para filtro na Home"
    )
    image = models.ImageField(
        upload_to='trilhas/covers/', 
        blank=True, 
        null=True,
        help_text="Imagem de capa do card (proporção ideal 16:9)"
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='trilhas_criadas',
        help_text="Instrutor responsável pela trilha"
    )
    duration = models.CharField(
        max_length=20, 
        default="0h 00m",
        help_text="Duração estimada total (ex: 2h 30m)"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['title']

    def __str__(self) -> str:
        return self.title


class Modulo(models.Model):
    trilha = models.ForeignKey(Trilha, related_name='modules', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, help_text="Breve descrição do que será aprendido neste módulo.")
    order = models.PositiveIntegerField(help_text='Posição sequencial dentro da trilha (1, 2, 3...).')

    class Meta:
        ordering = ['order']
        unique_together = ('trilha', 'order')

    def __str__(self) -> str:
        return f"{self.trilha.title} - Módulo {self.order}: {self.title}"


class Atividade(models.Model):
    # Tipos de Atividade para o Frontend renderizar o ícone correto
    TYPES = [
        ('video', 'Vídeo Aula'),
        ('text', 'Leitura / Artigo'),
        ('quiz', 'Quiz / Desafio'),
    ]

    module = models.ForeignKey(Modulo, related_name='activities', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=TYPES, default='text', help_text="Define o ícone no frontend")
    
    description = models.TextField(blank=True, help_text="Descrição curta para listagem")
    content = models.TextField(blank=True, help_text="Conteúdo em texto ou Markdown")
    video_url = models.URLField(blank=True, null=True, help_text="Link do Youtube/Vimeo (se for vídeo)")
    
    duration = models.CharField(max_length=20, blank=True, help_text="Duração estimada (ex: 10 min)")
    order = models.PositiveIntegerField(help_text='Posição sequencial dentro do módulo.')
    xp_reward = models.PositiveIntegerField(default=10, help_text='XP concedido ao concluir a atividade.')

    class Meta:
        ordering = ['order']
        unique_together = ('module', 'order')

    def __str__(self) -> str:
        return f"[{self.get_type_display()}] {self.title}"


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