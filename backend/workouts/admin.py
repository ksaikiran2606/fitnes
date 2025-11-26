from django.contrib import admin
from .models import WorkoutPlan, Exercise, WorkoutSession

@admin.register(WorkoutPlan)
class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'difficulty', 'created_at')
    list_filter = ('difficulty', 'created_at')
    search_fields = ('name', 'user__username')

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('name', 'workout_plan', 'sets', 'reps', 'calories_burned')
    list_filter = ('workout_plan',)

@admin.register(WorkoutSession)
class WorkoutSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'workout_plan', 'date', 'duration', 'total_calories_burned')
    list_filter = ('date', 'workout_plan')
    search_fields = ('user__username', 'workout_plan__name')