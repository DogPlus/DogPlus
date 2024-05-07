# Generated by Django 5.0.3 on 2024-05-02 17:03

from django.db import migrations


def create_data(apps, schema_editor):
    User = apps.get_model('authentication', 'CustomUser')
    Service = apps.get_model('services', 'Service')
    Booking = apps.get_model('bookings', 'Booking')

    # Create sample bookings
    booking1 = Booking.objects.create(
        service=Service.objects.get(name="Dog Training", description="Dog Training Service"),
        user=User.objects.get(username='normaluser'),
        service_provider=User.objects.get(username='Your Dog Enhanced'),
        booking_date='2024-04-16',
        start_time='10:00',
        end_time='11:00',
        status=2
    )

class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0004_auto_20240502_1649'),
        ('services', '0003_auto_20240502_1700'),
        ('bookings', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_data),
    ]
