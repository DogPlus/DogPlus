# serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    serviceProviderKey = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 'serviceProviderKey')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        serviceProviderKey = validated_data.pop('serviceProviderKey', None)
        
        user = User.objects.create_user(**validated_data)
        
        if user.role == User.SERVICE_PROVIDER and serviceProviderKey:
            user.serviceProviderKey = serviceProviderKey
            user.save()
            
        return user
    
class ServiceProviderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id', 'username']

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)