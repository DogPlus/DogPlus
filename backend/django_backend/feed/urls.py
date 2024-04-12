from django.urls import path
from .views import CreatePostAPIView, AllPostsFromSpecificUserAPIView, LikePostAPIView, LikedPostsByUserAPIView

urlpatterns = [
    path('create-post/', CreatePostAPIView.as_view(), name='create-post'),
    path('posts/user/<str:user_id>/', AllPostsFromSpecificUserAPIView.as_view(), name='user-posts'),
    path('posts/<int:post_id>/like', LikePostAPIView.as_view(), name='like-post'),
    path('posts/liked_by/<str:user_id>', LikedPostsByUserAPIView.as_view(), name='liked_by'),
]
