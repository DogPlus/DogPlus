from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError


from authentication.models import CustomUser
from authentication.serializers import UserSerializer

class ServiceProviderDetail(APIView):
    def get(self, request, id, format=None):
        try:
            service_provider = CustomUser.objects.get(id=id)
            serializer = UserSerializer(service_provider)
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def list_all_service_providers(request):
    service_providers = CustomUser.objects.filter(role=CustomUser.SERVICE_PROVIDER, is_approved=True)
    serializer = UserSerializer(service_providers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def search_for_service_providers(request):
    query = request.query_params.get('query', '')

    # Q supposedly protects against sql injections, if anything more is needed, implement it in sanitize_query


    query = sanitize_query(query)


    # Filter service providers based on the query
    # assuming the query can match either name or email

    # disclaimer, i dont know how well this will work on a big database

    if query:
        service_providers = CustomUser.objects.filter(
            Q(role=CustomUser.SERVICE_PROVIDER, is_approved=True) &
            (Q(username__icontains=query) | Q(email__icontains=query))
        )
    else:
        service_providers = CustomUser.objects.filter(role=CustomUser.SERVICE_PROVIDER, is_approved=True)

    serializer = UserSerializer(service_providers, many=True)
    return Response(serializer.data)


def sanitize_query(query):
    # Remove any unwanted characters or potentially harmful SQL injection codes
    # For example, strip out everything except alphanumeric characters and spaces, and limit the length to 32 characters
    validator = RegexValidator(r'^[0-9a-zA-Z ]{0,32}$', 'Invalid or too many characters in query.')
    try:
        validator(query)
        return query
    except ValidationError:
        return ''  # Return empty string if validation fails