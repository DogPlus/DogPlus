# serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    serviceProviderKey = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['uuid', 'username', 'email', 'password', 'role', 'serviceProviderKey']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        serviceProviderKey = validated_data.pop('serviceProviderKey', None)
        user = User.objects.create_user(**validated_data)
        if user.role == User.SERVICE_PROVIDER and serviceProviderKey:
            user.serviceProviderKey = serviceProviderKey
            user.is_approved = None if user.role != User.SERVICE_PROVIDER else False
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
    
    def get_readable_role(self, obj):
        return obj.get_role_display()

    
class ServiceProviderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['uuid', 'username', 'email', 'password', 'role', 'serviceProviderKey']
        read_only_fields = ['uuid', 'username', 'serviceProviderKey'] 

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
