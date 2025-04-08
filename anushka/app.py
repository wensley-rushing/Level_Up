
# app.py - Main Flask application file

from flask import Flask, request, jsonify, render_template, send_file
import os
import json
import random
import logging
from datetime import datetime, timedelta
import requests
import io
import base64
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import smtplib
import threading
from PIL import Image
from io import BytesIO
import random
import concurrent.futures
# from serpapi import GoogleSearch
from fpdf import FPDF
import google.generativeai as genai
from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from transformers import pipeline
from textblob import TextBlob
import re
import pickle
from divide import TweetMetricsAnalyzer,EnhancedViralThreadGenerator, TwitterStyleAnalyzer
from flask_cors import CORS
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)
# Load API keys from environment or config
GEMINI_API_KEYS = [
    "AIzaSyBvj4nkbFJzPXdAB3F2qhSOhKKc1UV5px0",
"AIzaSyDAsUWDI4FUdQa8wcHC63e6Xw457BpNNQI",
"AIzaSyBAGXNiT80U2goEq8vSUQ-xPSkxoK7hERw",
"AIzaSyB860pwZ7iFO5WmD33KD836maP3LQ__8jM",
"AIzaSyAjhM79NvsxFgJ5yM4WnVdE9qYXMiFJccE",
"AIzaSyBYF4MuhdKZrOnqN5yiJ21meChjYYp7mIQ",
"AIzaSyAsUBomEdfQIUGELGNsPvs_S7pj-T4GxdI",
"AIzaSyDPJ4P-e-496qCTvqm_Vh420-X7ZWf_OR4",
"AIzaSyD6Wp-B8MTdVPNyk-gAec2NA_CSTCxEu7w",
"AIzaSyBe7d2f_Vub5b2DZsdVPB1OUcVCen3K4_c"
]
COMPOSIO_API_KEY = os.environ.get("COMPOSIO_API_KEY", "YOUR_COMPOSIO_API_KEY")
SERP_API_KEY = os.environ.get("SERP_API_KEY", "db997ee3c393ed490769c69d9e7dfe434efd62c9b2372ad73d470266124f9cbb")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD", "YOUR_EMAIL_PASSWORD")

# Function to get a random API key
def get_random_gemini_key():
    return random.choice(GEMINI_API_KEYS)

# Port original TweetMetricsAnalyzer class


# Port original TwitterStyleAnalyzer class


# Enhanced Viral Thread Generator with parallel processing


