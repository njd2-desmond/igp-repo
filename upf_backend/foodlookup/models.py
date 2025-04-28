from django.db import models
from users.models import User

# Create your models here.

class Scan(models.Model):
    scan_id = models.AutoField(primary_key=True)
    scan_date = models.DateTimeField()
    scan_product_name = models.CharField(max_length=255)
    scan_nova_score = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'scan'
        managed = False

    def __str__(self):
        return f"Scan {self.scan_ID}: {self.scan_product_name} by {self.user}"
