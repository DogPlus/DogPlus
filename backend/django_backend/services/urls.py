# urls.py
from django.urls import path
from .views import ServiceCreateUpdateView, ServiceProviderDashboardView

urlpatterns = [
    path('service/', ServiceCreateUpdateView.as_view(), name='service_create'),  # Used for creating services
    path('service/<int:pk>/', ServiceCreateUpdateView.as_view(), name='service_update'),  # Used for updating services
    path('dashboard/', ServiceProviderDashboardView.as_view(), name='service_provider_dashboard'),
]
