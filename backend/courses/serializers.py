from rest_framework import serializers
from .models import Course, Enrollment, CourseSchedule, CourseMaterial
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role']


class CourseScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseSchedule
        fields = '__all__'


class CourseMaterialSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = CourseMaterial
        fields = '__all__'


class EnrollmentSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = '__all__'
        read_only_fields = ['enrolled_at']


class CourseSerializer(serializers.ModelSerializer):
    lecturer = UserSerializer(read_only=True)
    enrollment_count = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    available_spots = serializers.ReadOnlyField()
    schedules = CourseScheduleSerializer(many=True, read_only=True)
    materials = CourseMaterialSerializer(many=True, read_only=True)
    enrollments = EnrollmentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class CourseListSerializer(serializers.ModelSerializer):
    lecturer_name = serializers.CharField(source='lecturer.get_full_name', read_only=True)
    enrollment_count = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    available_spots = serializers.ReadOnlyField()
    is_enrolled = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id', 'code', 'name', 'description', 'credits', 'level', 
            'course_type', 'lecturer_name', 'max_students', 'enrollment_count',
            'is_full', 'available_spots', 'is_active', 'semester', 'year',
            'is_enrolled', 'created_at', 'updated_at'
        ]
    
    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.role == 'student':
            return Enrollment.objects.filter(student=request.user, course=obj).exists()
        return False


class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'code', 'name', 'description', 'credits', 'level', 
            'course_type', 'max_students', 'prerequisites', 'syllabus',
            'learning_outcomes', 'is_active', 'semester', 'year'
        ]

    def create(self, validated_data):
        # Set the lecturer to the current user
        validated_data['lecturer'] = self.context['request'].user
        return super().create(validated_data)


class EnrollmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['course', 'status', 'notes']

    def validate(self, data):
        course = data['course']
        student = self.context['request'].user
        
        # Check if student is already enrolled
        if Enrollment.objects.filter(student=student, course=course).exists():
            raise serializers.ValidationError("You are already enrolled in this course.")
        
        # Check if course is full
        if course.is_full:
            raise serializers.ValidationError("This course is full.")
        
        # Check if course is active
        if not course.is_active:
            raise serializers.ValidationError("This course is not active.")
        
        return data

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)


class CourseDetailSerializer(serializers.ModelSerializer):
    lecturer = UserSerializer(read_only=True)
    enrollment_count = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    available_spots = serializers.ReadOnlyField()
    schedules = CourseScheduleSerializer(many=True, read_only=True)
    materials = CourseMaterialSerializer(many=True, read_only=True)
    enrollments = EnrollmentSerializer(many=True, read_only=True)
    prerequisites = CourseListSerializer(many=True, read_only=True)
    is_enrolled = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = '__all__'
    
    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.role == 'student':
            return Enrollment.objects.filter(student=request.user, course=obj).exists()
        return False 