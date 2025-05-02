from django.db import models


# Create your models here.

class User(models.Model):
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
