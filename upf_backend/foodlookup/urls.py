from django.urls import path
from .views import get_product

urlpatterns = [
    path('product/<str:barcode>/', get_product, name='get_product'),
]
