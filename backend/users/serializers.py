from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name', 'age', 'weight', 'height', 'gender')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Check if username already exists
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "A user with that username already exists."})
            
        # Check if email already exists
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with that email already exists."})
            
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    bmi = serializers.SerializerMethodField()
    bmr = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'age', 
                 'weight', 'height', 'gender', 'daily_calorie_goal', 'daily_water_goal', 'bmi', 'bmr')
        read_only_fields = ('id', 'username', 'email')

    def get_bmi(self, obj):
        return obj.calculate_bmi()

    def get_bmr(self, obj):
        return obj.calculate_bmr()

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'age', 'weight', 'height', 'gender', 
                 'daily_calorie_goal', 'daily_water_goal')