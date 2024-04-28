from django.urls import path
from .views import FollowAPIView, FollowerListView, UserSearchAPIView

urlpatterns = [
    path('follow/<int:user_id>/', FollowAPIView.as_view(), name='follow-user'),
    path('unfollow/<int:user_id>/', FollowAPIView.as_view(), name='unfollow-user'),
    path('followers/', FollowerListView.as_view(), name='follower-list'),
    path('search/', UserSearchAPIView.as_view(), name='user-search'),
]