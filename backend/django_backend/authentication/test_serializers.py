from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from .serializers import UserSerializer

User = get_user_model()

class UserSerializerTest(TestCase):

    def test_valid_user_serialization(self):
        """Test that valid data creates a user correctly."""
        user_data = {
            'username': 'testuser',
            'email': 'user@example.com',
            'password': 'testpass123',
            'role': 'admin'  # Assuming 'role' is a valid field on your User model
        }
        serializer = UserSerializer(data=user_data)
        
        self.assertTrue(serializer.is_valid())
        
        user = serializer.save()
        self.assertIsNotNone(user.pk)  # User should have been created
        
        # Check that the user exists in the database
        exists = User.objects.filter(username=user_data['username']).exists()
        self.assertTrue(exists)
        
        # Check password is set correctly
        self.assertTrue(user.check_password(user_data['password']))
        
        # Check that 'role' field is saved correctly, assuming 'role' is a valid field
        self.assertEqual(user.role, user_data['role'])
        
        # Verify that serialized data does not include the password
        self.assertNotIn('password', serializer.data)

    def test_password_write_only(self):
        """Test that the password field is write-only."""
        user = User.objects.create_user(username='test', email='test@example.com', password='testpass123', role='admin')
        serializer = UserSerializer(user)
        
        # The password should not be present in the serialized output
        self.assertNotIn('password', serializer.data)

    def test_create_user_with_invalid_data(self):
        """Test user creation with invalid data raises an error."""
        invalid_data = {
            'username': '',  # Invalid or missing username
            'email': 'invalidemail',  # Invalid email
            # Missing password
            'role': 'admin'  # Assuming 'role' is correctly defined for your test
        }
        serializer = UserSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        if serializer.is_valid():
            # This block should not be executed, ensuring no ValidationError is raised by serializer.save()
            serializer.save()

