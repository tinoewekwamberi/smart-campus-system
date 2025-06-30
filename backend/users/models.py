from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('staff', 'Staff'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    # first_name and last_name are already in AbstractUser
    phone = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=255, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    student_id = models.CharField(max_length=30, blank=True)
    department = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    STAFF_TYPE_CHOICES = [
        ('counsellor', 'Counsellor'),
        ('admin', 'Admin Staff'),
        ('housekeeping', 'Housekeeping'),
        ('online_ordering', 'Online Ordering'),
        ('staff', 'General Staff'),
    ]
    staff_type = models.CharField(max_length=30, choices=STAFF_TYPE_CHOICES, blank=True, null=True, help_text='Type of staff (if role is staff)')
