from django.forms import ValidationError
from django.http import Http404
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
from django.contrib.auth import get_user_model

User = get_user_model()
class ServiceCreateUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsServiceProvider]



    def post(self, request, service_provider_id):
        try:
            service_provider = User.objects.get(pk=service_provider_id)
        except User.DoesNotExist:
            return Response({'detail': 'Service provider not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ServiceSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(service_provider=service_provider)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def patch(self, request, pk=None, service_provider_id=None):
        try:
            service_provider = User.objects.get(pk=service_provider_id)
            service = Service.objects.get(pk=pk, service_provider=service_provider)
        except (User.DoesNotExist, Service.DoesNotExist):
            return Response({'detail': 'Service not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ServiceSerializer(service, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ServiceDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, format=None):
        # Retrieve service
        service = get_object_or_404(Service, pk=pk)
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

class ServiceProviderServiceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, service_provider_id, format=None):
        # Retrieve service provider's service
        service = get_object_or_404(Service, service_provider=service_provider_id)
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

class ServiceProviderDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsServiceProvider]

    def get(self, request):
        user = request.user
        try:
            service = Service.objects.get(service_provider=user)
            service_data = ServiceSerializer(service).data
            bookings = Booking.objects.filter(service_provider=user).order_by('-booking_date')
            bookings_data = BookingSerializer(bookings, many=True).data
        except Service.DoesNotExist:
            service_data = None 
            bookings_data = []

        return Response({
            'service': service_data,
            'bookings': bookings_data
        })


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_id = request.query_params.get('user_id')

        if user_id:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if user.is_superuser:
            return self.get_supervisor_dashboard(user)
        else:
            return self.get_user_dashboard(user)

    def get_supervisor_dashboard(self, user):
        try:
            service = Service.objects.get(service_provider=user)
            service_data = ServiceSerializer(service).data
            bookings = Booking.objects.filter(service_provider=user).order_by('-booking_date')
            bookings_data = BookingSerializer(bookings, many=True).data
        except Service.DoesNotExist:
            service_data = None 
            bookings_data = []

        return Response({
            'service': service_data,
            'bookings': bookings_data
        })    

    def get_user_dashboard(self, user):
        try:
            bookings = Booking.objects.filter(user=user).order_by('-booking_date')
            bookings_data = BookingSerializer(bookings, many=True).data
        except Booking.DoesNotExist:
            bookings_data = []

        return Response({'bookings': bookings_data})


class ServiceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)
