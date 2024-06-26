# Generated by Django 5.0.3 on 2024-05-02 16:49

from django.db import migrations

def create_data(apps, schema_editor):
    User = apps.get_model('authentication', 'CustomUser')
    # Create test users
    user1 = User.objects.create_user(username='normaluser', password='TestPassword123', role=1, is_approved=True)
    user2 = User.objects.create_user(username='Your Dog Enhanced', password='TestPassword123', role=2, is_approved=True)
    user3 = User.objects.create_user(username='admin', password='TestPassword123', role=3, is_approved=True)

    user4 = User.objects.create_user(username='Giulia Rossi', password='TestPassword123', role=1, is_approved=True, profile_image='demo_profile1.jpg')
    user5 = User.objects.create_user(username='Mario Bianchi', password='TestPassword123', role=1, is_approved=True, profile_image='demo_profile2.jpg')
    user6 = User.objects.create_user(username='Jessica Verdi', password='TestPassword123', role=1, is_approved=True, profile_image='demo_profile3.jpg')
    user7 = User.objects.create_user(username='Francesco Russo', password='TestPassword123', role=1, is_approved=True, profile_image='demo_profile4.jpg')

    user8 = User.objects.create_user(username='Paws and Claws', password='TestPassword123', role=2, is_approved=True, profile_image='demo_service1.jpg')
    user9 = User.objects.create_user(username='Pet Lovers', password='TestPassword123', role=2, is_approved=True, profile_image='demo_service2.jpg')
    user10 = User.objects.create_user(username='Dog Training Inc', password='TestPassword123', role=2, is_approved=True, profile_image='demo_service3.png')
    user11 = User.objects.create_user(username='Pet Care Services', password='TestPassword123', role=2, is_approved=True, profile_image='demo_service4.jpg')
    


    

class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_alter_customuser_profile_image'),
    ]

    operations = [
        migrations.RunPython(create_data),
    ]
