from rest_framework import serializers
from .models import Comment, Post
from authentication.models import CustomUser
from rest_framework.parsers import MultiPartParser, FormParser

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'profile_image']

class PostSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'author', 'text', 'image', 'date_posted', 'like_count', 'comment_count']

    def get_author(self, obj):
        if self.context.get('nested', False):
            return AuthorSerializer(obj.author, context=self.context).data
        return obj.author_id

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['author'] = self.get_author(instance)
        return data

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'text', 'created_at']
        read_only_fields = ['id', 'post', 'author', 'created_at']

    def get_author_representation(self, obj):
        if self.context.get('nested', False):
            return AuthorSerializer(obj.author, context=self.context).data
        return obj.author_id

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['author'] = self.get_author_representation(instance)
        return data
