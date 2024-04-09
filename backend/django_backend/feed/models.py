from django.db import models
from django.conf import settings


# Create your models here.

# need to workout a profile_pic solution
class Post(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    text = models.TextField()
    image = models.URLField(blank=True, null=True)
    date_posted = models.DateTimeField(auto_now_add=True)
    like_count = models.IntegerField(default=0)
    comment_count = models.IntegerField(default=0)

    def __str__(self):
        return f"Post {self.id} by {self.author}"