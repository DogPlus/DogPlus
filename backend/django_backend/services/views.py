# services/views.py
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from backend.django_backend.authentication.permissions import IsServiceProvider
from .models import Service
from .serializers import ServiceSerializer
from bookings.models import Booking
from bookings.serializers import BookingSerializer

class ServiceProviderDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsServiceProvider]

    def get(self, request):
        user = request.user
        service = get_object_or_404(Service, service_provider=user)
        bookings = Booking.objects.filter(service_provider=user).order_by('-booking_date')
        
        service_data = ServiceSerializer(service).data
        bookings_data = BookingSerializer(bookings, many=True).data
        
        return Response({
            'service': service_data,
            'bookings': bookings_data
        })
