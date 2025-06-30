from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import WellnessCheckin, CounsellingSession
from .serializers import WellnessCheckinSerializer, CounsellingSessionSerializer
from users.models import CustomUser

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

class CounsellingSessionViewSet(viewsets.ModelViewSet):
    queryset = CounsellingSession.objects.all().order_by('-created_at')
    serializer_class = CounsellingSessionSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'student_sessions']:
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
