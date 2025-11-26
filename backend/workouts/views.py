from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from .models import WorkoutPlan, Exercise, WorkoutSession
from .serializers import WorkoutPlanSerializer, ExerciseSerializer, WorkoutSessionSerializer

class WorkoutPlanViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutPlanSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return WorkoutPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_exercise(self, request, pk=None):
        workout_plan = self.get_object()
        serializer = ExerciseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(workout_plan=workout_plan)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExerciseViewSet(viewsets.ModelViewSet):
    serializer_class = ExerciseSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Exercise.objects.filter(workout_plan__user=self.request.user)

class WorkoutSessionViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSessionSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return WorkoutSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def weekly_progress(self, request):
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        sessions = WorkoutSession.objects.filter(
            user=request.user,
            date__range=[week_ago, today]
        ).values('date').annotate(
            total_calories=Sum('total_calories_burned'),
            total_sessions=Count('id')
        ).order_by('date')
        
        return Response(sessions)