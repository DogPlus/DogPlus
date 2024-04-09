from django.urls import path
from .views import CreatePostAPIView

urlpatterns = [
    path('create-post/', CreatePostAPIView.as_view(), name='create-post'),
]
