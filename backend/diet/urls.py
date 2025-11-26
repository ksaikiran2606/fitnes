from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MealViewSet, DailyNutritionViewSet

router = DefaultRouter()
router.register(r'meals', MealViewSet, basename='meal')
router.register(r'nutrition', DailyNutritionViewSet, basename='dailynutrition')

urlpatterns = [
    path('', include(router.urls)),
]