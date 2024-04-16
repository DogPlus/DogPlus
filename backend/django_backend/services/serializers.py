from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'location', 'service_provider', 'fixed_price', 'price_per_session', 'session_time']
        read_only_fields = ['service_provider', 'price_type'] 

    def validate(self, data):
        if data['name'] in [Service.DOG_TRAINING, Service.DOG_DAYCARE]:
            if not data.get('price_per_session') or not data.get('session_time'):
                raise serializers.ValidationError("Price per session and session time must be provided for training and daycare services.")
        else:
            if not data.get('fixed_price'):
                raise serializers.ValidationError("A fixed price must be provided for insurance and veterinary services.")
        return data
