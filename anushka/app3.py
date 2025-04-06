from flask import Flask, request, jsonify
import os
import io
import base64
import requests
import google.generativeai as genai
from PIL import Image, ImageDraw, ImageFont
from flask_cors import CORS
import time
import random
from io import BytesIO
import logging
from collections import deque

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# List of API keys with proper key rotation
GEMINI_API_KEYS = [
    "AIzaSyBMmXJ8_jnJPsb1WgMlJfFV9oaRZw2FdGs",
    "AIzaSyDCOMT67gpQX8IEcZLiyMgYoRtOVMH-OeU",
    "AIzaSyAJJlzXtLEfBEJlMbbSIdprGgfC9BitAO0",
    "AIzaSyDq0tPrzc2Oz3tOapSKgB97jYwv1Pukh0g",
    "AIzaSyDt8PGen4JCppCJH3y1GiXgpcZxTxI-ejI",
    "AIzaSyAVL6k_vJ22cNYVyfEQTJTv1yHhaGECm5c",
    "AIzaSyDuf0EwO-bLu2retfUX0iMIqxzIjT13ZRg",
    "AIzaSyA7rqT-L4hUOirsV-ckYQg1sNQVwSD53bQ",
    "AIzaSyAKQxo1Q2VOtNVjNJSeMMUx4YRSxOrwWAA"
]

# Add default key to the list if not already present
DEFAULT_KEY = 'AIzaSyD2K_Sov5VICPxPzpA6TBtpet8vcZWlC7c'
if DEFAULT_KEY not in GEMINI_API_KEYS:
    GEMINI_API_KEYS.append(DEFAULT_KEY)

# Create a deque for efficient key rotation
api_key_queue = deque(GEMINI_API_KEYS)

# Track temporarily disabled keys with their cooldown time
disabled_keys = {}
KEY_COOLDOWN_SECONDS = 60  # Wait 60 seconds before retrying a rate-limited key

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def get_random_gemini_key():
    """Get the next available API key with proper rotation and cooldown handling"""
    current_time = time.time()
    
    # Re-enable any keys that have completed their cooldown
    keys_to_reenable = []
    for key, disable_until in list(disabled_keys.items()):
        if current_time > disable_until:
            keys_to_reenable.append(key)
    
    for key in keys_to_reenable:
        api_key_queue.append(key)
        del disabled_keys[key]
        logger.info(f"Re-enabled API key after cooldown period")
    
    # If all keys are disabled, wait for the first one to become available again
    if len(api_key_queue) == 0:
        min_wait_time = min(disabled_keys.values()) - current_time
        if min_wait_time > 0:
            logger.warning(f"All API keys are rate-limited. Waiting {min_wait_time:.2f} seconds...")
            time.sleep(min_wait_time + 0.5)  # Add a small buffer
        
        # Recursively call to get a re-enabled key
        return get_random_gemini_key()
    
    # Get next key in rotation
    key = api_key_queue.popleft()
    # Put it at the end for next time (we'll remove it if it fails)
    api_key_queue.append(key)
    return key

def disable_key(key):
    """Temporarily disable a key that hit rate limits"""
    if key in api_key_queue:
        api_key_queue.remove(key)
    disabled_keys[key] = time.time() + KEY_COOLDOWN_SECONDS
    logger.warning(f"Disabled API key for {KEY_COOLDOWN_SECONDS} seconds due to overload")

def generate_fallback_image(text):
    """Generate a simple image with text when the API is unavailable"""
    # Create a blank image with text
    img = Image.new('RGB', (512, 512), color=(240, 240, 240))
    d = ImageDraw.Draw(img)
    
    # Add the text to the image
    d.text((100, 200), f"Image for: {text}", fill=(0, 0, 0))
    d.text((100, 240), "API currently unavailable", fill=(255, 0, 0))
    
    # Convert to base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
    
    return img_str

def generate_image(prompt, max_retries=5, initial_backoff=1):
    """Generate an image using Gemini with improved error handling and key rotation"""
    used_keys = set()  # Track keys already used in this function call
    
    for attempt in range(max_retries):
        try:
            # Get available keys that haven't been used in this function call yet
            available_keys = [k for k in list(api_key_queue) if k not in used_keys and k not in disabled_keys]
            
            if available_keys:
                # Select a random key from available keys
                api_key = random.choice(available_keys)
            else:
                # If all keys have been tried or are disabled, fall back to rotation logic
                api_key = get_random_gemini_key()
            
            used_keys.add(api_key)  # Mark this key as used for this function call
            logger.info(f"Attempting image generation (attempt {attempt+1}/{max_retries})")
            
            from google import genai
            from google.genai import types
            
            # Reconfigure client with the current API key
            client = genai.Client(api_key=api_key)
            
            # Generate content using the correct method and configuration
            response = client.models.generate_content(
                model="gemini-2.0-flash-exp-image-generation",
                contents=[prompt],
                config=types.GenerateContentConfig(
                    response_modalities=['Text', 'Image']
                )
            )
            
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'inline_data') and part.inline_data is not None:
                    image_data = part.inline_data.data
                    image = Image.open(BytesIO(image_data))
                    
                    # Save to BytesIO and convert to base64
                    buffered = BytesIO()
                    image.save(buffered, format="PNG")
                    img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
                    logger.info("Successfully generated image")
                    return img_str
            
            logger.warning("No image data found in response")
            
        except Exception as e:
            error_message = str(e)
            logger.error(f"Error generating image: {error_message}")
            
            # Check for rate limiting or overload errors
            if "503" in error_message and "overloaded" in error_message.lower():
                # This key is hitting rate limits, disable it temporarily
                disable_key(api_key)
            
            # Calculate backoff time for next attempt
            wait_time = initial_backoff * (2 ** attempt) + random.uniform(0, 1)
            
            # If it's the last attempt, don't wait
            if attempt < max_retries - 1:
                logger.info(f"Retrying image generation in {wait_time:.2f} seconds...")
                time.sleep(wait_time)
    
    # Return fallback image if all retries failed
    logger.warning("All attempts failed, returning fallback image")
    return generate_fallback_image(prompt)

def generate_tweet(text, max_retries=3):
    """Generate a professional tweet with hashtags and emojis using Gemini"""
    for attempt in range(max_retries):
        try:
            api_key = get_random_gemini_key()
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-pro')
            
            prompt = f"""
            Create a professional caption for instagram post about the following text. Include relevant hashtags and emojis:
            
            {text}
            
            The caption should be engaging, professional, and no more than 280 characters.
            """
            
            response = model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            error_message = str(e)
            logger.error(f"Error generating tweet: {error_message}")
            
            # Check for rate limiting or overload errors
            if "503" in error_message and "overloaded" in error_message.lower():
                # This key is hitting rate limits, disable it temporarily
                disable_key(api_key)
            
            # If it's not the last attempt, retry
            if attempt < max_retries - 1:
                wait_time = 1 * (2 ** attempt) + random.uniform(0, 1)
                logger.info(f"Retrying tweet generation in {wait_time:.2f} seconds...")
                time.sleep(wait_time)
    
    # If all attempts fail, return a simple message
    return f"Check out our latest update on {text}! #trending"

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    text = data['text']
    
    try:
        # Generate image using Gemini
        image = generate_image(text)
        
        # Generate tweet
        tweet = generate_tweet(text)
        
        return jsonify({
            'image1': image,
            'tweet': tweet
        })
    except Exception as e:
        logger.exception("Error in generate endpoint")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info(f"Starting Flask app with {len(GEMINI_API_KEYS)} Gemini API keys")
    app.run(host='0.0.0.0', port=5005, debug=True)