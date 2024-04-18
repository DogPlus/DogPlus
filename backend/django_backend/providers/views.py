from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view


from authentication.models import CustomUser
from authentication.serializers import UserSerializer


@api_view(['GET'])
def list_all_service_providers(request):
    service_providers = CustomUser.objects.filter(role=CustomUser.SERVICE_PROVIDER, is_approved=True)
    serializer = UserSerializer(service_providers, many=True)
    return Response(serializer.data)
