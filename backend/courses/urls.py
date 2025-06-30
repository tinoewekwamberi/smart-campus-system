from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, EnrollmentViewSet, CourseScheduleViewSet, CourseMaterialViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'schedules', CourseScheduleViewSet, basename='schedule')
router.register(r'materials', CourseMaterialViewSet, basename='material')

urlpatterns = [
    path('', include(router.urls)),
] 