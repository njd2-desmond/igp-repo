from django.contrib import admin
from .models import Survey
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

# Register your models here.

admin.site.register(Survey)

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    pass

