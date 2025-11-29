from rest_framework import serializers
from friends.models import FriendRequest, Friendship
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = FriendRequest
        fields = ('id', 'from_user', 'to_user', 'created_at')
        read_only_fields = ('from_user', 'created_at')


class FriendshipSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()

    class Meta:
        model = Friendship
        fields = ('id', 'friend', 'created_at')

    def get_friend(self, obj):
        request = self.context.get('request')
        if request.user == obj.user1:
            return UserSerializer(obj.user2).data
        return UserSerializer(obj.user1).data
