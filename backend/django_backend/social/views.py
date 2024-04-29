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
        if request.user.id == user_id:
            return Response({"error": "You cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)
        
        user_to_follow = get_object_or_404(User, id=user_id)
        follow, created = Follow.objects.get_or_create(follower=request.user, followed=user_to_follow, defaults={'is_accepted': False})
        
        if created:
            return Response({"status": "follow request sent"})
        else:
            return Response({"status": "already sent follow request"})

class AcceptFollowRequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, follow_id):
        follow_request = get_object_or_404(Follow, id=follow_id, followed=request.user)
        
        if follow_request.is_accepted:
            return Response({"error": "Follow request already accepted"}, status=status.HTTP_400_BAD_REQUEST)
        
        follow_request.is_accepted = True
        follow_request.save()

        # Automatically create the reciprocal follow
        Follow.objects.get_or_create(follower=follow_request.followed, followed=follow_request.follower, is_accepted=True)
        
        return Response({"status": "Follow accepted and mutual follow created"})


class FollowerListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        followers = Follow.objects.filter(followed=request.user, is_accepted=True)
        serializer = FollowSerializer(followers, many=True)
        return Response(serializer.data)

class FollowRequestListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Follow requests that are not yet accepted
        follow_requests = Follow.objects.filter(followed=request.user, is_accepted=False)
        serializer = FollowSerializer(follow_requests, many=True)
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
