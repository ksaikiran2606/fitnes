from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta, date
from .models import WaterIntake, DailyWaterGoal
from .serializers import WaterIntakeSerializer, DailyWaterGoalSerializer

class WaterIntakeViewSet(viewsets.ModelViewSet):
    serializer_class = WaterIntakeSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return WaterIntake.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        self.update_daily_goal(serializer.instance.date)

    def perform_destroy(self, instance):
        intake_date = instance.date
        super().perform_destroy(instance)
        self.update_daily_goal(intake_date)

    def update_daily_goal(self, goal_date):
        """Update daily water goal progress"""
        daily_goal, created = DailyWaterGoal.objects.get_or_create(
            user=self.request.user,
            date=goal_date,
            defaults={'goal_amount': self.request.user.daily_water_goal}
        )
        
        total_intake = WaterIntake.objects.filter(
            user=self.request.user,
            date=goal_date
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        daily_goal.achieved_amount = total_intake
        daily_goal.save()

    @action(detail=False, methods=['get'])
    def today_intake(self, request):
        today = timezone.now().date()
        intake = self.get_queryset().filter(date=today)
        serializer = self.get_serializer(intake, many=True)
        
        total_today = intake.aggregate(Sum('amount'))['amount__sum'] or 0
        goal = request.user.daily_water_goal
        
        return Response({
            'intakes': serializer.data,
            'total_today': total_today,
            'goal': goal,
            'progress_percentage': min(round((total_today / goal) * 100), 100) if goal > 0 else 0
        })

    @action(detail=False, methods=['get'])
    def weekly_summary(self, request):
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        water_data = DailyWaterGoal.objects.filter(
            user=request.user,
            date__range=[week_ago, today]
        ).order_by('date')
        
        serializer = DailyWaterGoalSerializer(water_data, many=True)
        return Response(serializer.data)

class DailyWaterGoalViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DailyWaterGoalSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return DailyWaterGoal.objects.filter(user=self.request.user)