from django.db import models
from django.conf import settings

class WorkoutPlan(models.Model):
    DIFFICULTY_CHOICES = [
        ('B', 'Beginner'),
        ('I', 'Intermediate'),
        ('A', 'Advanced'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='workout_plans')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    difficulty = models.CharField(max_length=1, choices=DIFFICULTY_CHOICES, default='B')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.user.username}"

class Exercise(models.Model):
    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE, related_name='exercises')
    name = models.CharField(max_length=100)
    sets = models.PositiveIntegerField()
    reps = models.PositiveIntegerField()
    calories_burned = models.PositiveIntegerField(help_text="Calories burned per set")
    rest_time = models.PositiveIntegerField(help_text="Rest time in seconds between sets", default=60)
    
    def __str__(self):
        return f"{self.name} - {self.workout_plan.name}"

class WorkoutSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='workout_sessions')
    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE)
    date = models.DateField()
    duration = models.PositiveIntegerField(help_text="Duration in minutes")
    total_calories_burned = models.PositiveIntegerField()
    notes = models.TextField(blank=True)
    completed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.user.username} - {self.workout_plan.name} - {self.date}"