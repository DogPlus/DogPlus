from django.core.management.base import BaseCommand
from services.models import Service
from authentication.models import CustomUser as User
from bookings.models import Booking
from feed.models import Post


class Command(BaseCommand):
    help = 'Populate database with some sample users, service providers, and services'

    def handle(self, *args, **kwargs):
        # Create test users
        user1 = User.objects.create_user(username='normaluser', password='TestPassword123', role=User.USER, is_approved=True)
        user2 = User.objects.create_user(username='serviceprovider', password='TestPassword123', role=User.SERVICE_PROVIDER, is_approved=True)
        user3 = User.objects.create_user(username='admin', password='TestPassword123', role=User.ADMIN, is_approved=True)

        # Create sample services
        service1 = Service.objects.create(
            name=Service.DOG_TRAINING,
            description="Sample Dog Training Service",
            location="Location 1",
            service_provider=user2,
            price_per_session=50.00,
            session_time=60
        )

        # Create sample bookings
        booking1 = Booking.objects.create(
            service=service1,
            user=user1,
            service_provider=user2,
            booking_date='2024-04-16',
            start_time='10:00',
            end_time='11:00',
            status=Booking.CONFIRMED
        )

        # Create sample posts
        post1 = Post.objects.create(
            author=user1,
            text="Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
            image="sample_post_image.png"
        )

        # Write information to a text file
        with open('entities_info.txt', 'w') as f:
            f.write("User Information:\n")
            for user in User.objects.all():
                f.write(f"ID: {user.id}\n")
                f.write(f"Role: {user.get_role_display()}\n")
                f.write(f"Username: {user.username}\n")
                f.write(f"Password: TestPassword123\n")
                f.write(f"Token: [not shown]\n\n")

            f.write("Service Information:\n")
            for service in Service.objects.all():
                f.write(f"ID: {service.id}\n")
                f.write(f"Name: {service.name}\n\n")

        self.stdout.write(self.style.SUCCESS('Test database created successfully'))
