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
        "role": user.role,
        "first_name": user.first_name,
        "last_name": user.last_name,
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    role = request.data.get('role')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    
    # Validate required fields
    if not username or not password or not email or not role:
        return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate role
    valid_roles = ['student', 'lecturer', 'staff']
    if role not in valid_roles:
        return Response({'error': 'Invalid role. Must be student, lecturer, or staff.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if username already exists
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if email already exists
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Create user with role
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            role=role,
            first_name=first_name,
            last_name=last_name
        )
        
        return Response({
            'message': 'User registered successfully.',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': f'Registration failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
