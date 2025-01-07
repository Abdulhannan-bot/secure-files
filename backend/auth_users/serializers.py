from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import generateRandomPassword, send_welcome_email, send_otp_email, generate_tokens
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.hashers import check_password
from datetime import datetime, timedelta
from django.utils.translation import gettext_lazy as _



class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name')

    def create(self, validated_data):
        email = validated_data['email']
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"error": "This email is already registered."})

        password = generateRandomPassword(6, False)
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        send_welcome_email(user, password)
        return user


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True,required=False)
    
    class Meta:
        model = User
        fields = ["email", "password"]

    def validate(self, data):
     
        email = data.get('email')
        password = data.get('password')
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"error": "No account found with this email."})
        
        if not user.is_active:
            raise serializers.ValidationError({"error":"This account is inactive."})
        
        if not email or not password:
            raise serializers.ValidationError({"error":"Both email and password are required."})

        if not password:
            raise serializers.ValidationError({"error": "Password is required for credentials login."})
        
        authenticated_user = authenticate(request=self.context.get('request'), email=email, password=password)
        if not authenticated_user:
            raise serializers.ValidationError({"error": "Invalid email or password."})
        
        otp = generateRandomPassword(6, True)  # Assuming this generates a 6-character random OTP
        expiration_time = datetime.now() + timedelta(minutes=5)
        authenticated_user.otp_code = otp
        authenticated_user.otp_expiration_date = expiration_time
        authenticated_user.save()
        # print(f'otp - {otp}')


        send_otp_email(authenticated_user, otp)
       
       
        data = {
            "email": authenticated_user.email,
            "first_name": authenticated_user.first_name,
            "last_name": authenticated_user.last_name,
            "user_id": authenticated_user.id,
            "otp_sent": True, 
        }
      
        return data

    def get_tokens(self,user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    
class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError({"error":"No account found with this email."})
        return value

    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)

        # Generate OTP
        otp = generateRandomPassword(6, True)
        expiration_time = timezone.now() + timedelta(minutes=5)

        # Set OTP and expiration time
        user.otp_code = otp
        user.otp_expiration_date = expiration_time
        user.save()

        print(f'otp --- {otp}')

        # Send OTP
        send_otp_email(user, otp)
        return user


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    otp = serializers.CharField(required=True)

    def validate(self, data):
        email = data.get("email")
        otp = data.get("otp")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(_("This email is not registered with us."))

        if user.otp_code != otp:
            raise serializers.ValidationError(_("Invalid OTP."))

        if user.otp_expiration_date < timezone.now():
            raise serializers.ValidationError(_("OTP has expired."))
        
        # user.otp_code = None
        # user.otp_expiration_date = None
        # user.save()
        tokens = generate_tokens(user)

        # Add the user to validated data for further use if needed
        data["user"] = user
        data["tokens"] = tokens
        return data