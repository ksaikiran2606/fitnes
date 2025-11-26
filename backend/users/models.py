from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    age = models.PositiveIntegerField(null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # in kg
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # in cm
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    daily_calorie_goal = models.PositiveIntegerField(default=2000)
    daily_water_goal = models.PositiveIntegerField(default=2000)  # in ml
    
    def calculate_bmi(self):
        if self.height and self.weight:
            height_in_m = float(self.height) / 100
            return round(float(self.weight) / (height_in_m ** 2), 2)
        return None
    
    def calculate_bmr(self):
        """Calculate Basal Metabolic Rate"""
        if not all([self.age, self.weight, self.height, self.gender]):
            return None
            
        if self.gender == 'M':
            return round(88.362 + (13.397 * float(self.weight)) + (4.799 * float(self.height)) - (5.677 * self.age))
        elif self.gender == 'F':
            return round(447.593 + (9.247 * float(self.weight)) + (3.098 * float(self.height)) - (4.330 * self.age))
        return None

    def __str__(self):
        return self.username