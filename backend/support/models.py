from django.db import models
from django.conf import settings

# Create your models here.

class SupportRequest(models.Model):
    CATEGORY_CHOICES = [
        ('cleaning', 'Cleaning'),
        ('maintenance', 'Maintenance'),
        ('pest', 'Pest Control'),
        ('other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='support_requests')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    location = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_support_requests')
    resolution_notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.category} - {self.location} ({self.status})"
