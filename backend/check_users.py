#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

def check_users():
    print("=== USER DATA CHECK ===")
    print()
    
    users = User.objects.all()
    print(f"Total users: {users.count()}")
    print()
    
    for user in users:
        print(f"User: {user.username}")
        print(f"  Name: {user.get_full_name()}")
        print(f"  Email: {user.email}")
        print(f"  Role: {user.role}")
        print(f"  Is Staff: {user.is_staff}")
        print(f"  Is Active: {user.is_active}")
        print()

if __name__ == "__main__":
    check_users() 