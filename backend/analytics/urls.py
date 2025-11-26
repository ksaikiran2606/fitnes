from django.urls import path
from .views import dashboard_analytics, weekly_charts

urlpatterns = [
    path('dashboard/', dashboard_analytics, name='dashboard-analytics'),
    path('weekly-charts/', weekly_charts, name='weekly-charts'),
]