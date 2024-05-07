from django.urls import path
from .views import AvailableBookingsView, BookingView

urlpatterns = [
    path('', BookingView.as_view(), name='booking'),  # Handles posting a new booking
    path('<int:booking_id>/', BookingView.as_view(), name='booking-detail'),  # Handles delete for a specific booking
    path('available/<int:service_id>', AvailableBookingsView.as_view(), name='available-timeslots'),
]
