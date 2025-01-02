from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .serializers import FileSerializer
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
PASSWORD = "W8!tHz#5k2@3BxYq^1Fg%Lr&9Mn@ZkJ"

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_files(request):
    user = request.user
    user_files = File.objects.filter(user=user)
    
    serializer = FileSerializer(user_files, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def list_all_files(request):
    all_files = File.objects.all()
    serializer = FileSerializer(all_files, many=True)
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
        file_obj = File.objects.get(id=file_id, user=request.user)

        if file_obj.user.id != request.user.id:
            return Response({
                "success": False,
                "error": "You are not authorized to view this file"
            }, status=status.HTTP_403_FORBIDDEN)
        
        salt = b64decode(file_obj.salt)
        iv = b64decode(file_obj.iv)


        password = 'W8!tHz#5k2@3BxYq^1Fg%Lr&9Mn@ZkJ'.encode()
        key = hashlib.pbkdf2_hmac('sha256', password, salt, 1000, dklen=32)

        encrypted_content = b64decode(file_obj.file.read())




        cipher = AES.new(key, AES.MODE_CBC, iv)
        decrypted_data = unpad(cipher.decrypt(encrypted_content), AES.block_size)

        temp_file = ContentFile(decrypted_data)

        # a = temp_file.read()
        # print(a)
        base64_file_content = b64encode(temp_file.read()).decode('utf-8')

        # response = HttpResponse(temp_file, content_type='application/octet-stream')

        # # Set the filename for download
        # response['Content-Disposition'] = f'attachment; filename="{file_obj.name}.{file_obj.extension}"'

        # return response



        # output_path = os.path.join('media/uploads', f'{file_obj.name}.{file_obj.extension}')

        # # Save the decrypted file
        # with open(output_path, 'wb') as f:
        #     f.write(decrypted_data)


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
       
        return Response({
            'success': False,
            'error': f'Error processing file: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def download_file(request, file_id):
#     """File download and decryption."""
#     try:
#         file_instance = File.objects.get(id=file_id)
#     except File.DoesNotExist:
#         return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)
    
#     # Decrypt the file content
#     decrypted_data = decrypt(file_instance.file.path, settings.FILE_ENCRYPTION_KEY)
    
#     # Return the decrypted file as a response
#     response = FileResponse(decrypted_data, content_type='application/octet-stream')
#     response['Content-Disposition'] = f'attachment; filename="{file_instance.name}"'
#     return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_file(request, file_id):
    try:
        file_instance = File.objects.get(id=file_id)
        if file_instance.user != request.user:
            return Response(
                {'error': 'Not authorized to download this file'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        encrypted_content = file_instance.file
        
        try:
            server_decrypted_data = decrypt(encrypted_content, settings.FILE_ENCRYPTION_KEY)
        except Exception as e:
            return Response(
                {'error': f'Decryption failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        response = HttpResponse(server_decrypted_data, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file_instance.name}"'
        
        response['X-Encryption-IV'] = file_instance.iv
        response['X-Encryption-Key'] = file_instance.key
        
        return response
        
    except File.DoesNotExist:
        return Response(
            {'error': 'File not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Download failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )