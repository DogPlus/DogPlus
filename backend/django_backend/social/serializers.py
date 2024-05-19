from rest_framework import serializers
from .models import Follow
from authentication.serializers import UserDetailSerializer 

class FollowSerializer(serializers.ModelSerializer):
    follower = UserDetailSerializer(read_only=True)
    followed = UserDetailSerializer(read_only=True)

    class Meta:
        model = Follow
        fields = ['id', 'follower', 'followed', 'is_accepted']

