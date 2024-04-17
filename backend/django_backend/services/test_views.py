from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from authentication.models import CustomUser
from .models import Service

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
