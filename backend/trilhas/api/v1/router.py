from rest_framework.routers import DefaultRouter
from trilhas.api.v1 import viewsets

router = DefaultRouter()

# Rota principal: /api/v1/trilhas/
router.register(r'', viewsets.TrilhaViewSet, basename='trilha')

# Rota de módulos: /api/v1/trilhas/modulos/
router.register(r'modulos', viewsets.ModuloViewSet, basename='modulo')

# Rota de atividades: /api/v1/trilhas/atividades/
router.register(r'atividades', viewsets.AtividadeViewSet, basename='atividade')

urlpatterns = router.urls