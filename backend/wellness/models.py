from django.db import models
from django.conf import settings

# Create your models here.

class WellnessCheckin(models.Model):
    MOOD_CHOICES = [
        ("very_happy", "😄 Very Happy"),
        ("happy", "🙂 Happy"),
        ("neutral", "😐 Neutral"),
        ("sad", "🙁 Sad"),
        ("very_sad", "😢 Very Sad"),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wellness_checkins")
    created_at = models.DateTimeField(auto_now_add=True)
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES)
    notes = models.TextField(blank=True)
    flagged = models.BooleanField(default=False)
    requested_counselling = models.BooleanField(default=False)
    staff_response = models.TextField(blank=True)

    def __str__(self):
        mood_display = dict(self.MOOD_CHOICES).get(self.mood, self.mood)
        date_str = self.created_at.strftime('%Y-%m-%d') if self.created_at else "unsaved"
        return f"{self.user} - {mood_display} on {date_str}"

class CounsellingSession(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("scheduled", "Scheduled"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="counselling_sessions")
    staff = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_sessions")
    scheduled_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session for {self.student} with {self.staff} ({self.status})"
