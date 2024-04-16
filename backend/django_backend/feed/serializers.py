from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'author', 'text', 'image', 'date_posted', 'like_count', 'comment_count']
