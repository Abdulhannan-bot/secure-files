from django.urls import path
from . import views

urlpatterns = [
    path('files/list/', views.list_files, name='list_files'),
    path('files/upload/', views.upload_file, name='upload_file'),
    path('files/download/<int:file_id>/', views.download_file, name='download_file'),
    path('files/details/<int:file_id>/', views.get_file_details, name='get_file_details'),
    # path('files/generate-link/<int:file_id>/', views.generate_shareable_link, name='generate_shareable_link'),
    # path('files/validate-link/<int:file_id>/<str:token>/', views.validate_link, name='validate_link'),
]
