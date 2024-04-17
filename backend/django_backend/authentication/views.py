from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomUser
from .serializers import UserSerializer
from .permissions import IsServiceProvider
from .serializers import ServiceProviderProfileSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser

User = get_user_model()

class RegisterUserAPIView(APIView):
    permission_classes = []

    def post(self, request):
        register_as_service_provider = request.data.get('registerAsServiceProvider', False)

        # Automatically approve users who are not registering as service providers
        if not register_as_service_provider:
            request.data['is_approved'] = True
        else:
            request.data['is_approved'] = False  # Require admin approval for service providers

        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            if user.role == CustomUser.SERVICE_PROVIDER and not user.is_approved:
                # For service providers, do not return a token until they are approved
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                token, created = Token.objects.get_or_create(user=user)
                return Response(
                    {**serializer.data, "token": token.key},
                    status=status.HTTP_201_CREATED
                )
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            # Check if the user is approved (for roles that require approval)
            if hasattr(user, 'is_approved') and not user.is_approved:
                # User is found but not approved yet
                return Response({"detail": "Account not approved yet. Please wait for an administrator to approve your account."}, status=status.HTTP_403_FORBIDDEN)
            
            # User is approved or does not require approval; proceed with login
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user_id": user.id}, status=status.HTTP_200_OK)
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
        
        
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def pending_service_providers(request):
        pending_users = CustomUser.objects.filter(role=CustomUser.SERVICE_PROVIDER, is_approved=False)
        serializer = UserSerializer(pending_users, many=True)
        return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdminUser])
def approve_service_provider(request, user_uuid):
    user = get_object_or_404(CustomUser, id=user_uuid, role=CustomUser.SERVICE_PROVIDER)
    user.is_approved = True
    user.save()
    return Response({'status': 'Service provider approved'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_service_provider(request, user_uuid):
    user = get_object_or_404(CustomUser, id=user_uuid, role=CustomUser.SERVICE_PROVIDER)
    user.delete()
    return Response({'status': 'Service provider deleted'}) 
