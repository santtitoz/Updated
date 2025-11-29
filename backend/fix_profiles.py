from django.contrib.auth import get_user_model
from user.models import Profile

User = get_user_model()

print("--- Fixing Missing Profiles ---")
users_without_profile = []
for user in User.objects.all():
    try:
        user.profile
    except Profile.DoesNotExist:
        users_without_profile.append(user)

import random

for user in users_without_profile:
    print(f"Creating profile for user: {user.username} ({user.email})")
    base_arroba = user.username or user.email.split('@')[0]
    
    try:
        Profile.objects.create(
            user=user,
            nome=base_arroba,
            arroba=base_arroba, 
            bio="Olá! Sou novo por aqui.",
            skills=""
        )
        print("  -> Profile created.")
    except Exception as e:
        print(f"  -> Failed to create with arroba='{base_arroba}'. Trying with suffix...")
        # Try with random suffix
        suffix = random.randint(1000, 9999)
        new_arroba = f"{base_arroba}_{suffix}"
        try:
            Profile.objects.create(
                user=user,
                nome=base_arroba,
                arroba=new_arroba, 
                bio="Olá! Sou novo por aqui.",
                skills=""
            )
            print(f"  -> Profile created with arroba='{new_arroba}'.")
        except Exception as e2:
            print(f"  -> FAILED AGAIN: {e2}")

print("--- Done ---")
