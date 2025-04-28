from django.db import models

# Create your models here.

class User(models.Model):
    user_id = models.AutoField(primary_key = True)
    user_dob = models.DateField()
    user_email = models.EmailField(unique = True)
    user_consent = models.BooleanField()
    user_first_name = models.CharField(max_length=255)
    user_last_name = models.CharField(max_length=255)

    class Meta:
        db_table = 'users'
        managed = False
    
    def __str__(self):
        return f"{self.user_first_name} {self.user_last_name}"

class Survey(models.Model):
    survey_id = models.AutoField(primary_key=True)
    survey_q1 = models.CharField(max_length=255)
    survey_q2 = models.CharField(max_length=255)
    survey_q3 = models.BooleanField
    survey_q4 = models.BooleanField
    survey_q5 = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'survey'
        managed = False

    def __str__(self):
        return f"Survey {self.survey_ID} for {self.user}"
