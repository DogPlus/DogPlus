from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    USER = 1
    SERVICE_PROVIDER = 2
    ADMIN = 3
    ROLE_CHOICES = (
        (USER, 'User'),
        (SERVICE_PROVIDER, 'Service Provider'),
        (ADMIN, 'Admin'),
    )
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=USER)
