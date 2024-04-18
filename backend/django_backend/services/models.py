from django.db import models
from django.conf import settings

class Service(models.Model):
    DOG_TRAINING = 'Dog Training'
    VETERINARY_SERVICES = 'Veterinary Services'
    DOG_DAYCARE = 'Dog Daycare'
    DOG_INSURANCE = 'Dog Insurance'
    
    SERVICE_CHOICES = [
        (DOG_TRAINING, 'Dog Training'),
        (VETERINARY_SERVICES, 'Veterinary Services'),
        (DOG_DAYCARE, 'Dog Daycare'),
        (DOG_INSURANCE, 'Dog Insurance'),
    ]

    PRICE_FIXED = 'Fixed'
    PRICE_PER_SESSION = 'Per Session'

    name = models.CharField(max_length=255, choices=SERVICE_CHOICES)
    description = models.TextField()
    location = models.CharField(max_length=255)
    service_provider = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='service'
    )
    price_type = models.CharField(max_length=20, editable=False)
    fixed_price = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    price_per_session = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    session_time = models.IntegerField(help_text="Duration of each session in minutes", default=30)

    def save(self, *args, **kwargs):
        # Automatically set price type based on the service name
        if self.name in [self.DOG_TRAINING, self.DOG_DAYCARE]:
            self.price_type = self.PRICE_PER_SESSION
        else:
            self.price_type = self.PRICE_FIXED
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} by {self.service_provider.username} at {self.location}"
