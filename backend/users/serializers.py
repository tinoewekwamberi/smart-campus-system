from rest_framework import serializers
from .models import CustomUser

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'role',
            'phone', 'address', 'profile_picture', 'student_id', 'department', 'bio',
            'staff_type'
        ]
        read_only_fields = ['id', 'username', 'email', 'role'] 