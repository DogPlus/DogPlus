from rest_framework import serializers
from .models import Follow
from authentication.serializers import UserDetailSerializer 

class FollowSerializer(serializers.ModelSerializer):
    follower_detail = UserDetailSerializer(source='follower', read_only=True)
    followed_detail = UserDetailSerializer(source='followed', read_only=True)

    class Meta:
        model = Follow
        fields = ['id', 'follower', 'followed', 'is_accepted', 'follower_detail', 'followed_detail']

