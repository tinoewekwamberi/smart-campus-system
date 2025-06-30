from rest_framework.routers import DefaultRouter
from .views import SupportRequestViewSet

router = DefaultRouter()
router.register(r'support-requests', SupportRequestViewSet, basename='supportrequest')

urlpatterns = router.urls 