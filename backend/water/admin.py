from django.contrib import admin
from .models import WaterIntake, DailyWaterGoal

@admin.register(WaterIntake)
class WaterIntakeAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'amount', 'consumed_at')
    list_filter = ('date',)
    search_fields = ('user__username',)

@admin.register(DailyWaterGoal)
class DailyWaterGoalAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'goal_amount', 'achieved_amount', 'progress_percentage')
    list_filter = ('date',)
    search_fields = ('user__username',)