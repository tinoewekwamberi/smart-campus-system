from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Course, Enrollment, CourseSchedule, CourseMaterial
from .serializers import (
    CourseSerializer, CourseListSerializer, CourseCreateSerializer, CourseDetailSerializer,
    EnrollmentSerializer, EnrollmentCreateSerializer,
    CourseScheduleSerializer, CourseMaterialSerializer
)
from .permissions import IsLecturerOrStaff, IsStaffOnly, IsStudentOrLecturer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['level', 'course_type', 'is_active', 'semester', 'lecturer']
    search_fields = ['code', 'name', 'description']
    ordering_fields = ['code', 'name', 'credits', 'created_at']
    ordering = ['level', 'code']

    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'student':
            # Students can see all active courses
            return Course.objects.filter(is_active=True)
        elif user.role == 'lecturer':
            # Lecturers can only see their own courses
            return Course.objects.filter(lecturer=user)
        elif user.role == 'staff':
            # Staff can see all courses
            return Course.objects.all()
        
        return Course.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return CourseCreateSerializer
        elif self.action == 'list':
            return CourseListSerializer
        elif self.action in ['retrieve', 'update', 'partial_update']:
            return CourseDetailSerializer
        return CourseSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            return [IsAuthenticated(), IsLecturerOrStaff()]
        elif self.action == 'destroy':
            return [IsAuthenticated(), IsStaffOnly()]
        return [IsAuthenticated()]

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, pk=None):
        """Enroll a student in a course"""
        if request.user.role != 'student':
            return Response(
                {'error': 'Only students can enroll in courses'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        course = self.get_object()
        serializer = EnrollmentCreateSerializer(
            data={'course': course.id}, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            enrollment = serializer.save()
            return Response(
                EnrollmentSerializer(enrollment).data, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def drop(self, request, pk=None):
        """Drop a course enrollment"""
        if request.user.role != 'student':
            return Response(
                {'error': 'Only students can drop courses'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        course = self.get_object()
        try:
            enrollment = Enrollment.objects.get(student=request.user, course=course)
            enrollment.status = 'dropped'
            enrollment.save()
            return Response({'message': 'Successfully dropped course'})
        except Enrollment.DoesNotExist:
            return Response(
                {'error': 'You are not enrolled in this course'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, permission_classes=[IsAuthenticated])
    def my_courses(self, request):
        """Get courses for the current user based on their role"""
        user = request.user
        
        if user.role == 'student':
            # Get enrolled courses
            enrollments = Enrollment.objects.filter(student=user, status='enrolled')
            courses = Course.objects.filter(enrollments__in=enrollments)
        elif user.role == 'lecturer':
            # Get courses taught by the lecturer
            courses = Course.objects.filter(lecturer=user)
        elif user.role == 'staff':
            # Staff can see all courses
            courses = Course.objects.all()
        else:
            courses = Course.objects.none()
        
        serializer = CourseListSerializer(courses, many=True)
        return Response(serializer.data)

    @action(detail=True, permission_classes=[IsAuthenticated])
    def enrollments(self, request, pk=None):
        """Get all enrollments for a course (lecturers and staff only)"""
        if request.user.role not in ['lecturer', 'staff']:
            return Response(
                {'error': 'Access denied'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        course = self.get_object()
        
        # Lecturers can only see enrollments for their own courses
        if request.user.role == 'lecturer' and course.lecturer != request.user:
            return Response(
                {'error': 'Access denied'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        enrollments = course.enrollments.all()
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated, IsStudentOrLecturer]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'course', 'student']
    ordering_fields = ['enrolled_at', 'status']
    ordering = ['-enrolled_at']

    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'student':
            # Students can only see their own enrollments
            return Enrollment.objects.filter(student=user)
        elif user.role == 'lecturer':
            # Lecturers can see enrollments for their courses
            return Enrollment.objects.filter(course__lecturer=user)
        elif user.role == 'staff':
            # Staff can see all enrollments
            return Enrollment.objects.all()
        
        return Enrollment.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            return [IsAuthenticated(), IsStudentOrLecturer()]
        elif self.action == 'destroy':
            return [IsAuthenticated(), IsStaffOnly()]
        return [IsAuthenticated()]


class CourseScheduleViewSet(viewsets.ModelViewSet):
    queryset = CourseSchedule.objects.all()
    serializer_class = CourseScheduleSerializer
    permission_classes = [IsAuthenticated, IsLecturerOrStaff]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['course', 'day_of_week', 'is_lab']

    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'student':
            # Students can see schedules for courses they're enrolled in
            enrolled_courses = Course.objects.filter(
                enrollments__student=user, 
                enrollments__status='enrolled'
            )
            return CourseSchedule.objects.filter(course__in=enrolled_courses)
        elif user.role == 'lecturer':
            # Lecturers can see schedules for their courses
            return CourseSchedule.objects.filter(course__lecturer=user)
        elif user.role == 'staff':
            # Staff can see all schedules
            return CourseSchedule.objects.all()
        
        return CourseSchedule.objects.none()


class CourseMaterialViewSet(viewsets.ModelViewSet):
    queryset = CourseMaterial.objects.all()
    serializer_class = CourseMaterialSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['course', 'material_type', 'is_public']
    search_fields = ['title', 'description']

    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'student':
            # Students can see public materials for courses they're enrolled in
            enrolled_courses = Course.objects.filter(
                enrollments__student=user, 
                enrollments__status='enrolled'
            )
            return CourseMaterial.objects.filter(
                Q(course__in=enrolled_courses) & Q(is_public=True)
            )
        elif user.role == 'lecturer':
            # Lecturers can see materials for their courses
            return CourseMaterial.objects.filter(course__lecturer=user)
        elif user.role == 'staff':
            # Staff can see all materials
            return CourseMaterial.objects.all()
        
        return CourseMaterial.objects.none()

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
