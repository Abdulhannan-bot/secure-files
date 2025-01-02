from django.db import models
from auth_users.models import User
import hashlib
import os
# Create your models here.

def get_shortened_name(instance, filename):
    # Generate a shorter name using a hash of the original file name or UUID
    file_extension = os.path.splitext(filename)[1]  # Get file extension (e.g., .txt, .jpg)
    shortened_name = hashlib.md5(filename.encode()).hexdigest()[:12] + file_extension  # Using first 12 characters of MD5 hash
    return os.path.join('uploads/', shortened_name)  # The shortened file name will be used here

class File(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cipher_text = models.TextField(blank=True)
    extension = models.CharField(max_length=100, blank=True)
    file = models.FileField(upload_to='uploads/')
    name = models.CharField(max_length=255)
    salt = models.TextField(blank=True)
    iv = models.TextField()  
    key = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
