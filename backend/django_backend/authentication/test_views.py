from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

User = get_user_model()

class UserViewTests(APITestCase):
    def setUp(self):
        self.create_url = reverse('register')
        self.logout_url = reverse('logout')
        # Create a test user
        self.test_user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword123')
        # Get or create a token for the test user
        self.token, _ = Token.objects.get_or_create(user=self.test_user)
        # Set the token in the client's headers for authenticated requests
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)


    def test_create_user(self):
        """
        Ensure we can create a new user and receive a token.
        """
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword123',
        }

        response = self.client.post(self.create_url, data, format='json')
        user = User.objects.latest('id')
        token = Token.objects.get(user=user)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], data['email'])
        self.assertEqual(response.data['username'], data['username'])
        self.assertTrue('token' in response.data)
        self.assertEqual(response.data['token'], token.key)

    def test_logout(self):
        """
        Ensure we can logout successfully and token is deleted.
        """
        # First, authenticate with the test user's token
        token, created = Token.objects.get_or_create(user=self.test_user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        # Attempt to logout
        response = self.client.post(self.logout_url)

        # Check that the response indicates success and the token is deleted
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Token.objects.filter(user=self.test_user).exists())