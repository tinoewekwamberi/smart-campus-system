from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import WellnessCheckin, CounsellingSession
from .serializers import WellnessCheckinSerializer, CounsellingSessionSerializer
from users.models import CustomUser
from django.utils import timezone
from datetime import timedelta

# Create your views here.

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'

class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'staff'

class IsCounsellorOrAdminStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == 'staff' and
            request.user.staff_type in ['counsellor', 'admin']
        )

class WellnessCheckinViewSet(viewsets.ModelViewSet):
    queryset = WellnessCheckin.objects.all().order_by('-created_at')
    serializer_class = WellnessCheckinSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'history']:
            return [permissions.IsAuthenticated()]
        if self.action in ['flagged', 'all', 'respond']:
            return [IsCounsellorOrAdminStaff()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return WellnessCheckin.objects.filter(user=user).order_by('-created_at')
        elif user.role == 'staff' and user.staff_type in ['counsellor', 'admin']:
            return WellnessCheckin.objects.all().order_by('-created_at')
        return WellnessCheckin.objects.none()

    def perform_create(self, serializer):
        # Auto-flag if mood is sad/very_sad or certain keywords in notes
        mood = self.request.data.get('mood')
        notes = self.request.data.get('notes', '').lower()
        flagged = False
        if mood in ['sad', 'very_sad'] or any(word in notes for word in ['depressed', 'help', 'anxious', 'suicidal', 'overwhelmed']):
            flagged = True
        serializer.save(user=self.request.user, flagged=flagged)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def history(self, request):
        qs = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsCounsellorOrAdminStaff])
    def flagged(self, request):
        qs = WellnessCheckin.objects.filter(flagged=True).order_by('-created_at')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsCounsellorOrAdminStaff])
    def respond(self, request, pk=None):
        checkin = self.get_object()
        response = request.data.get('staff_response', '')
        checkin.staff_response = response
        checkin.save()
        return Response({'status': 'response saved'})

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_trends(self, request):
        """
        Returns mood counts and flagged check-ins for the authenticated student (last 30 days).
        """
        user = request.user
        if user.role != 'student':
            return Response({'error': 'Only students can access their trends.'}, status=403)
        since = timezone.now() - timedelta(days=30)
        checkins = WellnessCheckin.objects.filter(user=user, created_at__gte=since)
        mood_counts = {}
        flagged_count = 0
        for c in checkins:
            mood_counts[c.mood] = mood_counts.get(c.mood, 0) + 1
            if c.flagged:
                flagged_count += 1
        return Response({
            'mood_counts': mood_counts,
            'flagged_count': flagged_count,
            'total': checkins.count(),
        })

    @action(detail=False, methods=['get'], permission_classes=[IsCounsellorOrAdminStaff])
    def trends(self, request):
        """
        Returns overall mood counts and flagged check-ins for all students (last 30 days).
        """
        since = timezone.now() - timedelta(days=30)
        checkins = WellnessCheckin.objects.filter(created_at__gte=since)
        mood_counts = {}
        flagged_count = 0
        for c in checkins:
            mood_counts[c.mood] = mood_counts.get(c.mood, 0) + 1
            if c.flagged:
                flagged_count += 1
        return Response({
            'mood_counts': mood_counts,
            'flagged_count': flagged_count,
            'total': checkins.count(),
        })

class CounsellingSessionViewSet(viewsets.ModelViewSet):
    queryset = CounsellingSession.objects.all().order_by('-created_at')
    serializer_class = CounsellingSessionSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'student_sessions']:
            return [permissions.IsAuthenticated()]
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        return [IsCounsellorOrAdminStaff()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return CounsellingSession.objects.filter(student=user).order_by('-created_at')
        elif user.role == 'staff' and user.staff_type in ['counsellor', 'admin']:
            return CounsellingSession.objects.all().order_by('-created_at')
        return CounsellingSession.objects.none()

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def student_sessions(self, request):
        qs = self.get_queryset().filter(student=request.user)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsCounsellorOrAdminStaff])
    def approve(self, request, pk=None):
        session = self.get_object()
        session.status = 'scheduled'
        session.scheduled_time = request.data.get('scheduled_time', session.scheduled_time)
        session.reschedule_reason = ''
        session.rescheduled_at = None
        session.approved_by = request.user
        session.staff = request.user
        session.save()
        return Response({'status': 'approved/scheduled'})

    @action(detail=True, methods=['post'], permission_classes=[IsCounsellorOrAdminStaff])
    def reject(self, request, pk=None):
        session = self.get_object()
        session.status = 'rejected'
        session.notes = request.data.get('notes', session.notes)
        session.approved_by = request.user
        session.staff = request.user
        session.save()
        return Response({'status': 'rejected'})

    @action(detail=True, methods=['post'], permission_classes=[IsCounsellorOrAdminStaff])
    def complete(self, request, pk=None):
        session = self.get_object()
        session.status = 'completed'
        session.save()
        return Response({'status': 'completed'})

    @action(detail=True, methods=['post'], permission_classes=[IsCounsellorOrAdminStaff])
    def reschedule(self, request, pk=None):
        from django.utils import timezone
        session = self.get_object()
        session.status = 'rescheduled'
        session.scheduled_time = request.data.get('scheduled_time', session.scheduled_time)
        session.reschedule_reason = request.data.get('reschedule_reason', '')
        session.rescheduled_at = timezone.now()
        session.approved_by = request.user
        session.staff = request.user
        session.save()
        return Response({'status': 'rescheduled'})

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'student':
            serializer.save(student=user, status='pending', created_by=user)
        elif user.role == 'staff' and user.staff_type in ['counsellor', 'admin']:
            serializer.save(created_by=user)
        else:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You do not have permission to create a session.')
