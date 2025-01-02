from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .serializers import FileSerializer, AdminFileSerializer
from django.http import FileResponse, HttpResponse
from django.core.files.base import ContentFile
from .models import File
from django.conf import settings
from django.utils.timezone import now
from datetime import timedelta
from .utils import  aes_decrypt, aes_encrypt
import base64
import os
import hashlib
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Util.Padding import unpad
from base64 import b64decode, b64encode

FILE_ENCRYPTION_KEY = settings.FILE_ENCRYPTION_KEY

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_files(request):
    user = request.user
    user_files = File.objects.filter(user=user)
    
    serializer = FileSerializer(user_files, many=True)
   
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_all_files(request):
    all_files = File.objects.all()
    serializer = AdminFileSerializer(all_files, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):
    try:
        encrypted_file = request.FILES['file']
        salt = request.POST['salt']
        iv = request.POST['iv']
        name = request.POST['name']
        extension = request.POST['extension']

        print(request.user)

        file_instance = File.objects.create(
            file = encrypted_file,
            salt = salt,
            iv = iv,
            name = name,
            extension = extension,
            user = request.user
        )

        return Response({'success': True, 'msg': 'File uploaded successfully'}, status=status.HTTP_200_OK)
    except ValueError as e:
        print(e)
        return Response({'error': str(e)}, status=400)
    except Exception as e:
        print(e)
        return Response({'error': 'An unexpected error occurred'}, status=500)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_file_details(request, file_id):
    try:
        file_obj = File.objects.get(id=file_id)

        if file_obj.user.id != request.user.id and not request.user.is_staff:
            return Response({
                "success": False,
                "error": "You are not authorized to view this file"
            }, status=status.HTTP_403_FORBIDDEN)
        print("entered")
        
        salt = b64decode(file_obj.salt)
        iv = b64decode(file_obj.iv)

        PASSWORD = FILE_ENCRYPTION_KEY
        # print(PASSWORD, FILE_ENCRYPTION_KEY)
        password = PASSWORD.encode()
        key = hashlib.pbkdf2_hmac('sha256', password, salt, 1000, dklen=32)

        encrypted_content = b64decode(file_obj.file.read())

        cipher = AES.new(key, AES.MODE_CBC, iv)
        decrypted_data = unpad(cipher.decrypt(encrypted_content), AES.block_size)

        temp_file = ContentFile(decrypted_data)

        base64_file_content = b64encode(temp_file.read()).decode('utf-8')

        # print(base64_file_content)


        return Response({
            'success': True,
            'data': {
                'file_content': base64_file_content,
                'file_extension': file_obj.extension,
            }
            
        }, status=status.HTTP_200_OK)

            
    except File.DoesNotExist:
     
        return Response({
            'success': False, 
            'error': 'File not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response({
            'success': False,
            'error': f'Error processing file: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_file(request, file_id):
    try:
        file_instance = File.objects.get(id=file_id)
        if file_instance.user != request.user and not request.user.is_staff:
            return Response(
                {'error': 'Not authorized to download this file'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        encrypted_content = b64decode(file_instance.file.read())
        iv = b64decode(file_instance.iv)
        salt = b64decode(file_instance.salt)

        PASSWORD = FILE_ENCRYPTION_KEY
        # print(PASSWORD, FILE_ENCRYPTION_KEY)
        password = PASSWORD.encode()
        key = hashlib.pbkdf2_hmac('sha256', password, salt, 1000, dklen=32)

        cipher = AES.new(key, AES.MODE_CBC, iv)
        decrypted_data = unpad(cipher.decrypt(encrypted_content), AES.block_size)

        temp_file = ContentFile(decrypted_data)

        temp_file.seek(0)

        file_extension = file_instance.extension  # Assume this stores something like '.txt', '.pdf', etc.
        file_name_with_extension = f"{file_instance.name}.{file_extension}"

        # Use Django's FileResponse to serve the file for download
        response = FileResponse(temp_file, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file_name_with_extension}"'

        print(response['Content-Disposition'])



        return response
        
        
    except File.DoesNotExist:
        return Response(
            {'error': 'File not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(e)
        return Response(
            {'error': f'Download failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )