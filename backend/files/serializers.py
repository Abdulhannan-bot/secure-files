from rest_framework import serializers
from .models import File
from auth_users.models import User
from manage_users.serializers import UserFileSerializer

class FileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)
    salt = serializers.CharField(write_only=True)
    iv = serializers.CharField(write_only=True)
    key = serializers.CharField(write_only=True)
    extension = serializers.CharField(write_only=True)
    class Meta:
        model = File
        fields = ['id','name', 'file', 'key', 'iv', 'user', 'salt', 'extension']
        
class AdminFileSerializer(serializers.ModelSerializer):
    user = UserFileSerializer()
    salt = serializers.CharField(write_only=True)
    iv = serializers.CharField(write_only=True)
    key = serializers.CharField(write_only=True)
    extension = serializers.CharField(write_only=True)
    class Meta:
        model = File
        fields = ['id','name', 'file', 'key', 'iv', 'user', 'salt', 'extension']