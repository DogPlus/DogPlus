from django.core.management.base import BaseCommand
from services.models import Service
from authentication.models import CustomUser as User
from bookings.models import Booking
from feed.models import Post


class Command(BaseCommand):
    help = 'Populate database with some sample users, service providers and services'
    def handle(self, *args, **kwargs):
            # Create test users
            user1 = User.objects.create(username='user1', role=User.USER, is_approved=True)
            user2 = User.objects.create(username='user2', role=User.SERVICE_PROVIDER, is_approved=True)
            user3 = User.objects.create(username='user3', role=User.ADMIN, is_approved=True)

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
                text="Sample post text",
                image="https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*"
            )

            self.stdout.write(self.style.SUCCESS('Test database created successfully'))
