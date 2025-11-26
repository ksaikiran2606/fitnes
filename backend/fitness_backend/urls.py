from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/workouts/', include('workouts.urls')),
    path('api/diet/', include('diet.urls')),
    path('api/water/', include('water.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]