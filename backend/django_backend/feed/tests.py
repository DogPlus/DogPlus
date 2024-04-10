from django.test import TestCase
from .models import Post
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token



# Create your tests here.

class PostTestCase(TestCase):
    def setUp(self):
        # Setup a user since the Post model likely requires an author
        User = get_user_model()
        self.user = User.objects.create_user(username='testuser', password='12345')

    def test_create_post(self):
        post = Post.objects.create(
            author=self.user,
            text="This is a test post",
            # Assuming 'image' and other fields are optional or have defaults
        )
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(post.text, "This is a test post")
        self.assertEqual(post.author.username, 'testuser')


class UserPostsTestCase(APITestCase):
    def setUp(self):
        # Create two users and posts for each
        User = get_user_model()
        self.user1 = User.objects.create_user(username='user1', password='12345')
        self.user2 = User.objects.create_user(username='user2', password='12345')
        Post.objects.create(author=self.user1, text="User 1's post")
        Post.objects.create(author=self.user2, text="User 2's post")
        self.user1_token = Token.objects.create(user=self.user1)


    def test_get_user_posts(self):
        # Assuming the URL name for your endpoint is 'user-posts' and expects a 'user_id' argument
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.user1_token.key)
        url = reverse('user-posts', kwargs={'user_id': self.user1.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Should only return one post for user1
        self.assertEqual(response.data[0]['text'], "User 1's post")