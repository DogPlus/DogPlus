from django.urls import path
from .views import AvailableBookingsView, BookingView

urlpatterns = [
    path('<str:service_provider_id>', BookingView.as_view(), name='booking'),
    path('available/<str:service_provider_id>', AvailableBookingsView.as_view(), name='available-timeslots')
]
