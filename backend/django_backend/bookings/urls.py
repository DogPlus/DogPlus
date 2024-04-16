from django.urls import path
from .views import AvailableBookingsView, BookingView

urlpatterns = [
    path('', BookingView.as_view(), name='booking'),
    path('available/<int:service_id>', AvailableBookingsView.as_view(), name='available-timeslots')
]
