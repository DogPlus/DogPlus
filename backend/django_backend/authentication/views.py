from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from .permissions import IsServiceProvider
from .serializers import ServiceProviderProfileSerializer
User = get_user_model()

class RegisterUserAPIView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response(
                {**serializer.data, "token": token.key},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
class Logout(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = get_object_or_404(Token, user=request.user)
        token.delete()
        return Response({"detail": "Successfully logged out."}, status=status.HTTP_204_NO_CONTENT)

class ServiceProviderProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsServiceProvider]

    def get(self, request, *args, **kwargs):
        """
        Retrieve the service provider's profile information.
        """
        user = request.user
        serializer = ServiceProviderProfileSerializer(user)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        """
        Update the service provider's profile information.
        """
        user = request.user
        serializer = ServiceProviderProfileSerializer(user, data=request.data, partial=True)  # Allow partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)