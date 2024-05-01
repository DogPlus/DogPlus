from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status


from authentication.models import CustomUser
from authentication.serializers import UserSerializer

class ServiceProviderDetail(APIView):
    def get(self, request, id, format=None):
        try:
            service_provider = CustomUser.objects.get(id=id)
            serializer = UserSerializer(service_provider, context={'request': request})
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def list_all_service_providers(request):
    service_providers = CustomUser.objects.filter(role=CustomUser.SERVICE_PROVIDER, is_approved=True)
    serializer = UserSerializer(service_providers, many=True, context={'request': request})
    return Response(serializer.data)
