from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

User = get_user_model()

class UserViewTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.test_user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword123', is_approved=True)
        self.token, _ = Token.objects.get_or_create(user=self.test_user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_register_user(self):
        """
        Ensure we can register a new user.
        """
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword123',
            'registerAsServiceProvider': False,  # Register as a regular user
        }

        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('token' in response.data)

    def test_login_user(self):
        """
        Ensure we can login a user and receive a token.
        """
        data = {
            'username': 'testuser',
            'password': 'testpassword123',
        }

        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('token' in response.data)

    def test_logout_user(self):
        """
        Ensure we can logout a user successfully.
        """
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Token.objects.filter(user=self.test_user).exists())

