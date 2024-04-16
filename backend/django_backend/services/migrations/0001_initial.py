# Generated by Django 5.0.3 on 2024-04-15 10:54

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('Dog Training', 'Dog Training'), ('Veterinary Services', 'Veterinary Services'), ('Dog Daycare', 'Dog Daycare'), ('Dog Insurance', 'Dog Insurance')], max_length=255)),
                ('description', models.TextField()),
                ('location', models.CharField(max_length=255)),
                ('price_type', models.CharField(editable=False, max_length=20)),
                ('fixed_price', models.DecimalField(blank=True, decimal_places=2, max_digits=6, null=True)),
                ('price_per_session', models.DecimalField(blank=True, decimal_places=2, max_digits=6, null=True)),
                ('session_time', models.IntegerField(blank=True, help_text='Duration of each session in minutes (if applicable)', null=True)),
                ('service_provider', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='service', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]