from fastapi import FastAPI, HTTPException, Body
import requests
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = FastAPI()

# Load Gemini API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Open Food Facts API URL
OFF_API_URL = "https://world.openfoodfacts.org/api/v0/product/{}.json"

def get_food_data(barcode):
    """Fetch food data from Open Food Facts API"""
    response = requests.get(OFF_API_URL.format(barcode))
    if response.status_code == 200:
        data = response.json()
        if "product" in data:
            return data["product"]
    return None

@app.get("/")
def read_root():
    return {"message": "Welcome to the Gemini AI Chatbot!"}

@app.get("/check-food/{barcode}")
def check_food(barcode: str):
    """Check food item by barcode"""
    food_data = get_food_data(barcode)
    if not food_data:
        raise HTTPException(status_code=404, detail="Food not found")
    return {"product_name": food_data.get("product_name", "Unknown")}

@app.post("/chatbot/") # this is the chatbot Endpoint
def chatbot(user_query: dict = Body(...)):
    """Chatbot endpoint using Gemini AI"""
    try:
        model = genai.GenerativeModel("gemini-pro")  # Use Gemini Pro model
        response = model.generate_content(user_query["user_query"])

        return {"response": response.text.strip()}  # Format response correctly
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
