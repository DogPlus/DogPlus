from datetime import datetime, timedelta
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

        # Extract service_provider_id from the request and validate the role
        service_provider_id = request.data.get('service_provider')
        try:
            service_provider = CustomUser.objects.get(id=service_provider_id)
            if service_provider.role != CustomUser.SERVICE_PROVIDER:
                return Response({"detail": "Invalid service provider."}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Service provider not found."}, status=status.HTTP_404_NOT_FOUND)

        # Assuming the service is valid and included in request.data
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, service_provider=service_provider)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AvailableBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get_available_timeslots(self, service_provider_id, date, start_time):
        # Parse date string to datetime object
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        # Parse start time string to time object
        start_time_obj = datetime.strptime(start_time, '%H:%M').time()
        
        # Get bookings for the service provider for the specified date
        bookings = Booking.objects.filter(
            service_provider_id=service_provider_id,
            booking_date=date_obj
        ).values_list('start_time', 'end_time')

        # Generate list of all possible timeslots in 30-minute intervals for the specified date
        start_time = datetime.combine(date_obj, start_time_obj)
        end_time = datetime.combine(date_obj, start_time_obj) + timedelta(hours=3)
        timeslots = []
        current_time = start_time
        while current_time < end_time:
            timeslots.append(current_time.time())
            current_time += timedelta(minutes=30)
        
        # Filter out timeslots that are already booked
        available_timeslots = []
        for timeslot in timeslots:
            is_booked = any(
                booking[0] <= timeslot < booking[1] for booking in bookings
            )
            if not is_booked:
                available_timeslots.append(timeslot.strftime('%H:%M'))

        return available_timeslots

    def get(self, request, service_provider_id, *args, **kwargs):
        date = request.query_params.get('date')
        start_time = request.query_params.get('start_time')
        if not date:
            return Response({"error": "Date parameter is missing"}, status=400)
        if not start_time:
            return Response({"error": "start_time parameter is missing"}, status=400)

        available_timeslots = self.get_available_timeslots(service_provider_id, date, start_time)
        return Response(available_timeslots)
