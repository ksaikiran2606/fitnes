from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.db.models import Sum, Avg
from django.utils import timezone
from datetime import timedelta
from workouts.models import WorkoutSession
from diet.models import DailyNutrition, Meal
from water.models import WaterIntake, DailyWaterGoal

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_analytics(request):
    user = request.user
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    # Workout Analytics
    total_workouts_week = WorkoutSession.objects.filter(
        user=user, date__range=[week_ago, today]
    ).count()
    
    total_calories_burned_week = WorkoutSession.objects.filter(
        user=user, date__range=[week_ago, today]
    ).aggregate(Sum('total_calories_burned'))['total_calories_burned__sum'] or 0
    
    # Diet Analytics
    today_nutrition = DailyNutrition.objects.filter(
        user=user, date=today
    ).first()
    
    weekly_calories = DailyNutrition.objects.filter(
        user=user, date__range=[week_ago, today]
    ).aggregate(Avg('total_calories'))['total_calories__avg'] or 0
    
    # Water Analytics
    today_water = WaterIntake.objects.filter(
        user=user, date=today
    ).aggregate(Sum('amount'))['amount__sum'] or 0
    
    water_goal_percentage = min(round((today_water / user.daily_water_goal) * 100), 100) if user.daily_water_goal > 0 else 0
    
    # BMI Calculation
    bmi = user.calculate_bmi()
    bmi_category = get_bmi_category(bmi) if bmi else None
    
    return Response({
        'workout_analytics': {
            'total_workouts_week': total_workouts_week,
            'total_calories_burned_week': total_calories_burned_week,
            'avg_calories_per_workout': round(total_calories_burned_week / max(total_workouts_week, 1))
        },
        'diet_analytics': {
            'today_calories': today_nutrition.total_calories if today_nutrition else 0,
            'weekly_avg_calories': round(weekly_calories),
            'calorie_goal': user.daily_calorie_goal,
            'calorie_balance': (today_nutrition.total_calories if today_nutrition else 0) - total_calories_burned_week
        },
        'water_analytics': {
            'today_intake': today_water,
            'daily_goal': user.daily_water_goal,
            'goal_percentage': water_goal_percentage
        },
        'user_metrics': {
            'bmi': bmi,
            'bmi_category': bmi_category,
            'bmr': user.calculate_bmr()
        }
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def weekly_charts(request):
    user = request.user
    today = timezone.now().date()
    week_ago = today - timedelta(days=6)  # 7 days including today
    
    dates = [week_ago + timedelta(days=i) for i in range(7)]
    
    workout_data = []
    nutrition_data = []
    water_data = []
    
    for date in dates:
        # Workout data
        workout_session = WorkoutSession.objects.filter(user=user, date=date).first()
        workout_data.append({
            'date': date.isoformat(),
            'calories_burned': workout_session.total_calories_burned if workout_session else 0
        })
        
        # Nutrition data
        nutrition = DailyNutrition.objects.filter(user=user, date=date).first()
        nutrition_data.append({
            'date': date.isoformat(),
            'calories_consumed': nutrition.total_calories if nutrition else 0
        })
        
        # Water data
        water_goal = DailyWaterGoal.objects.filter(user=user, date=date).first()
        water_data.append({
            'date': date.isoformat(),
            'intake': water_goal.achieved_amount if water_goal else 0,
            'goal': water_goal.goal_amount if water_goal else user.daily_water_goal
        })
    
    return Response({
        'workout_chart': workout_data,
        'nutrition_chart': nutrition_data,
        'water_chart': water_data
    })

def get_bmi_category(bmi):
    if bmi < 18.5:
        return 'Underweight'
    elif 18.5 <= bmi < 25:
        return 'Normal weight'
    elif 25 <= bmi < 30:
        return 'Overweight'
    else:
        return 'Obese'