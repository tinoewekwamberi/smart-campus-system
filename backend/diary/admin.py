from django.contrib import admin
from .models import DiaryEntry, CalendarEvent

# Register your models here.
admin.site.register(DiaryEntry)
admin.site.register(CalendarEvent)
