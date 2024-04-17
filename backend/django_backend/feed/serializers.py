from rest_framework import serializers
from .models import Post
from rest_framework.parsers import MultiPartParser, FormParser

class PostSerializer(serializers.ModelSerializer):
    parser_classes = (MultiPartParser, FormParser)
    class Meta:
        model = Post
        fields = ['id', 'author', 'text', 'image', 'date_posted', 'like_count', 'comment_count']
