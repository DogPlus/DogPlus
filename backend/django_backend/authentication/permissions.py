from rest_framework import permissions
from .models import CustomUser

class IsServiceProvider(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == CustomUser.SERVICE_PROVIDER
