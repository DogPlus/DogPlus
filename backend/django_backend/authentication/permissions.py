from rest_framework import permissions




class IsServiceProvider(permissions.BasePermission):
    def has_permission(self, request, view):
        from .models import CustomUser
        return request.user.is_authenticated and request.user.role == CustomUser.SERVICE_PROVIDER
