from rest_framework.routers import DefaultRouter
from .views import WellnessCheckinViewSet, CounsellingSessionViewSet

router = DefaultRouter()
router.register(r'checkins', WellnessCheckinViewSet, basename='wellness-checkin')
router.register(r'counselling-sessions', CounsellingSessionViewSet, basename='counselling-session')

urlpatterns = router.urls 