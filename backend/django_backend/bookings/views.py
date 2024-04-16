from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from authentication.models import CustomUser
from .serializers import BookingSerializer
from rest_framework import status


class BookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Ensure the user creating the booking has the "User" role
        if request.user.role != CustomUser.USER:
            return Response({"detail": "Only users can create bookings."}, status=status.HTTP_403_FORBIDDEN)

        # Extract service_provider_id from the request and validate the role
        service_provider_id = request.data.get('service_provider')
        try:
            service_provider = CustomUser.objects.get(id=service_provider_id)
            if service_provider.role != CustomUser.SERVICE_PROVIDER:
                return Response({"detail": "Invalid service provider."}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Service provider not found."}, status=status.HTTP_404_NOT_FOUND)

        # Assuming the service is valid and included in request.data
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, service_provider=service_provider)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AvailableBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return JsonResponse(['13:00', '14:00'])

