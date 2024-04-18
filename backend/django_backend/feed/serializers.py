from rest_framework import serializers
from .models import Comment, Post
from rest_framework.parsers import MultiPartParser, FormParser

class PostSerializer(serializers.ModelSerializer):
    parser_classes = (MultiPartParser, FormParser)
    class Meta:
        model = Post
        fields = ['id', 'author', 'text', 'image', 'date_posted', 'like_count', 'comment_count']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'text', 'created_at']
        read_only_fields = ['id', 'post', 'author', 'created_at']

    def validate_post(self, value):
        # Ensure the post exists
        if not value:
            raise serializers.ValidationError("Post does not exist")
        return value

    def validate_author(self, value):
        # Ensure the author is the user making the request
        if value != self.context['request'].user:
            raise serializers.ValidationError("You are not authorized to comment on this post")
        return value
