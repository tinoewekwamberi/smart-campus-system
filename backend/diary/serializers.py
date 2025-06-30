from rest_framework import serializers
from .models import DiaryEntry, CalendarEvent

class DiaryEntrySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DiaryEntry
        fields = '__all__'

class CalendarEventSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = CalendarEvent
        fields = '__all__' 