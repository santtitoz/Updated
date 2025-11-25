from rest_framework import serializers
from events.models import Event, EventParticipant
from user.api.v1.serializers import UserSerializer


class EventParticipantSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=EventParticipant._meta.get_field('user').remote_field.model.objects.all(),
        source='user',
        write_only=True
    )

    class Meta:
        model = EventParticipant
        fields = ['id', 'user', 'user_id', 'role', 'registered_at']


class EventSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    creator_id = serializers.PrimaryKeyRelatedField(
        queryset=Event._meta.get_field('creator').remote_field.model.objects.all(),
        source='creator',
        write_only=True
    )
    participants = EventParticipantSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'description',
            'organization',
            'start_datetime',
            'end_datetime',
            'location',
            'thumbnail',
            'banner',
            'creator',
            'creator_id',
            'created_at',
            'updated_at',
            'max_participants',
            'is_public',
            'participants'
        ]
