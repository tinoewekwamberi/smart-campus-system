#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course
from django.contrib.auth import get_user_model
User = get_user_model()

def assign_courses():
    print("=== ASSIGNING COURSES TO LECTURER ===")
    print()
    
    # Get the lecturer
    lecturer = User.objects.get(username='taku.mberi')
    print(f"Lecturer: {lecturer.get_full_name()} ({lecturer.username})")
    print()
    
    # Assign some courses to this lecturer
    courses_to_assign = ['IT101', 'IT201', 'IT301']
    updated_courses = Course.objects.filter(code__in=courses_to_assign).update(lecturer=lecturer)
    
    print(f"Updated {updated_courses} courses to {lecturer.get_full_name()}")
    print()
    
    # Show the updated course assignments
    print("=== UPDATED COURSE ASSIGNMENTS ===")
    print()
    
    courses = Course.objects.all()
    for course in courses:
        print(f"Course: {course.code} - {course.name}")
        print(f"  Lecturer: {course.lecturer.get_full_name()}")
        print(f"  Semester: {course.semester}")
        print()

if __name__ == "__main__":
    assign_courses() 