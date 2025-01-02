from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('token/refresh/', views.refresh_token_view, name ='token_refresh'),

    path('verify-user/', views.verify_view, name="verify"),

    path('send-otp/', views.send_otp_view, name='send_otp'),
    path('verify-otp/', views.verify_otp_view, name='verify_otp'),
    
    path('set-password/', views.set_password, name='set_password'),
    path('reset-password/', views.reset_password, name='reset_password'),
]
