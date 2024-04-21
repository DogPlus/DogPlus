from django.urls import path
from .views import ServiceProviderDetail, list_all_service_providers

urlpatterns = [
    path('service-providers/list/', list_all_service_providers, name='service_provider_list'),
    path('service-providers/<uuid:id>', ServiceProviderDetail.as_view() , name='service_provider_list')
]
