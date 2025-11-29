from django.contrib.auth import get_user_model
from django.db.models import Q
from user.models import Profile

User = get_user_model()

def test_search(query):
    print(f"\n--- Searching for '{query}' ---")
    queryset = User.objects.all().order_by('-date_joined')
    
    # Replicating the logic from UserViewSet
    results = queryset.filter(
        Q(username__icontains=query) |
        Q(profile__arroba__icontains=query) |
        Q(profile__nome__icontains=query)
    ).distinct()
    
    print(f"Found {results.count()} results:")
    for user in results:
        try:
            p = user.profile
            print(f"  - User: {user.username} (ID: {user.id}) | Profile: {p.nome} (@{p.arroba})")
        except Profile.DoesNotExist:
            print(f"  - User: {user.username} (ID: {user.id}) | NO PROFILE")

test_search("pegordinho")
test_search("eliabi")

