from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserModelTests(TestCase):

    def test_create_user_with_default_role(self):
        """Test creating a user with the default role."""
        user = User.objects.create_user(username='normaluser', email='normal@example.com', password='testpass123')
        self.assertEqual(user.role, User.USER, "Default role should be 'User'")

    def test_create_user_with_explicit_role(self):
        """Test creating a user with an explicit role."""
        service_provider = User.objects.create_user(username='serviceprovider', email='service@example.com', password='testpass123', role=User.SERVICE_PROVIDER)
        admin_user = User.objects.create_user(username='adminuser', email='admin@example.com', password='testpass123', role=User.ADMIN)

        self.assertEqual(service_provider.role, User.SERVICE_PROVIDER, "Explicit role should be 'Service Provider'")
        self.assertEqual(admin_user.role, User.ADMIN, "Explicit role should be 'Admin'")

