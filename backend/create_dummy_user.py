import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from user.models import CustomUser

email = "amigo@teste.com"
password = "password123"
username = "AmigoTeste"

if not CustomUser.objects.filter(email=email).exists():
    user = CustomUser.objects.create_user(email=email, password=password, username=username)
    print(f"User {username} created successfully.")
else:
    print(f"User {username} already exists.")
