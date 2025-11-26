from django.db import models
from users.models import User

class Meal(models.Model):
    MEAL_TYPE_CHOICES = [
        ('BREAKFAST', 'Breakfast'),
        ('LUNCH', 'Lunch'),
        ('DINNER', 'Dinner'),
        ('SNACK', 'Snack'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meals')
    name = models.CharField(max_length=100)
    meal_type = models.CharField(max_length=10, choices=MEAL_TYPE_CHOICES)
    calories = models.PositiveIntegerField()
    protein = models.DecimalField(max_digits=5, decimal_places=1, default=0)  # in grams
    carbs = models.DecimalField(max_digits=5, decimal_places=1, default=0)    # in grams
    fats = models.DecimalField(max_digits=5, decimal_places=1, default=0)     # in grams
    date = models.DateField()
    consumed_at = models.TimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date', 'meal_type']
    
    def __str__(self):
        return f"{self.user.username} - {self.meal_type} - {self.name}"

class DailyNutrition(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_nutrition')
    date = models.DateField(unique=True)
    total_calories = models.PositiveIntegerField(default=0)
    total_protein = models.DecimalField(max_digits=6, decimal_places=1, default=0)
    total_carbs = models.DecimalField(max_digits=6, decimal_places=1, default=0)
    total_fats = models.DecimalField(max_digits=6, decimal_places=1, default=0)
    
    class Meta:
        ordering = ['-date']
        unique_together = ['user', 'date']
    
    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.total_calories} cal"