from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Profile

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined']

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'nome', 'arroba', 'stack', 'xp', 'exercicios_concluidos', 'trilhas_concluidas', 'dias_conectados')
    search_fields = ('nome', 'arroba', 'stack')
    list_filter = ('stack',)
    readonly_fields = ('xp', 'exercicios_concluidos', 'trilhas_concluidas', 'dias_conectados')


admin.site.register(CustomUser, CustomUserAdmin)