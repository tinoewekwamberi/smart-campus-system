---
name: Bug report
about: Create a report to help us improve
title: '[BUG] Registration not saving user role'
labels: ['bug', 'backend', 'high-priority']
assignees: ''
---

## 🐛 Bug Description
When users register through the registration form, the role field is not being saved to the database. The registration appears successful, but the user's role remains null/empty.

## 🔄 Steps to Reproduce
1. Go to the registration page
2. Fill in username, email, password, and select a role (Student/Lecturer/Staff)
3. Submit the registration form
4. Check the database or user profile - role is not saved

## ✅ Expected Behavior
The selected role should be saved to the database and the user should have the correct role assigned.

## ❌ Actual Behavior
The role field is not saved, leaving the user without a proper role assignment.

## 📸 Screenshots
N/A - Backend issue

## 🖥️ Environment
- **OS**: Windows 10
- **Backend**: Django 5.2.3
- **Database**: MySQL 8.0
- **Frontend**: React 18

## 📝 Additional Context
This is a critical issue as it affects the core user management functionality. Users need proper roles to access role-specific features.

## 🔍 Possible Solution
The issue is likely in the `accounts/views.py` registration view. The role field needs to be properly handled when creating the user.

## 📋 Checklist
- [x] I have searched existing issues to avoid duplicates
- [x] I have provided all the requested information
- [x] I can reproduce this issue consistently
- [x] This is a bug in the application, not a configuration issue

## 🔗 Related Files
- `backend/accounts/views.py` - Registration view
- `backend/users/models.py` - CustomUser model
- `frontend/src/Register.jsx` - Registration form 