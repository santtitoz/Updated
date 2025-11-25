from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import viewsets

router = DefaultRouter()
router.register(r'friends', viewsets.FriendshipViewSet, basename='friends')
router.register(r'requests', viewsets.FriendRequestViewSet, basename='friend-requests')

urlpatterns = [
    path('friends/', include(router.urls)),
]
