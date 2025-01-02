import random
from django.conf import settings
from django.core.mail import send_mail
from django.core.mail import BadHeaderError
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction

COOKIES_SECURE = settings.SESSION_COOKIE_SECURE

def generateRandomPassword(pass_count=10, only_num=False):
    characters = list('0123456789')
    if not only_num:
        characters.extend('abcdefghijklmnopqrstuvwxyz')
        characters.extend('ABCDEFGHIJHIJKLMNOPQRSTUVWXYZ')

    thepassword = ''
    for i in range(pass_count):
        thepassword += random.choice(characters)

    return thepassword

def set_cookie(response,key,value,max_age,secure=COOKIES_SECURE,httponly=True):
    response.set_cookie(
        key=key,
        value=value,
        max_age=max_age,
        domain='localhost',
        path='/',
        httponly=httponly,
        secure=secure,
        samesite='None' if COOKIES_SECURE else None
    )
    return response

def generate_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def send_welcome_email(user, password=None):
    subject = "Welcome to SecureFiles"
    message = (
        f"Hi {user.first_name} {user.last_name},\n\n"
        f"Welcome to Sample App!\n\n"
        f"{f'Your password is {password}. Please change it after login.' if password else 'You can log in using your Gmail credentials.'}\n\n"
        "Best regards,\nSecureFiles Team"
    )
    try:
        with transaction.atomic():
            send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email], fail_silently=False)
    except BadHeaderError as bhe:
        raise ValueError("Invalid header found. Email not sent.") from bhe

    except Exception as e:
        raise ValueError("An unexpected error occurred while sending the email.") from e
    
def send_otp_email(user, password=None):
    subject = "Your OTP | SecureFiles"
    message = (
        f"Dear {user.first_name} {user.last_name},\n\n"
        f"We have generated a One-Time Password (OTP) for your request:\n\n"
        f"**{password}**\n\n"
        f"This OTP is valid for the next 5 minutes. Please use it promptly to complete your action.\n\n"
        f"If you did not request this OTP, please ignore this email or contact our support team immediately.\n\n"
        f"Best regards,\n"
        f"SecureFiles Team"
    )
    try:
        with transaction.atomic():
            send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email], fail_silently=False)
    except BadHeaderError as bhe:
        raise ValueError("Invalid header found. Email not sent.") from bhe

    except Exception as e:
        raise ValueError("An unexpected error occurred while sending the email.") from e
