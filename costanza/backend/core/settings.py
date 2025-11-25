"""
Django settings for costanza project.
"""

from pathlib import Path
import environ
import os
import sys
from datetime import timedelta 

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))


# --- CONFIGURAÇÃO DE AMBIENTE (.env) ---
env = environ.Env(
    # Definições de tipo para evitar erros
    DEBUG=(bool, True),
    SECRET_KEY=(str, 'django-insecure-p)c#+kt6$-rhjr=+#yhi&u=)vw111v^s-xxjkyswk#+ibn)x07'),
    ALLOWED_HOSTS=(list, []),
)

# Procura e lê o arquivo .env na mesma pasta do settings.py
# (i.e., costanza/costanza/backend/.env)
environ.Env.read_env(env_file=os.path.join(BASE_DIR, '.env'))


# Quick-start development settings - unsuitable for production
SECRET_KEY = env('SECRET_KEY')
DEBUG = env('DEBUG')
ALLOWED_HOSTS = env('ALLOWED_HOSTS')


# Application definition
INSTALLED_APPS = [
    # Django Core
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites', 

    # Third-Party Apps
    'rest_framework',
    'rest_framework_simplejwt', 
    'drf_spectacular',
    'drf_spectacular_sidecar',
    'corsheaders', 
    'djoser', 
    
    # Django-Allauth (Social Auth)
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.github',

    # Your Apps
    'user',
    'friends',
    'events',
    'trilhas',
]

# --- MIDDLEWARE ---
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware', 
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    
    # Allauth Middleware
    'allauth.account.middleware.AccountMiddleware', 
    
    # Custom Social Auth Middleware
    'user.middleware.SocialAuthTokenMiddleware',

    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

# --- CORS (Comunicação com Next.js Frontend) ---
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=["http://localhost:3000"])
CORS_ALLOW_CREDENTIALS = True 


# --- CONFIGURAÇÃO DO REST FRAMEWORK ---
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication', 
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}


# --- CONFIGURAÇÃO DO SIMPLE_JWT ---
SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('Bearer',), 
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60), 
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),    
    'AUTH_TOKEN_CLASSES': (
        'rest_framework_simplejwt.tokens.AccessToken',
    ),
    'SIGNING_KEY': SECRET_KEY, 
}


# --- CONFIGURAÇÃO DO DJOSER ---
DJOSER = {
    'USER_ID_FIELD': 'id',
    'LOGIN_FIELD': 'email', 
    'TOKEN_MODEL': None, 
    
    # Configuração para Social Auth (Allauth)
    'SOCIAL_AUTH': {
        'ALLOWED_PROVIDERS': ['google', 'github'],
        'PROVIDER_MAPPING': {
            'google-oauth2': 'google',
            'github': 'github',
        },
    },

    'SERIALIZERS': {
        'user_create': 'user.serializers.CustomUserCreateSerializer', 
        'user': 'user.serializers.CustomUserSerializer',
        'current_user': 'user.serializers.CustomUserSerializer',
        'token_create': 'djoser.serializers.TokenCreateSerializer',
    },
    
    # URLs de Redirecionamento (Lendo do .env ou usando default)
    'PASSWORD_RESET_CONFIRM_URL': env('PASSWORD_RESET_CONFIRM_URL', default='http://localhost:3000/auth/password/reset/confirm/{uid}/{token}'),
    'USERNAME_RESET_CONFIRM_URL': env('USERNAME_RESET_CONFIRM_URL', default='http://localhost:3000/auth/username/reset/confirm/{uid}/{token}'),
    'SOCIAL_AUTH_ALLOWED_REDIRECTS': env.list('SOCIAL_AUTH_ALLOWED_REDIRECTS', default=['http://localhost:3000']),
}

# Diz ao allauth para não exigir que o usuário confirme o e-mail
ACCOUNT_EMAIL_VERIFICATION = 'none'

# --- CONFIGURAÇÃO DO ALLAUTH (Social Auth) ---
# Adicionada configuração para pular a tela de confirmação e ir direto para o provedor
SOCIALACCOUNT_LOGIN_ON_GET = True
SOCIALACCOUNT_ADAPTER = 'user.adapters.CustomSocialAccountAdapter'

SITE_ID = 1 
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
LOGIN_URL = 'http://localhost:3000/auth/login' 
LOGIN_REDIRECT_URL = 'http://localhost:3000/auth/social-callback'
LOGOUT_REDIRECT_URL = 'http://localhost:3000/auth/login'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# A função env.db() requer a variável DATABASE_URL no .env
DATABASES = {
    'default': env.db(),
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]


# Internationalization
AUTH_USER_MODEL = 'user.CustomUser'
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# Static and Media files
STATIC_URL = 'static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'