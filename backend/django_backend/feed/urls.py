from django.urls import path
from .views import CreatePostAPIView, AllPostsFromSpecificUserAPIView

urlpatterns = [
    path('create-post/', CreatePostAPIView.as_view(), name='create-post'),
    path('posts/user/<int:user_id>/', AllPostsFromSpecificUserAPIView.as_view(), name='user-posts'),
]
