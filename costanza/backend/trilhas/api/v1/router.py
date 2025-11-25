from rest_framework.routers import DefaultRouter

from trilhas.api.v1 import viewsets

router = DefaultRouter()
router.register(r'trilhas', viewsets.TrilhaViewSet, basename='trilha')
router.register(r'atividades', viewsets.AtividadeViewSet, basename='atividade')

urlpatterns = router.urls
