from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import datetime, timedelta
from .models import Booking
from authentication.models import CustomUser
from services.models import Service

class BookingViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create(username='test_user', role=CustomUser.USER)
        self.client.force_authenticate(user=self.user)
        self.service_provider = CustomUser.objects.create(username='provider', role=CustomUser.SERVICE_PROVIDER)
        self.service = Service.objects.create(name='Test Service', service_provider=self.service_provider)
        self.booking_data = {
            'service': self.service.id,
            'user': self.user.id,
            'start_time': '10:00',
            'end_time': '11:00',
            'booking_date': datetime.now().strftime('%Y-%m-%d')
        }

    def test_create_booking(self):
        response = self.client.post(reverse('booking'), self.booking_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Booking.objects.filter(user=self.user).exists())

    def test_create_booking_with_invalid_user_role(self):
        self.user.role = CustomUser.ADMIN
        self.user.save()
        response = self.client.post(reverse('booking'), self.booking_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_booking_with_conflicting_timeslot(self):
        Booking.objects.create(service=self.service, user=self.user, service_provider=self.service_provider,
                               start_time=self.booking_data['start_time'], end_time=self.booking_data['end_time'],
                               booking_date=self.booking_data['booking_date'])
        response = self.client.post(reverse('booking'), self.booking_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class AvailableBookingsViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create(username='test_user', role=CustomUser.USER)
        self.client.force_authenticate(user=self.user)
        self.service_provider = CustomUser.objects.create(username='provider', role=CustomUser.SERVICE_PROVIDER)
        self.service = Service.objects.create(name='Test Service', service_provider=self.service_provider)

    def test_get_available_timeslots(self):
        date = datetime.now().strftime('%Y-%m-%d')
        start_time = '09:00'
        response = self.client.get(reverse('available-timeslots', kwargs={'service_id': self.service.id}),
                                   data={'date': date, 'start_time': start_time})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('timeslots', response.data)
        self.assertIn('interval', response.data)
