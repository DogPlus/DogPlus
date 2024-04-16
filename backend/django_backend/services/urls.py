from django.urls import path
from .views import ServiceCreateUpdateView, ServiceProviderDashboardView

urlpatterns = [
    path('service/', ServiceCreateUpdateView.as_view(), name='service-create-update'),
    path('dashboard/', ServiceProviderDashboardView.as_view(), name='service-provider-dashboard'),
]
