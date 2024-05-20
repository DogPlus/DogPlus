from django.urls import path

from .views import (DashboardView, ServiceCreateUpdateView, ServiceDetail,
                    ServiceListView, 
                    ServiceProviderServiceListView)

urlpatterns = [
    path('<uuid:service_provider_id>/service/', ServiceCreateUpdateView.as_view(), name='service_create'),
    path('<uuid:service_provider_id>/service/<int:pk>/', ServiceCreateUpdateView.as_view(), name='service_update'),
    path('service/service_provider/<uuid:service_provider_id>/', ServiceProviderServiceListView.as_view(), name='service_provider_service_list'),  # Used for listing services
    path('<int:pk>/', ServiceDetail.as_view(), name='service_detail'),  # Used for updating services
    path('dashboard/', DashboardView.as_view(), name='service_provider_dashboard'),
    path('list/', ServiceListView.as_view(), name='service_list')
]
