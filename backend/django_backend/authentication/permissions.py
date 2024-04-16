from rest_framework import permissions



class IsServiceProvider(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "SERVICE_PROVIDER"
