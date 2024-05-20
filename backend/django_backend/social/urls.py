# urls.py
from django.urls import path
from .views import (FollowAPIView, FollowerListView, UserSearchAPIView, AcceptFollowRequestAPIView,
                    FollowRequestListView, SentFollowRequestListView, CancelFollowRequestAPIView)

urlpatterns = [
    path('follow/<uuid:user_id>/', FollowAPIView.as_view(), name='follow-user'),
    path('unfollow/<uuid:user_id>/', FollowAPIView.as_view(), name='unfollow-user'),
    path('followers/', FollowerListView.as_view(), name='follower-list'),
    path('search/', UserSearchAPIView.as_view(), name='user-search'),
    path('accept-follow/<int:follow_id>/', AcceptFollowRequestAPIView.as_view(), name='accept-follow'),
    path('follow-requests/', FollowRequestListView.as_view(), name='follow-requests'),
    path('sent-requests/', SentFollowRequestListView.as_view(), name='sent-requests'),
    path('cancel-request/<int:follow_id>/', CancelFollowRequestAPIView.as_view(), name='cancel-request'),
]

