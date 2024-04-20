# urls.py
from django.urls import path
from .views import ServiceCreateUpdateView, ServiceProviderDashboardView

urlpatterns = [
   path('<uuid:service_provider_id>/service/', ServiceCreateUpdateView.as_view(), name='service_create'),
    path('<uuid:service_provider_id>/service/<int:pk>/', ServiceCreateUpdateView.as_view(), name='service_update'),
    path('dashboard/', ServiceProviderDashboardView.as_view(), name='service_provider_dashboard'),
]
