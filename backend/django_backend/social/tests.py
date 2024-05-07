from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Follow

User = get_user_model()

class FollowUnfollowTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', password='password1')
        self.user2 = User.objects.create_user(username='user2', password='password2')
        self.client.force_authenticate(user=self.user1)

    def test_follow_user(self):
        response = self.client.post(reverse('follow-user', args=[self.user2.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Follow.objects.filter(follower=self.user1, followed=self.user2).exists())

    def test_unfollow_user(self):
        Follow.objects.create(follower=self.user1, followed=self.user2)
        response = self.client.delete(reverse('unfollow-user', args=[self.user2.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Follow.objects.filter(follower=self.user1, followed=self.user2).exists())

    def test_follow_self(self):
        response = self.client.post(reverse('follow-user', args=[self.user1.id]))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class FollowerListViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', password='password1')
        self.user2 = User.objects.create_user(username='user2', password='password2')
        self.client.force_authenticate(user=self.user1)
        Follow.objects.create(follower=self.user2, followed=self.user1)

    def test_view_followers(self):
        response = self.client.get(reverse('follower-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)  # Check that the response is a list
        self.assertTrue(len(response.data) > 0)  # Ensure the list is not empty
        # Optionally check for specific data structure in list items
        self.assertIn('follower', response.data[0])
        self.assertIn('followed', response.data[0])
        self.assertIn('id', response.data[0])
        self.assertIn('created_at', response.data[0])


class UserSearchViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', password='password1')
        self.user2 = User.objects.create_user(username='user2', password='password2')
        self.client.force_authenticate(user=self.user1)

    def test_search_user_exact_match(self):
        response = self.client.get(reverse('user-search'), {'username': 'user2'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user2', [u['username'] for u in response.data['users']])

    def test_search_user_no_match(self):
        response = self.client.get(reverse('user-search'), {'username': 'nonexistent'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['users']), 0)
