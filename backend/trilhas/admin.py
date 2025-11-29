from django.contrib import admin

from .models import Trilha, Modulo, Atividade, ProgressoAtividade


@admin.register(Trilha)
class TrilhaAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug')
    search_fields = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Modulo)
class ModuloAdmin(admin.ModelAdmin):
    list_display = ('title', 'trilha', 'order')
    search_fields = ('title', 'trilha__title')
    list_filter = ('trilha',)
    ordering = ('trilha', 'order')


@admin.register(Atividade)
class AtividadeAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'order', 'xp_reward')
    search_fields = ('title', 'module__title', 'module__trilha__title')
    list_filter = ('module__trilha', 'module')
    ordering = ('module__trilha', 'module', 'order')


@admin.register(ProgressoAtividade)
class ProgressoAtividadeAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity', 'status', 'completed_at')
    search_fields = ('user__username', 'activity__title', 'activity__module__title')
    list_filter = ('status', 'activity__module__trilha')
    ordering = ('-completed_at',)
