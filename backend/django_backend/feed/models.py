from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

def validate_file_size(file):
    max_size_mb = 50
    if file.size > max_size_mb * 1024 * 1024:
        raise ValidationError(f"Max file size is {max_size_mb}MB")


def validate_video_file_type(file):
    valid_mime_types = ['video/mp4', 'video/mpeg']
    file_mime_type = file.file.content_type
    if file_mime_type not in valid_mime_types:
        raise ValidationError('Unsupported file type. Only MP4 and MPEG are allowed.')

# need to workout a profile_pic solution
class Post(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    text = models.TextField()
    image = models.ImageField(max_length=200, upload_to='post_images/', blank=True, null=True) 
    video = models.FileField(max_length=400,  upload_to='post_videos/', blank=True, null=True, validators=[validate_file_size, validate_video_file_type]) 
    date_posted = models.DateTimeField(auto_now_add=True)
    like_count = models.IntegerField(default=0)
    liked_by = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
    comment_count = models.IntegerField(default=0)

    def __str__(self):
        return f"Post {self.id} by {self.author}"

class Comment(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
