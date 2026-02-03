from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, ProjectViewSet

router = DefaultRouter()
router.register(r'services', ServiceViewSet)
router.register(r'projects', ProjectViewSet)

urlpatterns = [
    path('', include(router.urls)),
]