from django.shortcuts import render

# Create your views here.

import requests
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def get_product(request, barcode):
    """
    Fetches product data from Open Food Facts API based on the barcode.
    """
    url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
    print(f" Fetching data from: {url}")  # Debugging
    response = requests.get(url)
    print(f" API Response Code: {response.status_code}")  # Debugging

    if response.status_code == 200:
        data = response.json()
        if 'product' in data:
            print(" Product found!")  # Debugging
            product = data['product']
            return Response({
                "name": product.get("product_name", "Unknown"),
                "brands": product.get("brands", "Unknown"),
                "ingredients": product.get("ingredients_text", "Not available"),
                "nutrition_grade": product.get("nutrition_grades", "Not available")
            })
        else:
            print(" Product not found in Open Food Facts.")  # Debugging
            return Response({"error": "Product not found"}, status=404)
    else:
        print(f" API request failed with status {response.status_code}")  # Debugging
        return Response({"error": "API request failed"}, status=response.status_code)
