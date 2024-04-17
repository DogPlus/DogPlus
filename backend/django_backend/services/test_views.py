from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from .models import Service

User = get_user_model()

class ServiceAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create an admin user
        self.admin_user = User.objects.create_superuser(username='admin', password='adminpass')

        # Create a service provider user
        self.service_provider = User.objects.create_user(username='provider', password='providerpass')
        self.service_provider_token = Token.objects.create(user=self.service_provider)

        # Authenticate as the admin user
        self.client.force_authenticate(user=self.admin_user)

        # Approve the service provider user
        approval_url = reverse('approve-service-provider', kwargs={'user_uuid': self.service_provider.uuid})
        self.client.patch(approval_url)

    def test_service_creation(self):
        url = reverse('service-create')  
        data = {
            'name': Service.DOG_TRAINING,
            'description': 'Basic obedience training.',
            'location': '123 Pet Street',
            'price_per_session': 20.00,
            'session_time': 60
        }
        # Authenticate as the service provider
        self.client.force_authenticate(user=self.service_provider)
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

        url = reverse('service-update', kwargs={'pk': service.id})
        update_data = {
            'description': 'Updated description for training services',
            'price_per_session': 30.00,
            'session_time': 60
        }
        # Authenticate as the service provider
        self.client.force_authenticate(user=self.service_provider)
        response = self.client.patch(url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
