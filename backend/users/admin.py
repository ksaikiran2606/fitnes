from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'age', 'weight', 'height', 'gender')
    list_filter = ('gender', 'is_staff', 'is_superuser')
    fieldsets = UserAdmin.fieldsets + (
        ('Fitness Information', {
            'fields': ('age', 'weight', 'height', 'gender', 'daily_calorie_goal', 'daily_water_goal')
        }),
    )