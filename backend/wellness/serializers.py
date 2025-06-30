from rest_framework import serializers
from .models import WellnessCheckin, CounsellingSession

class WellnessCheckinSerializer(serializers.ModelSerializer):
    mood_display = serializers.CharField(source='get_mood_display', read_only=True)
    class Meta:
        model = WellnessCheckin
        fields = [
            'id', 'user', 'created_at', 'mood', 'mood_display', 'notes', 'flagged', 'requested_counselling', 'staff_response'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'flagged', 'staff_response']

class CounsellingSessionSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    class Meta:
        model = CounsellingSession
        fields = [
            'id', 'student', 'staff', 'scheduled_time', 'status', 'status_display', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'created_at'] 