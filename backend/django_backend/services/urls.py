# urls.py
from django.urls import path
from .views import ServiceCreateUpdateView, ServiceProviderDashboardView

urlpatterns = [
    path('service/', ServiceCreateUpdateView.as_view(), name='service-create'),  # Used for creating services
    path('service/<int:pk>/', ServiceCreateUpdateView.as_view(), name='service-update'),  # Used for updating services
    path('dashboard/', ServiceProviderDashboardView.as_view(), name='service-provider-dashboard'),
]
