#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course, Enrollment
from django.contrib.auth import get_user_model
User = get_user_model()

def check_courses():
    print("=== COURSE DATA CHECK ===")
    print()
    
    courses = Course.objects.all()
    print(f"Total courses: {courses.count()}")
    print()
    
    for course in courses:
        print(f"Course: {course.code} - {course.name}")
        print(f"  Semester: {course.semester}")
        print(f"  Year: {course.year}")
        print(f"  Lecturer: {course.lecturer.get_full_name()}")
        print(f"  Credits: {course.credits}")
        print(f"  Level: {course.level}")
        print(f"  Type: {course.course_type}")
        print(f"  Students: {course.enrollment_count}/{course.max_students}")
        print()

def check_enrollments():
    print("=== ENROLLMENT DATA CHECK ===")
    print()
    
    enrollments = Enrollment.objects.all()
    print(f"Total enrollments: {enrollments.count()}")
    print()
    
    for enrollment in enrollments:
        print(f"Student: {enrollment.student.get_full_name()}")
        print(f"  Course: {enrollment.course.code}")
        print(f"  Status: {enrollment.status}")
        print(f"  Grade: {enrollment.grade}")
        print(f"  Percentage: {enrollment.percentage_score}")
        print()

if __name__ == "__main__":
    check_courses()
    check_enrollments() 