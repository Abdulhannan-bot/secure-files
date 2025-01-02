from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer, VerifyOTPSerializer, SendOTPSerializer
from .utils import set_cookie
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.core.mail import send_mail
from django.middleware.csrf import get_token
from .models import User

ACCESS_TOKEN_LIFETIME = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
REFRESH_TOKEN_LIFETIME = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
EMAIL_HOST_USER = settings.EMAIL_HOST_USER


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    # time.sleep(10)
    print(request.data)
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        user = serializer.save()
        response_data = {
            "success": True,
            "msg": "Registration successful.",
            "data": {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "user_id": user.id
            },
        }

        return Response(response_data, status=status.HTTP_201_CREATED)

    print(serializer.errors)
    return Response({
        "success": False,
        "msg": "Registration failed.",
        "error": serializer.errors,
    }, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data, context={"request": request})
    try:
        if serializer.is_valid(raise_exception=True):
            
            response =  Response({
                "success": True,
                "msg": "Login successful.",
                "data": serializer.validated_data
            }, status=status.HTTP_200_OK)
            return response
        else:
            return Response({
                "success": False,
                "msg": "Login failed.",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        
    except ValidationError as e:
        print(e.detail)
        return Response({
            "success": False,
            "msg": "Login failed.",
            "error": e.detail
        }, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp_view(request):
    serializer = SendOTPSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            "success": True,
            "msg": "OTP sent successfully."
        }, status=status.HTTP_200_OK)
    
    return Response({
        "success": False,
        "msg": "Failed to send OTP.",
        "errors": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp_view(request):
    serializer = VerifyOTPSerializer(data=request.data)
    if serializer.is_valid():
        tokens = serializer.validated_data.get("tokens")
        if not tokens or not tokens.get("access") or not tokens.get("refresh"):
            return Response({
                "success": False,
                "msg": "Token generation failed.",
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
        response =  Response({
            "success": True,
            "msg": "OTP verified.",
        }, status=status.HTTP_200_OK)
        csrf_token = get_token(request)
        set_cookie(response,'access', tokens.get("access"), max_age=int(ACCESS_TOKEN_LIFETIME.total_seconds()), secure=False)
        set_cookie(response,'refresh', tokens.get("refresh"), max_age=int(REFRESH_TOKEN_LIFETIME.total_seconds()), secure=False)
        set_cookie(response, 'csrftoken', csrf_token,max_age=60 * 60,secure=False,httponly=False),
        return response
    
    else:
        print(serializer.errors)
        error_messages = list(serializer.errors.values())
        flattened_errors = [error for sublist in error_messages for error in sublist]
        print(error_messages)
        return Response({
            "success": False,
            "msg": "OTP verification failed.",
            "error": flattened_errors[0] if flattened_errors else "Unknown error"
        }, status=status.HTTP_400_BAD_REQUEST)

 
@api_view(["POST"])
@permission_classes((AllowAny))    
def set_password(request):
    body = request.data
    password = body.get("password")
    email = body.get("email")
    try:
        user = User.objects.get(email = email)
        if user.check_password(password):
            return Response({'success': False, 'msg': "Your current password cannot be similar to the old password"}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(password)
        user.save()
        return Response({"success": True, "msg": "Password set successfully"}, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({'success': False, 'msg': 'The email is not registered with us'}, status=status.HTTP_400_BAD_REQUEST)

    
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])   
def reset_password(request):   
    user = request.user
 
    email = user.email

    body = request.data
    old_password = body.get("currentPassword")
    password = body.get("newPassword")

    print(old_password, password)
    cred = user.password
    try:
        user = User.objects.get(email = email)
        if not user.check_password(old_password):
            return Response({'success': False, 'msg': "Your current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
        if user.check_password(password):
            return Response({'success': False, 'msg': "Your current password cannot be similar to the old password"}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(password)
        user.save()
        return Response({"success": True, "msg": "Password set successfully"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'success': False, 'msg': 'The email is not registered with us'}, status=status.HTTP_400_BAD_REQUEST)
      
    

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    refresh_token = request.COOKIES.get('refresh')
    if not refresh_token:
        return Response({'success': False, 'error': 'Refresh token missing'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        token = RefreshToken(refresh_token)
        access_token = str(token.access_token)
        new_refresh_token = str(token)
        response = Response({'success':True, 'msg': 'Tokens refreshed'}, status=status.HTTP_200_OK)
        set_cookie(response,'access', access_token, max_age=int(ACCESS_TOKEN_LIFETIME.total_seconds()), secure=False)
        set_cookie(response, 'refresh', new_refresh_token, max_age=int(REFRESH_TOKEN_LIFETIME.total_seconds()), secure=False)
        return response
    except Exception as e:
        print(e)
        return Response({'success': False, 'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    refresh_token = request.COOKIES.get('refresh')
    if not refresh_token:
        return Response({'success': False, 'msg': 'Refresh token missing'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        response = Response({'success': True, 'msg': 'Logout successful'}, status=status.HTTP_200_OK)
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        response.delete_cookie("csrftoken")
        return response
    except Exception as e:
        return Response({'success': False, 'error': 'Failed to logout'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_view(request):
    try:
        is_admin = request.user.is_staff
        return Response(
            {
                'success': True,
                'message': 'User is authenticated',
                'is_admin': is_admin,
            },
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {'success': False, 'message': 'User is not registered'},
            status=status.HTTP_401_UNAUTHORIZED
        )
