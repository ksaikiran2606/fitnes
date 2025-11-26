from rest_framework import status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import UserRegistrationSerializer, UserProfileSerializer, UserUpdateSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

class LoginView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserProfileSerializer(user).data
            })
        return Response(
            {'error': 'Invalid Credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )

class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

class UpdateProfileView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

@api_view(['POST'])
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh_token")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response(
            {'message': 'Successfully logged out'}, 
            status=status.HTTP_205_RESET_CONTENT
        )
    except Exception as e:
        return Response(
            {'error': 'Invalid token'}, 
            status=status.HTTP_400_BAD_REQUEST
        )