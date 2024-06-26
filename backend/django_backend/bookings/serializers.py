from rest_framework import serializers
from .models import Booking
from authentication.serializers import UserSerializer  

class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    service_provider = UserSerializer(read_only=True)  

    class Meta:
        model = Booking
        fields = ['id', 'booking_date', 'start_time', 'end_time', 'status', 'user', 'service', 'service_provider']
