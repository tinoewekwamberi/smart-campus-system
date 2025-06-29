#!/usr/bin/env python3
"""
Simple test script to verify registration endpoint is working
"""

import requests
import json

# Test data
test_user = {
    "username": "teststudent",
    "password": "testpass123",
    "email": "teststudent@example.com",
    "role": "student",
    "first_name": "Test",
    "last_name": "Student"
}

def test_registration():
    """Test the registration endpoint"""
    print("🧪 Testing Registration Endpoint...")
    
    try:
        # Test registration
        response = requests.post(
            'http://localhost:8000/api/accounts/register/',
            json=test_user,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 201:
            print("✅ Registration successful!")
            return True
        else:
            print("❌ Registration failed!")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure Django is running on localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_login():
    """Test login with the registered user"""
    print("\n🧪 Testing Login...")
    
    try:
        login_data = {
            "username": test_user["username"],
            "password": test_user["password"]
        }
        
        response = requests.post(
            'http://localhost:8000/api/token/',
            json=login_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            tokens = response.json()
            print("✅ Login successful!")
            print(f"Access Token: {tokens['access'][:50]}...")
            return tokens['access']
        else:
            print("❌ Login failed!")
            print(f"Response: {response.json()}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_user_info(access_token):
    """Test getting user info with the access token"""
    print("\n🧪 Testing User Info...")
    
    try:
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(
            'http://localhost:8000/api/accounts/me/',
            headers=headers
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            user_info = response.json()
            print("✅ User info retrieved successfully!")
            print(f"User: {user_info}")
            
            # Check if role is present
            if 'role' in user_info:
                print(f"✅ Role is present: {user_info['role']}")
            else:
                print("❌ Role is missing from user info!")
                
            return True
        else:
            print("❌ Failed to get user info!")
            print(f"Response: {response.json()}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 SCMS Registration Test")
    print("=" * 40)
    
    # Test registration
    if test_registration():
        # Test login
        access_token = test_login()
        if access_token:
            # Test user info
            test_user_info(access_token)
    
    print("\n" + "=" * 40)
    print("🏁 Test completed!") 