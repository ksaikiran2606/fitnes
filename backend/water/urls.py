from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WaterIntakeViewSet, DailyWaterGoalViewSet

router = DefaultRouter()
router.register(r'intake', WaterIntakeViewSet, basename='waterintake')
router.register(r'goals', DailyWaterGoalViewSet, basename='dailywatergoal')

urlpatterns = [
    path('', include(router.urls)),
]