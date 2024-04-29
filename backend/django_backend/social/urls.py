from django.urls import path
from .views import FollowAPIView, FollowerListView, UserSearchAPIView, AcceptFollowRequestAPIView, FollowRequestListView

urlpatterns = [
    path('follow/<uuid:user_id>/', FollowAPIView.as_view(), name='follow-user'),
    path('unfollow/<uuid:user_id>/', FollowAPIView.as_view(), name='unfollow-user'),
    path('followers/', FollowerListView.as_view(), name='follower-list'),
    path('search/', UserSearchAPIView.as_view(), name='user-search'),
    path('accept-follow/<uuid:follow_id>/', AcceptFollowRequestAPIView.as_view(), name='accept-follow'),
    path('follow-requests/', FollowRequestListView.as_view(), name='follow-requests'),
]