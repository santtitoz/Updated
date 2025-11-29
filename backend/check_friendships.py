import os
import django
import sys

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from friends.models import Friendship
from django.contrib.auth import get_user_model

User = get_user_model()

def check_friends(username):
    try:
        user = User.objects.get(username=username)
        print(f"Checking friends for {user.username} (ID: {user.id})")
        friends = Friendship.objects.filter(user1=user) | Friendship.objects.filter(user2=user)
        print(f"  Count: {friends.count()}")
        for f in friends:
            u1 = f.user1.username
            u2 = f.user2.username
            print(f"  - {u1} <-> {u2}")
    except User.DoesNotExist:
        print(f"User {username} not found")

# Assuming 'santtitoz' is the logged in user (based on previous logs)
check_friends('santtitoz')
