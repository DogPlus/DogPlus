from django.urls import path
from .views import AvailableBookingsView, BookingView, DeleteBookingView

urlpatterns = [
    path('', BookingView.as_view(), name='booking'),  # Handles posting a new booking
    path('delete/<int:booking_id>/', DeleteBookingView.as_view(), name='booking-delete'),  # Handles delete for a specific booking
    path('<int:booking_id>/', BookingView.as_view(), name='booking-detail'),  # Handles delete for a specific booking
    path('available/<int:service_id>', AvailableBookingsView.as_view(), name='available-timeslots'),
]
