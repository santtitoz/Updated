from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import viewsets

router = DefaultRouter()
router.register(r'request', viewsets.FriendRequestViewSet, basename='friend-requests')
router.register(r'', viewsets.FriendshipViewSet, basename='friends')

urlpatterns = router.urls
