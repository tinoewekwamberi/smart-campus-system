---
name: Feature request
about: Suggest an idea for this project
title: '[FEATURE] Course Management System'
labels: ['enhancement', 'fullstack', 'medium-priority']
assignees: ''
---

## 🚀 Feature Description
Implement a comprehensive course management system that allows lecturers and staff to create, manage, and track courses, while students can view and enroll in available courses.

## 🎯 Problem Statement
Currently, there's no way to manage courses in the system. Lecturers need to create and manage their courses, students need to enroll in courses, and staff need administrative oversight.

## 💡 Proposed Solution
Create a complete course management system with the following components:

### Backend Models
```python
class Course(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    credits = models.IntegerField()
    lecturer = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    students = models.ManyToManyField(CustomUser, related_name='enrolled_courses')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Enrollment(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('enrolled', 'Enrolled'),
        ('dropped', 'Dropped'),
        ('completed', 'Completed')
    ])
```

### API Endpoints
- `GET /api/courses/` - List courses (filtered by role)
- `POST /api/courses/` - Create course (Lecturer/Staff only)
- `GET /api/courses/{id}/` - Get course details
- `PUT /api/courses/{id}/` - Update course (Lecturer/Staff only)
- `DELETE /api/courses/{id}/` - Delete course (Staff only)
- `POST /api/courses/{id}/enroll/` - Enroll in course (Student only)
- `POST /api/courses/{id}/drop/` - Drop course (Student only)

### Frontend Components
- Course listing page
- Course creation/editing forms
- Course detail view
- Enrollment management
- Course search and filtering

## 🔄 Alternative Solutions
- Simple course list without enrollment tracking
- Manual course assignment by staff only
- Third-party course management integration

## 📊 Impact Assessment
- **User Impact**: High - Core academic functionality
- **Technical Impact**: Medium - Database design and API development
- **Development Effort**: Medium - 2-3 weeks for full implementation

## 🎨 Mockups/Designs
- Course cards with enrollment status
- Course creation wizard
- Course detail modal/page
- Enrollment confirmation dialogs

## 📋 Acceptance Criteria
- [ ] Lecturers can create and manage their courses
- [ ] Students can view and enroll in available courses
- [ ] Staff can manage all courses in the system
- [ ] Course enrollment status is properly tracked
- [ ] Course search and filtering works
- [ ] Responsive design for all course management pages

## 🔗 Related Issues
- Issue #002: Role-based navigation (needed for course management UI)

## 📝 Additional Context
This is a foundational feature that will enable grade tracking and study plan management. Should be implemented after role-based navigation.

## 🏷️ Suggested Labels
- `enhancement`
- `fullstack`
- `database`
- Priority: `medium`

## 📋 Checklist
- [x] I have searched existing issues to avoid duplicates
- [x] This feature aligns with the project's goals
- [x] I have provided sufficient detail for implementation
- [x] I'm willing to help with implementation if needed

## 🔗 Related Files
- `backend/` - New Django app for courses
- `frontend/src/components/Course/` - Course-related components
- `backend/accounts/views.py` - User management
- Database migrations for new models 