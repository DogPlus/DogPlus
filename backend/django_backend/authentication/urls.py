from django.urls import path
from .views import RegisterUserAPIView, Logout  # Import views here
from rest_framework.authtoken.views import obtain_auth_token 

urlpatterns = [
    path('register/', RegisterUserAPIView.as_view(), name='register'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('logout/', Logout.as_view(), name='logout'),
]
