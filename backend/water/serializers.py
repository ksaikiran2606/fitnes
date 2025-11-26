from rest_framework import serializers
from .models import WaterIntake, DailyWaterGoal

class WaterIntakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterIntake
        fields = '__all__'
        read_only_fields = ('id', 'user')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class DailyWaterGoalSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = DailyWaterGoal
        fields = '__all__'
        read_only_fields = ('id', 'user', 'achieved_amount')

    def get_progress_percentage(self, obj):
        return obj.progress_percentage()