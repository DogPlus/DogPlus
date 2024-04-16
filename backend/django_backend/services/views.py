from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from authentication.permissions import IsServiceProvider 
from bookings.models import Booking  
from bookings.serializers import BookingSerializer  
from .models import Service
from .serializers import ServiceSerializer
from rest_framework import status



class ServiceCreateUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsServiceProvider]

    def post(self, request):
        # Service creation
        serializer = ServiceSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(service_provider=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        # Update existing service
        service = get_object_or_404(Service, service_provider=request.user)
        serializer = ServiceSerializer(service, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ServiceProviderDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsServiceProvider]

    def get(self, request):
        # Retrieve service provider's service and bookings
        user = request.user
        service = get_object_or_404(Service, service_provider=user)
        bookings = Booking.objects.filter(service_provider=user).order_by('-booking_date')

        service_data = ServiceSerializer(service).data
        bookings_data = BookingSerializer(bookings, many=True).data

        return Response({
            'service': service_data,
            'bookings': bookings_data
        })