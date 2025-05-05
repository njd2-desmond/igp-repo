# Code by: Jordan
# This file registers the custom user model with the Django admin panel - and allows us to view and manage users and preferences in the admin dashboard.

from django.contrib import admin
from .models import User
# AFTER DATABASE MIGRATION CHANGE THE ABOVE LINE TO: 
# ``` from .models import CustomUser 
# ADD THE LINE:
# ``` from django.contrib.auth.admin import UserAdmin
from .models import Survey
# ALSO ADD THE LINE:
# ``` from .models import CustomUser or connect them into one - from .models import CustomUser, Survey0

# Register your models here.

admin.site.register(User)
admin.site.register(Survey)

# CHANGE THE ABOVE LINE INC USER TO:
# ``` admin.site.register(CustomUser, userAdmin)