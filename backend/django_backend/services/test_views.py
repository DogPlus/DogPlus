from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from authentication.models import CustomUser
from bookings.models import Booking
from bookings.serializers import BookingSerializer
from .serializers import ServiceSerializer
from .models import Service
from django.utils import timezone

User = get_user_model()

class ServiceAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create an admin user
        self.admin_user = User.objects.create_superuser(username='admin', password='adminpass')

        # Create a service provider user
        self.service_provider = User.objects.create_user(username='provider', password='providerpass', role=CustomUser.SERVICE_PROVIDER)
        self.service_provider_token = Token.objects.create(user=self.service_provider)

        # Approve the service provider user
        self.service_provider.is_approved = True
        self.service_provider.save()

        # Authenticate as the service provider
        self.client.force_authenticate(user=self.service_provider)


    def test_service_creation(self):
        url = reverse('service_create')
        data = {
            'name': Service.DOG_TRAINING,
            'description': 'Basic obedience training.',
            'location': '123 Pet Street',
            'price_per_session': 20.00,
            'session_time': 60
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_service_update(self):
        # Create service instance before updating
        service = Service.objects.create(
            name=Service.DOG_TRAINING,
            service_provider=self.service_provider,
            description='Initial description',
            location='Initial location',
            price_per_session=25.00,
            session_time=45
        )

        url = reverse('service_update', kwargs={'pk': service.id})
        update_data = {
            'name': Service.DOG_TRAINING,  
            'description': 'Updated description for training services',
            'price_per_session': 30.00,
            'session_time': 60
        }
        # Authenticate as the service provider
        self.client.force_authenticate(user=self.service_provider)
        response = self.client.patch(url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ServiceProviderDashboardViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a service provider user
        self.service_provider = User.objects.create_user(username='provider', password='providerpass', role=CustomUser.SERVICE_PROVIDER)
        self.service_provider_token = Token.objects.create(user=self.service_provider)

        # Create a test user
        self.test_user = User.objects.create_user(username='testuser', password='testpass', role=CustomUser.USER)

        # Create a service for the service provider
        self.service = Service.objects.create(
            name='Dog Training',
            description='Basic obedience training.',
            location='123 Pet Street',
            price_per_session=20.00,
            session_time=60,
            service_provider=self.service_provider
        )

        # Create some bookings for the service provider by the test user
        self.booking1 = Booking.objects.create(
            service=self.service,
            user=self.test_user, 
            service_provider=self.service_provider, 
            booking_date=timezone.now() + timezone.timedelta(days=1),
            start_time=timezone.now().time(),
            end_time=(timezone.now() + timezone.timedelta(hours=1)).time(),
            status=Booking.PENDING
        )
        self.booking2 = Booking.objects.create(
            service=self.service,
            user=self.test_user,  
            service_provider=self.service_provider,  
            booking_date=timezone.now() + timezone.timedelta(days=2),
            start_time=timezone.now().time(),
            end_time=(timezone.now() + timezone.timedelta(hours=1)).time(),
            status=Booking.PENDING
        )

        # Authenticate as the service provider
        self.client.force_authenticate(user=self.service_provider)

    def test_dashboard_view(self):
        url = reverse('service_provider_dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check if the response contains service and bookings data
        self.assertIn('service', response.data)
        self.assertIn('bookings', response.data)

        # Check if the service data matches with the created service
        service_serializer = ServiceSerializer(instance=self.service)
        self.assertEqual(response.data['service'], service_serializer.data)

        # Check if the bookings data matches with the created bookings
        bookings = Booking.objects.filter(service_provider=self.service_provider).order_by('-booking_date')
        bookings_serializer = BookingSerializer(instance=bookings, many=True)
        self.assertEqual(response.data['bookings'], bookings_serializer.data)
