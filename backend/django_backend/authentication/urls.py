from django.urls import path
from .views import (
    LoginAPIView,
    RegisterUserAPIView,
    Logout,
    ServiceProviderProfileView,
    pending_service_providers,  # Ensure this is imported
    approve_service_provider  # Ensure this is imported
)
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('register/', RegisterUserAPIView.as_view(), name='register'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', Logout.as_view(), name='logout'),
    path('service-provider/profile/', ServiceProviderProfileView.as_view(), name='service_provider_profile'),
    path('service-providers/pending/', pending_service_providers, name='pending_service_providers'),
    path('service-provider/approve/<uuid:user_uuid>/', approve_service_provider, name='approve_service_provider'),
]
