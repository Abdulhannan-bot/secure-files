from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend
from secure_files.settings import SUPER_ADMIN

class EmailBackend(BaseBackend):
    def authenticate(self, request, username=None, email=None, password=None, **kwargs):
        if not email:
            if username == SUPER_ADMIN:
                email = username
            else:
                return None 

        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return None
        
        if user.check_password(password):
            return user
        return None

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None
