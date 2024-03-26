from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    # Specify any custom configurations for your user model admin here
    # For autocomplete_fields to work, define search_fields
    search_fields = ['username',]  # Adjust based on your user model fields
