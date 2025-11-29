from django.contrib.auth import get_user_model
from user.models import Profile

User = get_user_model()
usernames = ['pegordinho', 'eliabi']

print("--- Inspecting Users ---")
for username in usernames:
    try:
        user = User.objects.get(username__icontains=username)
        print(f"User found: ID={user.id}, Username={user.username}, Email={user.email}")
        
        try:
            profile = user.profile
            print(f"  Profile found: ID={profile.id}, Nome={profile.nome}, Arroba={profile.arroba}")
        except Profile.DoesNotExist:
            print(f"  Profile MISSING for user {user.username}")
            
    except User.DoesNotExist:
        print(f"User '{username}' NOT FOUND in CustomUser table.")

print("\n--- Listing All Users ---")
for u in User.objects.all():
    print(f"ID: {u.id} | Username: {u.username} | Email: {u.email}")
