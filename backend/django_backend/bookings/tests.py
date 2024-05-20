from datetime import datetime
from authentication.models import CustomUser
from django.core import mail
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from services.models import Service

from .models import Booking


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



class EmailSendTestCase(TestCase):
    def setUp(self):
        # Create a user and a service provider
        self.user = CustomUser.objects.create_user('user@example.com', 'password123', role=CustomUser.USER)
        self.service_provider = CustomUser.objects.create_user('provider@example.com', 'password123', role=CustomUser.SERVICE_PROVIDER)
        self.service = Service.objects.create(name="Test Service", service_provider=self.service_provider)
        
        # Create a booking
        self.booking = Booking.objects.create(
            user=self.user,
            service_provider=self.service_provider,
            service=self.service,
            booking_date="2024-05-10",
            start_time="10:00",
            end_time="12:00"
        )
        
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_cancel_booking_sends_email(self):
        response = self.client.delete(reverse('booking-delete', kwargs={'booking_id': self.booking.id}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # Check that one message has been sent
        self.assertEqual(len(mail.outbox), 1)
        # Verify that the subject of the first message is correct
        self.assertEqual(mail.outbox[0].subject, 'Booking Cancelled')
