from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Follow
from .serializers import FollowSerializer
from rest_framework.permissions import IsAuthenticated
User = get_user_model()

class FollowAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        # Follow a user
        if request.user.id == user_id:
            return Response({"error": "You cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)
        user_to_follow = get_object_or_404(User, id=user_id)
        Follow.objects.get_or_create(follower=request.user, followed=user_to_follow)
        return Response({"status": "following"})

    def delete(self, request, user_id):
        # Unfollow a user
        user_to_unfollow = get_object_or_404(User, id=user_id)
        follow = get_object_or_404(Follow, follower=request.user, followed=user_to_unfollow)
        follow.delete()
        return Response({"status": "unfollowed"})

class FollowerListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # View all followers
        followers = Follow.objects.filter(followed=request.user)
        serializer = FollowSerializer(followers, many=True)
        return Response(serializer.data)

class UserSearchAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Search for users by exact match
        query = request.query_params.get('username')
        if query:
            users = User.objects.filter(username=query)
            return Response({"users": list(users.values('username', 'id'))})
        return Response({"users": []})
