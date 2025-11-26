from django.urls import path
from .views import WorkoutPlanViewSet, ExerciseViewSet, WorkoutSessionViewSet

workout_list = WorkoutPlanViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
workout_detail = WorkoutPlanViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

exercise_list = ExerciseViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
exercise_detail = ExerciseViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

session_list = WorkoutSessionViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
session_detail = WorkoutSessionViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = [
    path('plans/', workout_list, name='workoutplan-list'),
    path('plans/<int:pk>/', workout_detail, name='workoutplan-detail'),
    path('plans/<int:pk>/add-exercise/', WorkoutPlanViewSet.as_view({'post': 'add_exercise'}), name='workoutplan-add-exercise'),
    
    path('exercises/', exercise_list, name='exercise-list'),
    path('exercises/<int:pk>/', exercise_detail, name='exercise-detail'),
    
    path('sessions/', session_list, name='workoutsession-list'),
    path('sessions/<int:pk>/', session_detail, name='workoutsession-detail'),
    path('sessions/weekly-progress/', WorkoutSessionViewSet.as_view({'get': 'weekly_progress'}), name='workoutsession-weekly-progress'),
]