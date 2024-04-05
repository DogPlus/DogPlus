from django.contrib.auth.models import AbstractUser
from django.db import models
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .permissions import IsServiceProvider
from django.shortcuts import get_object_or_404

class CustomUser(AbstractUser):
    USER = 1
    SERVICE_PROVIDER = 2
    ADMIN = 3
    ROLE_CHOICES = (
        (USER, 'User'),
        (SERVICE_PROVIDER, 'Service Provider'),
        (ADMIN, 'Admin'),
    )
    serviceProviderKey = models.CharField(max_length=255, blank=True, null=True)
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=USER)

class ServiceProviderProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsServiceProvider]

    def get(self, request):
        """
        Retrieve the service provider's profile information.
        """
        from .serializers import ServiceProviderProfileSerializer  
        user = get_object_or_404(CustomUser, pk=request.user.pk)
        serializer = ServiceProviderProfileSerializer(user)
        return Response(serializer.data)

    def post(self, request):
        """
        Update the service provider's profile information.
        """
        from .serializers import ServiceProviderProfileSerializer 
        user = get_object_or_404(CustomUser, pk=request.user.pk)
        serializer = ServiceProviderProfileSerializer(user, data=request.data, partial=True)  # Allow partial update
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
