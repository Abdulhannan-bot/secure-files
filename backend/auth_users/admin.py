from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import User

class UserAdmin(admin.ModelAdmin):
    fieldsets = (
        (_("User Credentials"), {'fields': ('email', 'password')}),

        (_('Personal info'), {
         'fields': ('first_name', 'last_name')}),

        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser')
        }),
        (_('Important dates'), {
            'fields': ('last_login', 'date_joined', 'date_created', 'date_updated')
        }),
    )
    readonly_fields = [
        'password', 'date_created', 'date_updated', 'date_joined', 'last_login', 'otp_expiration_date',
        'otp_code', 'otp_expiration_date'
    ]

    
    list_display = ('email', 'first_name', 'last_name',)
    search_fields = ('email', 'first_name', 'last_name')
  


admin.site.register(User, UserAdmin)
