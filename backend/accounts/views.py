from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status
from django.contrib.auth.hashers import make_password

User = get_user_model()

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
        "id": user.id,
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    role = request.data.get('role')
    if not username or not password or not email or not role:
        return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create(
        username=username,
        email=email,
        password=make_password(password)
    )
    user.save()
    # Optionally, store role in user profile or a custom user model
    return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
