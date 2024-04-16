from datetime import datetime, timedelta

from bookings.utils import filter_out_unavailable_timeslots, generate_possible_timeslots
from services.models import Service
from .models import Booking
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from authentication.models import CustomUser
from .serializers import BookingSerializer
from rest_framework import status


class BookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Ensure the user creating the booking has the "User" role
        if request.user.role != CustomUser.USER:
            return Response({"detail": "Only users can create bookings."}, status=status.HTTP_403_FORBIDDEN)

        request.data['service_provider'] = Service.objects.get(id=request.data['service']).service_provider.id
        # Assuming the service is valid and included in request.data
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            # Get the service from the serializer
            service = serializer.validated_data['service']
            # Infer the service provider from the service
            service_provider = service.service_provider
            # Save the booking with the inferred service provider
            serializer.save(user=request.user, service_provider=service_provider)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AvailableBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get_available_timeslots(self, service_id, date, start_time, interval):
        # Parse date string to datetime object
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        # Parse start time string to time object
        start_time_obj = datetime.strptime(start_time, '%H:%M').time()
        
        # Get bookings for the service provider for the specified date
        bookings = Booking.objects.filter(
            service_id=service_id,
            booking_date=date_obj
        ).values_list('start_time', 'end_time')

        start_time = datetime.combine(date_obj, start_time_obj)
        end_time = datetime.combine(date_obj, start_time_obj) + timedelta(hours=3)
        
        timeslots = generate_possible_timeslots(start_time, end_time, interval=interval)
        # Filter out timeslots that are already booked
        available_timeslots = filter_out_unavailable_timeslots(bookings, timeslots)
        return available_timeslots

    def get(self, request, service_id, *args, **kwargs):
        date = request.query_params.get('date')
        start_time = request.query_params.get('start_time')
        if not date:
            return Response({"error": "Date parameter is missing"}, status=400)
        if not start_time:
            return Response({"error": "start_time parameter is missing"}, status=400)
        interval = Service.objects.get(id=service_id).session_time
        available_timeslots = self.get_available_timeslots(service_id, date, start_time, interval)
        return Response({
            "timeslots": available_timeslots,
            "interval": interval
        })
