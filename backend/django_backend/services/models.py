from django.db import models
from django.conf import settings

class Service(models.Model):
    DOG_TRAINING = 'Dog Training'
    VETERINARY_SERVICES = 'Veterinary Services'
    DOG_DAYCARE = 'Dog Daycare'
    
    SERVICE_CHOICES = [
        (DOG_TRAINING, 'Dog Training'),
        (VETERINARY_SERVICES, 'Veterinary Services'),
        (DOG_DAYCARE, 'Dog Daycare'),
    ]
    
    name = models.CharField(max_length=255, choices=SERVICE_CHOICES)
    description = models.TextField()
    location = models.CharField(max_length=255)
    service_provider = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='service', limit_choices_to={'role': settings.CUSTOM_USER_MODEL.SERVICE_PROVIDER})

    def __str__(self):
        return f"{self.name} by {self.service_provider.username} at {self.location}"
