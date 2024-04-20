from django.shortcuts import render, get_object_or_404

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .models import Post
from authentication.models import CustomUser
from .serializers import CommentSerializer, PostSerializer
from django.contrib.auth.models import User

class CreatePostAPIView(APIView):
    def get(self, request, format=None):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True, context={'request': request, 'nested': True})
        return Response(serializer.data)

    def post(self, request, format=None):
        request.data['author'] = request.user.id

        serializer = PostSerializer(data=request.data, context={'request': request, 'nested': True})
        if serializer.is_valid():
            # Get the CustomUser instance corresponding to the request.user.id
            author_instance = CustomUser.objects.get(id=request.user.id)
            # Set the author field to the author instance
            serializer.validated_data['author'] = author_instance
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AllPostsFromSpecificUserAPIView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Post.objects.filter(author=user_id).order_by('-date_posted')

    def get_serializer_context(self):
        # Include any additional context data that you want to pass to the serializer
        context = super().get_serializer_context()
        context['nested'] = True
        return context

class PostDetailAPIView(APIView):
    def get(self, request, post_id, format=None):
        post = get_object_or_404(Post, pk=post_id)
        serializer = PostSerializer(post, context={'request': request, 'nested': True})
        return Response(serializer.data)

class PostCommentsAPIView(APIView):
    def get(self, request, post_id, format=None):
        post = get_object_or_404(Post, pk=post_id)
        comments = post.comments.all()
        serializer = CommentSerializer(comments, many=True, context={'request': request, 'nested': True})
        return Response(serializer.data)

    def post(self, request, post_id, format=None):
        post = get_object_or_404(Post, pk=post_id)
        serializer = CommentSerializer(data=request.data, context={'request': request, 'nested': True})
        if serializer.is_valid():
            try:
                post.comment_count += 1
                post.save()
            except Exception as e:
                return Response({'error': f'Error updating post {e}'}, status=status.HTTP_400_BAD_REQUEST)
            author_instance = CustomUser.objects.get(id=request.user.id)
            serializer.validated_data['author'] = author_instance
            serializer.save(post=post, author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LikePostAPIView(APIView):
    def post(self, request, post_id, format=None):
        post = get_object_or_404(Post, pk=post_id)
        user = request.user

        # Add like
        post.liked_by.add(user)
        post.like_count += 1
        post.save()
        return Response({'message': 'Like added successfully.'}, status=status.HTTP_200_OK)

    def delete(self, request, post_id, format=None):
        post = get_object_or_404(Post, pk=post_id)
        user = request.user

        # Remove like
        if user in post.liked_by.all():
            post.liked_by.remove(user)
            post.like_count -= 1
            post.save()
            return Response({'message': 'Like removed successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User has not liked this post.'}, status=status.HTTP_400_BAD_REQUEST)

class LikedPostsByUserAPIView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Post.objects.filter(liked_by=user_id).order_by('-date_posted')
