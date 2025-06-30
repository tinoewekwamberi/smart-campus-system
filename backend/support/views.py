from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import SupportRequest
from .serializers import SupportRequestSerializer

# Create your views here.

class SupportRequestViewSet(viewsets.ModelViewSet):
    queryset = SupportRequest.objects.all()
    serializer_class = SupportRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Housekeeping/maintenance staff see all requests
        if user.role == 'staff' and user.staff_type in ['housekeeping', 'maintenance']:
            return SupportRequest.objects.all()
        # Otherwise, users see their own requests
        return SupportRequest.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
