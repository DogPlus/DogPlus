from django.urls import path
from .views import CreatePostAPIView

urlpatterns = [
    path('posts/', CreatePostAPIView.as_view(), name='create-post'),
]
