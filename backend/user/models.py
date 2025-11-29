from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.conf import settings

# --- NOVO ---
# 1. Crie um Manager customizado
class CustomUserManager(UserManager):
    """
    Manager customizado onde o email é o identificador único
    para autenticação em vez do username.
    """
    def _create_user(self, email, password, **extra_fields):
        """
        Cria e salva um usuário com o email e senha fornecidos.
        """
        if not email:
            raise ValueError('O Email deve ser definido')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        # Define o username como o email por padrão (ou pode ser null)
        if 'username' not in extra_fields:
             extra_fields['username'] = email 
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Cria e salva um Superusuário com o email e senha fornecidos.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser deve ter is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser deve ter is_superuser=True.')
        
        # Define o username como o email por padrão (ou pode ser null)
        if 'username' not in extra_fields:
             extra_fields['username'] = email
        return self._create_user(email, password, **extra_fields)


# --- MODIFICADO ---
# 2. Ajuste seu CustomUser
class CustomUser(AbstractUser):
    # "Neutraliza" o campo username herdado do AbstractUser.
    # Você pode mantê-lo para retrocompatibilidade ou apenas para ter um apelido.
    username = models.CharField(
        max_length=150,
        unique=False, # Não é mais único
        blank=True,    # Pode ser nulo
        null=True
    )
    
    # Promove o email para ser o campo principal e único
    email = models.EmailField(
        'endereço de email', 
        unique=True # Essencial para o login
    )

    # Define 'email' como o campo de login
    USERNAME_FIELD = 'email'
    
    # Remove 'email' da lista de campos obrigatórios (pois já é o USERNAME_FIELD)
    # e remove 'username' (pois agora é opcional).
    REQUIRED_FIELDS = [] 

    # Aponta para o novo manager
    objects = CustomUserManager()

    def __str__(self):
        return self.email


# Model para o perfil do usuário (sem alterações)
class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255)
    arroba = models.CharField(max_length=255, unique=True)
    stack = models.CharField(max_length=255)
    bio = models.TextField()
    skills = models.CharField(max_length=255)
    xp = models.IntegerField(default=0, editable=False)
    exercicios_concluidos = models.IntegerField(default=0, editable=False)
    trilhas_concluidas = models.IntegerField(default=0, editable=False)
    dias_conectados = models.IntegerField(default=0, editable=False)

    def __str__(self):
        return self.nome