from django.db import models

# Alice comment: Added the line below importing AbstractUser which gives us username, password, and email (and also autocreates an id which acts as the primary key)
from django.contrib.auth.models import AbstractUser

# Code by: Jordan and Alice
# The below implements a CustomUser model (with age and dietary preferences) and includes a DietaryPreference model

# Create your models here.


## <Alice comment and changes>
## Previously, class User(models.Model): was used; but since this is a regular Django model, it's not tied to Django's authentication system, which means it can't be used for login
## or signup - which was causing errors when trying to integrate the below with the login/signup process + frontend
## Update 3/5/25: AbstractUser enables us to use Django's built in logic for password hashing (includes hashed password storage using secure algorithms (PBKDF2 by default straight out of the box),
## session management, signup, login, logout, password reset - and Users automatically appear in the Django admin

# OLD CODE:
'''class User(models.Model):
    user_id = models.AutoField(primary_key = True)
    user_dob = models.DateField()
    user_email = models.EmailField(unique = True)
    user_consent = models.BooleanField()
    user_user_name = models.CharField(255)

    class Meta:
        db_table = 'users'
        managed = False
    
    def __str__(self):
        return f"{self.user_user_name}"
'''


# NEW CODE: NOTE no username, email, id. When you inherit from Django's AbstractUser or any models.Model, it auto-creates an id field for you which acts as the primary key
## NOTE 2 3/5/2025: Django's AbstractUser also automatically creates first_name and last_name, but, they are not required fields, and as long as we don't add them in the front end sign up - Django will leave them
## blank and we can still keep our data collection promises on first name and last name
class CustomUser(AbstractUser):
    user_dob = models.DateField(null=True, blank=True)
    user_consent = models.BooleanField(default=False)
# username, email, id already included in AbstractUser
    class Meta:
        db_table = 'users'
        managed = True # we now want Django to create / manage the DB

## </Alice comment and changes>


## <Alice comment and changes 3/5/25:>
## See DATABASE_MIGRATION_README for reasoning behind the changes here
## Survey class must be edited to point to the AUTH_USER_MODEL user by django's built in auth setup
## CHANGE AFTER DATABASE MIGRATION:
## { from django.conf import settings
##   class Survey(models.Model):
##   ...
##   user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) --> This adds a foreign key field to our survey model so Django knows each survey belongs to a user
## without the above we wouldn't be able to do for example survey.user.username - and - it also ensures database integrity - if a user is deleted, their surveys also will be deleted
## notes: conf stands for configuration. AUTH_USER_MODEL is from Django settings module

class Survey(models.Model):
    survey_id = models.AutoField(primary_key=True)
    survey_q1 = models.CharField(
        max_length = 50,
        choices = [
            ('Multiple times a day', 'Multiple times a day'),
            ('Once a day', 'Once a day'),
            ('A few times a week', 'A few times a week'),
            ('Rarely', 'Rarely'),
            ('Do Not Know', 'Do Not Know')
        ],
    )
    survey_q2 = models.CharField(
        max_length = 80,
        choices = [
            ('I struggle to identify UPFs in foods', 'I struggle to identify UPFs in foods'),
            ('I don\'t have time to cook from scratch', 'I don\'t have time to cook from scratch'),
            ('Healthy food is too expensive', 'Healthy food is too expensive'),
            ('I crave processed food too much', 'I crave processed food too much'),
            ('I don\'t know where to start', 'I don\'t know where to start')
        ]
    )
    survey_q3 = models.BooleanField()
    survey_q4 = models.BooleanField()
    survey_q5 = models.CharField(
        max_length = 80,
        choices = [
            ('Reduce my ultra-processed food intake', 'Reduce my ultra-processed food intake'),
            ('Learn more about ultra-processed food', 'Learn more about ultra-processed food'),
            ('Eat more whole, minimally processed foods', 'Eat more whole, minimally processed foods'),
            ('Improve my overall nutrition and health', 'Improve my overall nutrition and health'),
            ('Track how much ultra-processed food I consume', 'Track how much ultra-processed food I consume'),
            ('Understand food labels and processing levels better', 'Understand food labels and processing levels better'),
            ('Discover hidden ultra processed ingredients in my diet', 'Discover hidden ultra processed ingredients in my diet'),
            ('Find healthier alternatives to my favourite processed foods', 'Find healthier alternatives to my favourite processed foods'),
            ('Get personalised food recommendations based on my diet', 'Get personalised food recommendations based on my diet')
        ]
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'survey'
        managed = False

    def __str__(self):
        return f"Survey {self.survey_id} for {self.user}"