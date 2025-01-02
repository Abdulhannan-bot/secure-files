from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.manage_users, name='manage_users'),
    path('users/<int:user_id>/', views.update_user, name='update_user'),
    path('users/delete/<int:user_id>/', views.delete_user, name='delete_user'),
]