# Email thread to user
def send_thread_email(email, thread_data):
    try:
        # Create email message
        msg = MIMEMultipart()
        msg['From'] = 'teamelevv8@gmail.com'
        msg['To'] = email
        msg['Subject'] = f"Your Viral Thread About {thread_data['topic']}"
        
        # HTML email body
        html_body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .tweet {{ border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; border-radius: 8px; }}
                .schedule {{ background-color: #f9f9f9; padding: 10px; border-radius: 5px; }}
                h1, h2, h3 {{ color: #1DA1F2; }}
                .action-plan {{ background-color: #f0f7ff; padding: 15px; border-radius: 8px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Your Viral Thread About {thread_data['topic']}</h1>
                <p>Here's your generated thread ready to post! Generated on {thread_data['generated_date']}</p>
                
                <h2>Tweets</h2>
                """
                
        # Add each tweet
        for i, tweet in enumerate(thread_data['tweets']):
            html_body += f"""
                <div class="tweet">
                    <h3>Tweet {i+1}</h3>
                    <p>{tweet['content']}</p>
                </div>
            """
                
        # Add schedule
        html_body += f"""
                <h2>Posting Schedule</h2>
                <div class="schedule">
                """
                
        for item in thread_data['schedule']:
            html_body += f"""
                    <p>Tweet {item['tweet_number']}: {item['scheduled_time']}</p>
            """
                
        # Add action plan
        html_body += f"""
                </div>
                
                <h2>Action Plan</h2>
                <div class="action-plan">
                    <pre>{thread_data['action_plan']}</pre>
                </div>
                
                <p>Thanks for using Viral Thread Generator!</p>
            </div>
        </body>
        </html>
        """
        
        # Attach HTML body
        msg.attach(MIMEText(html_body, 'html', 'utf-8'))  # Use UTF-8 encoding
        
        # Generate PDF report
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.set_auto_page_break(auto=True, margin=15)  # Enable auto page break
        
        # Add title
        pdf.set_font("Arial", 'B', 16)
        pdf.cell(200, 10, f"Viral Thread About {thread_data['topic']}", ln=True, align='C')
        pdf.ln(10)
        
        # Add tweets
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(200, 10, "Tweet Content", ln=True)
        pdf.ln(5)
        
        pdf.set_font("Arial", size=12)
        for i, tweet in enumerate(thread_data['tweets']):
            pdf.set_font("Arial", 'B', 12)
            pdf.cell(200, 10, f"Tweet {i+1}", ln=True)
            pdf.set_font("Arial", size=12)
            
            # Split long tweets into multiple lines
            content = tweet['content']
            pdf.multi_cell(0, 10, content)
            pdf.ln(5)
        
        # Add schedule
        pdf.add_page()
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(200, 10, "Posting Schedule", ln=True)
        pdf.ln(5)
        
        pdf.set_font("Arial", size=12)
        for item in thread_data['schedule']:
            pdf.cell(200, 10, f"Tweet {item['tweet_number']}: {item['scheduled_time']}", ln=True)
        
        # Add action plan
        pdf.add_page()
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(200, 10, "Action Plan", ln=True)
        pdf.ln(10)
        
        pdf.set_font("Arial", size=12)
        # Split action plan into lines and add to PDF
        for line in thread_data['action_plan'].split('\n'):
            pdf.multi_cell(0, 10, line)
        
        # Save PDF to memory
        pdf_output = BytesIO()
        pdf.output(pdf_output, dest='S')  # Save as string
        pdf_data = pdf_output.getvalue()
        
        # Attach PDF
        pdf_attachment = MIMEApplication(pdf_data, _subtype="pdf")
        pdf_attachment.add_header('Content-Disposition', 'attachment', filename=f"viral_thread_{thread_data['topic'].replace(' ', '_')}.pdf")
        msg.attach(pdf_attachment)
        
        # Send email
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login('teamelevv8@gmail.com', EMAIL_PASSWORD)
            server.send_message(msg)
            
        return True
    
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return False

# Route definitions
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_thread():
    try:
        data = request.json
        topic = data.get('topic')
        thread_count = int(data.get('thread_count', 5))
        email = data.get('email', None)
        
        if not topic:
            return jsonify({'error': 'Topic is required'}), 400
            
        # Generate thread
        generator = EnhancedViralThreadGenerator()
        thread_data = generator.generate_thread(topic, thread_count, email)
        
        # Send email if provided
        
        return jsonify(thread_data)
        
    except Exception as e:
        logger.error(f"Error in generate_thread route: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/analyze', methods=['POST'])
def analyze_tweet():
    try:
        data = request.json
        tweet_text = data.get('tweet')
        
        if not tweet_text:
            return jsonify({'error': 'Tweet text is required'}), 400
            
        analyzer = TweetMetricsAnalyzer()
        style_analyzer = TwitterStyleAnalyzer()
        
        metrics = analyzer.analyze(tweet_text)
        style = style_analyzer.analyze_style(tweet_text)
        
        return jsonify({
            'metrics': metrics,
            'style': style
        })
        
    except Exception as e:
        logger.error(f"Error in analyze_tweet route: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/export_pdf', methods=['POST'])
def export_pdf():
    try:
        data = request.json
        thread_data = data.get('thread_data')
        
        if not thread_data:
            return jsonify({'error': 'Thread data is required'}), 400
            
        # Generate PDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        
        # Add title
        pdf.set_font("Arial", 'B', 16)
        pdf.cell(200, 10, f"Viral Thread About {thread_data['topic']}", ln=True, align='C')
        pdf.ln(10)
        
        # Add tweets
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(200, 10, "Tweet Content", ln=True)
        pdf.ln(5)
        
        pdf.set_font("Arial", size=12)
        for i, tweet in enumerate(thread_data['tweets']):
            pdf.set_font("Arial", 'B', 12)
            pdf.cell(200, 10, f"Tweet {i+1}", ln=True)
            pdf.set_font("Arial", size=12)
            
            # Split long tweets into multiple lines
            content = tweet['content']
            pdf.multi_cell(0, 10, content)
            pdf.ln(5)
        
        # Add schedule
        pdf.add_page()
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(200, 10, "Posting Schedule", ln=True)
        pdf.ln(5)
        
        pdf.set_font("Arial", size=12)
        for item in thread_data['schedule']:
            pdf.cell(200, 10, f"Tweet {item['tweet_number']}: {item['scheduled_time']}", ln=True)
        
        # Add action plan
        pdf.add_page()
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(200, 10, "Action Plan", ln=True)
        pdf.ln(10)
        
        pdf.set_font("Arial", size=12)
        # Split action plan into lines and add to PDF
        for line in thread_data['action_plan'].split('\n'):
            pdf.multi_cell(0, 10, line)
        
        # Save PDF to memory
        pdf_output = BytesIO()
        pdf.output(pdf_output)
        pdf_data = pdf_output.getvalue()
        
        response = send_file(
            BytesIO(pdf_data),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"viral_thread_{thread_data['topic'].replace(' ', '_')}.pdf"
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error in export_pdf route: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/schedule_calendar', methods=['POST'])
def schedule_calendar():
    try:
        data = request.json
        email = data.get('email')
        thread_data = data.get('thread_data')
        
        if not email or not thread_data:
            return jsonify({'error': 'Email and thread data are required'}), 400
            
        if 'composio_gemini' not in globals():
            raise ImportError("composio_gemini module is not installed.")
            
        generator = EnhancedViralThreadGenerator()
        results = generator.schedule_in_calendar(email, thread_data['schedule'], thread_data['topic'])
        
        return jsonify({
            'success': True,
            'results': results
        })
        
    except ImportError as e:
        logger.error(f"Error scheduling in calendar: {str(e)}")
        return jsonify({'error': 'Calendar scheduling is unavailable.'}), 500
    except Exception as e:
        logger.error(f"Error scheduling in calendar: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/save_thread', methods=['POST'])
def save_thread():
    try:
        data = request.json
        thread_data = data.get('thread_data')
        
        if not thread_data:
            return jsonify({'error': 'Thread data is required'}), 400
            
        # Generate a unique ID for this thread
        thread_id = f"{int(time.time())}_{random.randint(1000, 9999)}"
        
        # Save thread data to file
        with open(f"saved_threads/{thread_id}.pkl", 'wb') as f:
            pickle.dump(thread_data, f)
        
        return jsonify({
            'success': True,
            'thread_id': thread_id
        })
        
    except Exception as e:
        logger.error(f"Error in save_thread route: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/load_thread/<thread_id>', methods=['GET'])
def load_thread(thread_id):
    try:
        # Load thread data from file
        with open(f"saved_threads/{thread_id}.pkl", 'rb') as f:
            thread_data = pickle.load(f)
        
        return jsonify(thread_data)
        
    except Exception as e:
        logger.error(f"Error in load_thread route: {str(e)}")
        return jsonify({'error': 'Thread not found'}), 404

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Internal server error'}), 500

# Run the app
if __name__ == '__main__':
    # Create saved_threads directory if it doesn't exist
    os.makedirs('saved_threads', exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5009)))

