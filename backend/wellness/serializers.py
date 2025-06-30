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
    student = serializers.PrimaryKeyRelatedField(read_only=True)
    created_by = serializers.SerializerMethodField()
    approved_by = serializers.SerializerMethodField()

    def get_created_by(self, obj):
        if obj.created_by:
            full_name = (obj.created_by.first_name or '') + ' ' + (obj.created_by.last_name or '')
            full_name = full_name.strip() or obj.created_by.username
            return {'id': obj.created_by.id, 'full_name': full_name}
        return None

    def get_approved_by(self, obj):
        if obj.approved_by:
            full_name = (obj.approved_by.first_name or '') + ' ' + (obj.approved_by.last_name or '')
            full_name = full_name.strip() or obj.approved_by.username
            return {'id': obj.approved_by.id, 'full_name': full_name}
        return None

    class Meta:
        model = CounsellingSession
        fields = [
            'id', 'student', 'staff', 'scheduled_time', 'status', 'status_display', 'notes', 'created_at',
            'rescheduled_at', 'reschedule_reason', 'created_by', 'approved_by'
        ]
        read_only_fields = ['id', 'created_at', 'student', 'created_by', 'approved_by'] 