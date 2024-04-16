from django.urls import path
from .views import BookingView

urlpatterns = [
    path('bookings/<str:service_provider_id>', BookingView.as_view(), name='booking'),
    path('bookings/available/<str:service_provider_id>', BookingView.as_view(), name='available-timeslots')
]
