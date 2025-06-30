from rest_framework import permissions


class IsLecturerOrStaff(permissions.BasePermission):
    """
    Allow access only to lecturers and staff.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ['lecturer', 'staff']
        )


class IsStaffOnly(permissions.BasePermission):
    """
    Allow access only to staff.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'staff'
        )


class IsStudentOrLecturer(permissions.BasePermission):
    """
    Allow access only to students and lecturers.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ['student', 'lecturer']
        )


class IsCourseLecturer(permissions.BasePermission):
    """
    Allow access only to the lecturer who created the course.
    """
    def has_object_permission(self, request, view, obj):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == 'staff' or 
             (request.user.role == 'lecturer' and obj.lecturer == request.user))
        ) 