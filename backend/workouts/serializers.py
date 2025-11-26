from rest_framework import serializers
from .models import WorkoutPlan, Exercise, WorkoutSession

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'
        read_only_fields = ('id',)

class WorkoutPlanSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True, read_only=True)
    exercise_count = serializers.SerializerMethodField()

    class Meta:
        model = WorkoutPlan
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def get_exercise_count(self, obj):
        return obj.exercises.count()

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class WorkoutSessionSerializer(serializers.ModelSerializer):
    workout_plan_name = serializers.CharField(source='workout_plan.name', read_only=True)

    class Meta:
        model = WorkoutSession
        fields = '__all__'
        read_only_fields = ('id', 'user', 'completed_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)