import os
import django
import sys

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from user.models import Profile

User = get_user_model()

try:
    # Find the user who currently has arroba 'eliabi' (santtitoz)
    # Based on previous log: FOUND: santtitoz (@eliabi)
    user = User.objects.get(username='santtitoz')
    print(f"Found user: {user.username}")
    
    profile = user.profile
    print(f"Current Profile: {profile.nome} (@{profile.arroba})")
    
    print("Updating arroba to 'evinha'...")
    profile.arroba = 'evinha'
    profile.nome = 'Evinha'
    profile.save()
    
    # Manually trigger the sync logic (since signals/viewsets aren't running here)
    # But wait, I put the sync logic in the VIEWSET, not the MODEL/SIGNAL.
    # So I need to manually update the username too to simulate what the ViewSet does.
    
    print("Syncing username to 'evinha'...")
    user.username = 'evinha'
    user.save()
    
    print(f"User updated. New Username: {user.username}, New Arroba: {profile.arroba}")

except User.DoesNotExist:
    print("User 'santtitoz' not found.")
except Exception as e:
    print(f"Error: {e}")
