# serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_image']

class UserSerializer(serializers.ModelSerializer):
    serviceProviderKey = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'is_approved', 'serviceProviderKey']
        extra_kwargs = {
            'password': {'write_only': True},
            'serviceProviderKey': {'required': False, 'allow_blank': True}
        }

    def create(self, validated_data):
        serviceProviderKey = validated_data.pop('serviceProviderKey', None)
        user = User.objects.create_user(**validated_data)
        if user.role == User.SERVICE_PROVIDER and serviceProviderKey:
            user.serviceProviderKey = serviceProviderKey
            user.save()
        return user

    def validate_email(self, value):
        # Check if the email is already in use.
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_username(self, value):
        # Check if the username is already taken.
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

class ServiceProviderProfileSerializer(serializers.ModelSerializer):
    serviceProviderKey = serializers.CharField(source='serviceproviderkey', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_approved', 'serviceProviderKey']
        read_only_fields = ['id', 'username', 'email', 'role', 'is_approved', 'serviceProviderKey']

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
