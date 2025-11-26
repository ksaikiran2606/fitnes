from rest_framework import serializers
from .models import Meal, DailyNutrition

class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = '__all__'
        read_only_fields = ('id', 'user')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class DailyNutritionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyNutrition
        fields = '__all__'
        read_only_fields = ('id', 'user')