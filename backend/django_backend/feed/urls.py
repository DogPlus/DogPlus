from django.urls import path
from .views import CreatePostAPIView, AllPostsFromSpecificUserAPIView, LikePostAPIView, LikedPostsByUserAPIView, PostCommentsAPIView

urlpatterns = [
    path('create-post/', CreatePostAPIView.as_view(), name='create-post'),
    path('posts/user/<int:user_id>/', AllPostsFromSpecificUserAPIView.as_view(), name='user-posts'),
    path('posts/<int:post_id>/comments', PostCommentsAPIView.as_view(), name='post-comments'),
    path('posts/<int:post_id>/like', LikePostAPIView.as_view(), name='like-post'),
    path('posts/liked_by/<int:user_id>', LikedPostsByUserAPIView.as_view(), name='liked_by'),
]
