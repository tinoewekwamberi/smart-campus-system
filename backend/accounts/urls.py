from django.urls import path
from .views import user_info, register

urlpatterns = [
    path('me/', user_info, name='user_info'),
    path('register/', register, name='register'),
] 