from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta, date
from .models import Meal, DailyNutrition
from .serializers import MealSerializer, DailyNutritionSerializer

class MealViewSet(viewsets.ModelViewSet):
    serializer_class = MealSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Meal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        self.update_daily_nutrition(serializer.instance.date)

    def perform_destroy(self, instance):
        meal_date = instance.date
        super().perform_destroy(instance)
        self.update_daily_nutrition(meal_date)

    def update_daily_nutrition(self, nutrition_date):
        """Update daily nutrition summary after meal changes"""
        daily_nutrition, created = DailyNutrition.objects.get_or_create(
            user=self.request.user,
            date=nutrition_date,
            defaults={
                'total_calories': 0,
                'total_protein': 0,
                'total_carbs': 0,
                'total_fats': 0
            }
        )
        
        meals = Meal.objects.filter(user=self.request.user, date=nutrition_date)
        
        daily_nutrition.total_calories = meals.aggregate(Sum('calories'))['calories__sum'] or 0
        daily_nutrition.total_protein = meals.aggregate(Sum('protein'))['protein__sum'] or 0
        daily_nutrition.total_carbs = meals.aggregate(Sum('carbs'))['carbs__sum'] or 0
        daily_nutrition.total_fats = meals.aggregate(Sum('fats'))['fats__sum'] or 0
        
        daily_nutrition.save()

    @action(detail=False, methods=['get'])
    def today_meals(self, request):
        today = timezone.now().date()
        meals = self.get_queryset().filter(date=today)
        serializer = self.get_serializer(meals, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def weekly_summary(self, request):
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        nutrition_data = DailyNutrition.objects.filter(
            user=request.user,
            date__range=[week_ago, today]
        ).order_by('date')
        
        serializer = DailyNutritionSerializer(nutrition_data, many=True)
        return Response(serializer.data)

class DailyNutritionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DailyNutritionSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return DailyNutrition.objects.filter(user=self.request.user)