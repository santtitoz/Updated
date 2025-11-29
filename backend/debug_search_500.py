import os
import django
from django.db.models import Q

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from user.models import CustomUser

def test_search():
    print("Testing search query...")
    search = "eliabi"
    try:
        queryset = CustomUser.objects.all().order_by('-date_joined')
        queryset = queryset.filter(
            Q(username__icontains=search) |
            Q(profile__arroba__icontains=search) |
            Q(profile__nome__icontains=search)
        ).distinct()
        print(f"Count: {queryset.count()}")
        for u in queryset:
            print(f"Found: {u.email}")
            # Simulate serialization
            try:
                print(f"  Profile Nome: {u.profile.nome}")
            except Exception as ser_e:
                print(f"  Serialization Error for {u.email}: {ser_e}")
    except Exception as e:

        print(f"CRASH: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_search()
