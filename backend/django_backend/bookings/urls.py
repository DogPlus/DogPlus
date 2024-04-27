from django.urls import path
from .views import AvailableBookingsView, BookingView, PaymentAccount

urlpatterns = [
    path('', BookingView.as_view(), name='booking'),
    path('available/<int:service_id>', AvailableBookingsView.as_view(), name='available-timeslots'),
    path('payment/account', PaymentAccount.as_view(), name='create-payment-account'),
]
