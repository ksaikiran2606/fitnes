from django.db import models
from users.models import User

class WaterIntake(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='water_intakes')
    date = models.DateField()
    amount = models.PositiveIntegerField(help_text="Amount in ml")
    consumed_at = models.TimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date', '-consumed_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.amount}ml"

class DailyWaterGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_water_goals')
    date = models.DateField()
    goal_amount = models.PositiveIntegerField(default=2000)  # in ml
    achieved_amount = models.PositiveIntegerField(default=0)  # in ml
    
    class Meta:
        unique_together = ['user', 'date']
    
    def progress_percentage(self):
        if self.goal_amount > 0:
            return min(round((self.achieved_amount / self.goal_amount) * 100), 100)
        return 0
    
    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.progress_percentage()}%"