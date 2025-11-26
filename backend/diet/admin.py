from django.contrib import admin
from .models import Meal, DailyNutrition

@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'meal_type', 'calories', 'date')
    list_filter = ('meal_type', 'date')
    search_fields = ('name', 'user__username')

@admin.register(DailyNutrition)
class DailyNutritionAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'total_calories', 'total_protein', 'total_carbs', 'total_fats')
    list_filter = ('date',)
    search_fields = ('user__username',)