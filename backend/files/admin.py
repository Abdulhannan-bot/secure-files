from django.contrib import admin
from .models import File

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'name', 'created_at')
    search_fields = ('user__username', 'filename')
    list_filter = ('created_at',)
    readonly_fields = ('iv', 'key', 'created_at')
