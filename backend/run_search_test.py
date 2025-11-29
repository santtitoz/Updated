import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.db.models import Q
from user.models import Profile

User = get_user_model()

def test_search(query):
    print(f"SEARCH: '{query}'")
    queryset = User.objects.all().order_by('-date_joined')
    
    results = queryset.filter(
        Q(username__icontains=query) |
        Q(profile__arroba__icontains=query) |
        Q(profile__nome__icontains=query)
    ).distinct()
    
    print(f"COUNT: {results.count()}")
    for user in results:
        try:
            p = user.profile
            print(f"FOUND: {user.username} (@{p.arroba}) | Active: {user.is_active}")
        except Profile.DoesNotExist:
            print(f"FOUND: {user.username} (NO PROFILE) | Active: {user.is_active}")
    print("-" * 20)

    print("-" * 20)

def check_profile_direct(query):
    print(f"DIRECT PROFILE SEARCH: '{query}'")
    profiles = Profile.objects.filter(
        Q(arroba__icontains=query) |
        Q(nome__icontains=query)
    )
    print(f"COUNT: {profiles.count()}")
    for p in profiles:
        print(f"  - Profile: {p.nome} (@{p.arroba}) -> User: {p.user.username} (ID: {p.user.id})")

if __name__ == "__main__":
    test_search("pegordinho")
    test_search("eliabi")
    test_search("evinha")
    check_profile_direct("evinha")
