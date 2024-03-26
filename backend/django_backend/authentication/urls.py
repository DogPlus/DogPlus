from django.urls import path, include
from .views import RegisterUserAPIView
from rest_framework.authtoken.views import obtain_auth_token 
from .views import Logout

urlpatterns = [
    path('api/auth/', include('authentication.urls')),
    path('register/', RegisterUserAPIView.as_view(), name='register'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('logout/', Logout.as_view(), name='logout'),
]
