from django.urls import path
from .views import ServiceCreateUpdateView, ServiceDetail, ServiceProviderDashboardView, ServiceProviderServiceListView
urlpatterns = [
    path('<uuid:service_provider_id>/service/', ServiceCreateUpdateView.as_view(), name='service_create'),
    path('<uuid:service_provider_id>/service/<int:pk>/', ServiceCreateUpdateView.as_view(), name='service_update'),
    path('service/service_provider/<uuid:service_provider_id>/', ServiceProviderServiceListView.as_view(), name='service_provider_service_list'),  # Used for listing services
    path('<int:pk>/', ServiceDetail.as_view(), name='service_detail'),  # Used for updating services
    path('dashboard/', ServiceProviderDashboardView.as_view(), name='service_provider_dashboard'),
]
