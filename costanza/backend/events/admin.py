from django.contrib import admin
from .models import Event, EventParticipant

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_datetime', 'location', 'creator_username', 'is_public', 'created_at')
    list_filter = ('is_public', 'start_datetime')
    search_fields = ('title', 'description', 'location')
    readonly_fields = ('created_at', 'updated_at')

    def creator_username(self, obj):
        return obj.creator.username if obj.creator else None
    creator_username.short_description = 'Creator'

@admin.register(EventParticipant)
class EventParticipantAdmin(admin.ModelAdmin):
    list_display = ('event_title', 'user_username', 'role', 'registered_at')
    list_filter = ('role', 'registered_at')
    search_fields = ('event__title', 'user__username')

    def event_title(self, obj):
        return obj.event.title if obj.event else None
    event_title.short_description = 'Event'

    def user_username(self, obj):
        return obj.user.username if obj.user else None
    user_username.short_description = 'User'