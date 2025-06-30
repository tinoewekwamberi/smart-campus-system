from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from .models import CustomUser
from .serializers import UserProfileSerializer

class ProfileViewSet(viewsets.ModelViewSet):
    """
    Profile management for users.
    - Self profile: /api/profile/ (GET, PUT, PATCH)
    - Admin profile: /api/users/{id}/profile/ (GET, PUT, PATCH)
    - Password change: /api/profile/change-password/ (POST)
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        if self.action == 'self_profile':
            return CustomUser.objects.filter(id=self.request.user.id)
        return CustomUser.objects.all()

    @action(detail=False, methods=['get', 'put', 'patch'])
    def self_profile(self, request):
        """Get or update current user's profile"""
        user = request.user
        
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get', 'put', 'patch'], permission_classes=[permissions.IsAdminUser])
    def admin_profile(self, request, pk=None):
        """Admin: Get or update any user's profile"""
        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change current user's password"""
        user = request.user
        form = PasswordChangeForm(user, request.data)
        
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            return Response({'message': 'Password changed successfully'})
        
        return Response({'error': 'Invalid password data'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def upload_picture(self, request):
        """Upload profile picture for current user"""
        user = request.user
        
        if 'profile_picture' not in request.FILES:
            return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.profile_picture = request.FILES['profile_picture']
        user.save()
        
        serializer = self.get_serializer(user)
        return Response(serializer.data) 