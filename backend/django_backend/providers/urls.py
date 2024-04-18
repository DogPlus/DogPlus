from django.urls import path
from .views import list_all_service_providers

urlpatterns = [
    path('service-providers/list/', list_all_service_providers, name='service_provider_list')
]
