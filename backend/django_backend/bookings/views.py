from datetime import datetime, timedelta
from django.db import transaction
from bookings.utils import filter_out_unavailable_timeslots, generate_possible_timeslots
from services.models import Service
from .models import Booking
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from authentication.models import CustomUser
from .serializers import BookingSerializer
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied
import logging


class BookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Ensure the user creating the booking has the "User" role
        if request.user.role != CustomUser.USER:
            return Response({"detail": "Only users can create bookings."}, status=status.HTTP_403_FORBIDDEN)

        # Create a mutable copy of request.data
        mutable_data = request.data.copy()

        # Retrieve service ID from the request data
        service_id = mutable_data.get('service')

        # Ensure service ID is provided
        if not service_id:
            return Response({"detail": "Service ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve service provider ID from the service
        try:
            service_provider_id = Service.objects.get(id=service_id).service_provider.id
        except Service.DoesNotExist:
            return Response({"detail": "Service not found."}, status=status.HTTP_400_BAD_REQUEST)

        # Update the copy of request.data with the service provider ID
        mutable_data['service_provider'] = service_provider_id

        # Assuming the service is valid and included in request.data
        serializer = BookingSerializer(data=mutable_data)
        if serializer.is_valid():
            # Get the service from the serializer
            service = serializer.validated_data['service']
            # Infer the service provider from the service
            service_provider = service.service_provider

            # Extract start_time and end_time from request data
            start_time = serializer.validated_data['start_time']
            end_time = serializer.validated_data['end_time']
            booking_date = serializer.validated_data['booking_date']

            # Check if the timeslot is available
            if not self.is_timeslot_available(service.id, service_provider.id, booking_date, start_time, end_time):
                return Response({"detail": "The timeslot is already booked."}, status=status.HTTP_400_BAD_REQUEST)

            # Save the booking with the inferred service provider
            with transaction.atomic():
                serializer.save(user=request.user, service_provider=service_provider)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def is_timeslot_available(self, service_id, service_provider_id, booking_date, start_time, end_time):
        # Check if there are any overlapping bookings for the given timeslot
        existing_bookings = Booking.objects.filter(
            service_id=service_id,
            service_provider_id=service_provider_id,
            booking_date=booking_date,
            start_time__lt=end_time,
            end_time__gt=start_time
        )
        return not existing_bookings.exists()
    


class DeleteBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id, format=None):
        try:
            # Allow deletion if the request user is the owner or the service provider of the booking
            booking = Booking.objects.get(id=booking_id)
            logging.info("Deleting Booking: %s", booking)
            if booking.user != request.user and booking.service_provider != request.user:
                logging.exception("Permission Denied: User does not have permission to delete the booking.")
                return Response({"detail": "You do not have permission to delete this booking."}, status=status.HTTP_403_FORBIDDEN)
        except Booking.DoesNotExist:
            logging.exception("Booking not found.")
            return Response({"detail": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)
            
        booking.delete()
        return Response({"detail": "Booking successfully deleted."}, status=status.HTTP_204_NO_CONTENT)

class AvailableBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get_available_timeslots(self, service_id, date, start_time, end_time, interval):
        # Parse date string to datetime object
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        # Parse start time string to time object
        start_time_obj = datetime.strptime(start_time, '%H:%M').time()
        end_time_obj = datetime.strptime(end_time, '%H:%M').time()
        
        # Get bookings for the service provider for the specified date
        bookings = Booking.objects.filter(
            service_id=service_id,
            booking_date=date_obj
        ).values_list('start_time', 'end_time')

        start_time = datetime.combine(date_obj, start_time_obj)
        end_time = datetime.combine(date_obj, end_time_obj)
        
        timeslots = generate_possible_timeslots(start_time, end_time, interval=interval)
        # Filter out timeslots that are already booked
        print("Possible timeslots")
        print(timeslots)
        available_timeslots = filter_out_unavailable_timeslots(bookings, timeslots)
        return available_timeslots

    def get(self, request, service_id, *args, **kwargs):
        date = request.query_params.get('date')
        start_time = request.query_params.get('start_time')
        end_time = request.query_params.get('end_time')
        if not date:
            return Response({"error": "Date parameter is missing"}, status=400)
        if not start_time:
            return Response({"error": "start_time parameter is missing"}, status=400)
        if not end_time:
            return Response({"error": "end_time parameter is missing"}, status=400)
        interval = Service.objects.get(id=service_id).session_time
        available_timeslots = self.get_available_timeslots(service_id, date, start_time, end_time, interval)
        return Response({
            "timeslots": available_timeslots,
            "interval": interval
        })
