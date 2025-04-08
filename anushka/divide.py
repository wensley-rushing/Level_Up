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
from google.genai import types
from composio_gemini import Action, ComposioToolSet, App  

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from email.header import Header
from email.utils import encode_rfc2231
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


class TweetMetricsAnalyzer:
    def __init__(self):
        try:
            self.sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
        except Exception as e:
            logger.error(f"Error loading sentiment model: {str(e)}")
            self.sentiment_analyzer = None

    def count_emojis(self, text: str) -> int:
        emoji_pattern = re.compile("["
            u"\U0001F600-\U0001F64F"  # emoticons
            u"\U0001F300-\U0001F5FF"  # symbols & pictographs
            u"\U0001F680-\U0001F6FF"  # transport & map symbols
            u"\U0001F1E0-\U0001F1FF"  # flags
            u"\U00002702-\U000027B0"
            u"\U000024C2-\U0001F251"
            "]+", flags=re.UNICODE)
        return len(emoji_pattern.findall(text))

    def analyze(self, text: str) -> dict:
        if self.sentiment_analyzer:
            sentiment_result = self.sentiment_analyzer(text)[0]
            sentiment_label = sentiment_result["label"]
            confidence = sentiment_result["score"]
        else:
            # Fallback if model fails to load
            sentiment_label = "UNKNOWN"
            confidence = 0.5
            
        try:
            blob = TextBlob(text)
            subjectivity = blob.sentiment.subjectivity
            polarity = blob.sentiment.polarity
        except:
            subjectivity = 0.5
            polarity = 0
            
        return {
            "sentiment": sentiment_label,
            "confidence": confidence,
            "subjectivity": subjectivity,
            "polarity": polarity,
            "emoji_count": self.count_emojis(text),
            "character_count": len(text),
            "word_count": len(text.split())
        }
    

class TwitterStyleAnalyzer:
    def __init__(self):
        self.style_indicators = {
            "emotional_triggers": ["wild", "insane", "crying", "screaming", "based", "real", "unhinged", "no way", "literally dead"],
            "engagement_words": ["ratio", "hot take", "thread", "debate me", "fight me", "thoughts?", "disagree?"],
            "power_words": ["actually", "literally", "objectively", "factually", "historically", "technically"],
            "meme_phrases": ["ngl", "fr fr", "iykyk", "lowkey", "highkey", "based", "chad", "W", "L", "no cap", "bussin"],
            "sass_words": ["bestie", "literally", "imagine", "apparently", "supposedly", "girlie", "bestie"],
            "dark_humor": ["oof", "rip", "dead", "crying", "screaming", "help"],
            "internet_slang": ["tbh", "imo", "idk", "nvm", "dm", "rt", "fyi", "aka"],
            "viral_formats": ["POV:", "NOT THE", "it's giving", "the way that", "y'all"],
            "argument_starters": ["respectfully", "with peace and love", "no offense but", "hot take"],
            "current_year_slang": ["slay", "periodt", "ate", "understood the assignment", "main character"],
            "transitions": ["meanwhile", "however", "but wait", "plot twist", "on the flip side", "here's the tea"],
            "perspective_markers": ["unpopular opinion", "hot take", "controversial but", "hear me out", "plot twist"]
        }

        self.time_periods = {
            "morning": (5, 11),
            "afternoon": (12, 16),
            "evening": (17, 20),
            "night": (21, 4)
        }

    def get_optimal_posting_time(self) -> str:
        current_hour = datetime.now().hour
        for period, (start, end) in self.time_periods.items():
            if start <= current_hour <= end:
                return period
        return "night"

    def analyze_style(self, text: str) -> dict:
        metrics = {
            "sass_level": 0,
            "meme_density": 0,
            "engagement_potential": 0,
            "dark_humor_score": 0,
            "slang_usage": 0,
            "argument_strength": 0,
            "viral_format_count": 0,
            "contemporary_score": 0,
            "perspective_balance": 0
        }

        text_lower = text.lower()

        # Calculate comprehensive style metrics
        sass_count = sum(word in text_lower for word in self.style_indicators["sass_words"])
        meme_count = sum(phrase in text_lower for phrase in self.style_indicators["meme_phrases"])
        engagement_count = sum(word in text_lower for word in self.style_indicators["engagement_words"])
        dark_humor_count = sum(word in text_lower for word in self.style_indicators["dark_humor"])
        slang_count = sum(word in text_lower for word in self.style_indicators["internet_slang"])
        argument_count = sum(phrase in text_lower for phrase in self.style_indicators["argument_starters"])
        viral_format_count = sum(format in text_lower for format in self.style_indicators["viral_formats"])
        contemporary_count = sum(slang in text_lower for slang in self.style_indicators["current_year_slang"])
        perspective_count = sum(marker in text_lower for marker in self.style_indicators["perspective_markers"])

        # Calculate normalized scores (0-100)
        word_count = len(text_lower.split())
        metrics["sass_level"] = min((sass_count / max(word_count, 1)) * 200, 100)
        metrics["meme_density"] = min((meme_count / max(word_count, 1)) * 200, 100)
        metrics["engagement_potential"] = min((engagement_count / max(word_count, 1)) * 200, 100)
        metrics["dark_humor_score"] = min((dark_humor_count / max(word_count, 1)) * 200, 100)
        metrics["slang_usage"] = min((slang_count / max(word_count, 1)) * 200, 100)
        metrics["argument_strength"] = min((argument_count / max(word_count, 1)) * 200, 100)
        metrics["viral_format_count"] = viral_format_count
        metrics["contemporary_score"] = min((contemporary_count / max(word_count, 1)) * 200, 100)
        metrics["perspective_balance"] = min((perspective_count / max(word_count, 1)) * 200, 100)

        # Calculate overall metrics
        metrics["clout_factor"] = min(
            (metrics["sass_level"] + metrics["meme_density"] + metrics["engagement_potential"]) / 3,
            100
        )

        metrics["twitter_native_score"] = min(
            (metrics["slang_usage"] + metrics["contemporary_score"] + metrics["viral_format_count"] * 20) / 3,
            100
        )

        metrics["ratio_potential"] = min(
            (metrics["argument_strength"] + metrics["dark_humor_score"] + metrics["sass_level"]) / 3,
            100
        )

        # Generate style tags
        metrics["style_tags"] = []
        if metrics["sass_level"] > 70: metrics["style_tags"].append("extra_sassy")
        if metrics["meme_density"] > 70: metrics["style_tags"].append("meme_lord")
        if metrics["dark_humor_score"] > 70: metrics["style_tags"].append("edgy")
        if metrics["engagement_potential"] > 70: metrics["style_tags"].append("engagement_bait")
        if metrics["contemporary_score"] > 70: metrics["style_tags"].append("extremely_online")
        if metrics["perspective_balance"] > 70: metrics["style_tags"].append("balanced_take")

        return metrics
    
class EnhancedViralThreadGenerator:
    def __init__(self):
        self.tweet_metrics = TweetMetricsAnalyzer()
        self.style_analyzer = TwitterStyleAnalyzer()
        self.setup_prompts()
        self.api_key_index = 0
        
    def get_next_api_key(self):
        """Get the next API key using round-robin"""
        key = GEMINI_API_KEYS[self.api_key_index]
        self.api_key_index = (self.api_key_index + 1) % len(GEMINI_API_KEYS)
        return key
        
    def get_llm(self):
        """Get a Gemini LLM instance with a fresh API key"""
        api_key = get_random_gemini_key()
        try:
            genai.configure(api_key=api_key)
            return GoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=api_key)
        except Exception as e:
            logger.error(f"Error initializing LLM with key {api_key}: {str(e)}")
            # Try with another key if this one fails
            api_key = self.get_next_api_key()
            genai.configure(api_key=api_key)
            return GoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=api_key)

    def setup_prompts(self):
        self.hook_template = PromptTemplate(
            input_variables=["topic", "current_date"],
            template="""
            Create an attention-grabbing first tweet about {topic}.
            Make it controversial but not extreme, setting up for both supporting and opposing views.
            Use peak Twitter language, max sass, and current slang. Include relevant emojis.
            Make it provocative, spicy, and memorable. Under 280 characters.
            Mix memes, dark humor, and actual insights.
            Use current Twitter formats like "POV:", "NOT THE", "it's giving".
            Make it feel extremely online while still being smart.
            Today's date is {current_date}, so make it timely and relevant.
            """
        )

        self.thread_template = PromptTemplate(
            input_variables=["topic", "hook", "perspective", "current_date"],
            template="""
            Generate 2 {perspective} tweets continuing from this hook about {topic}:
            "{hook}"

            Make the thread:
            1. Peak Twitter energy (bestie, periodt, slay, etc.)
            2. Include spicy takes and well-reasoned arguments
            3. Mix humor with insights
            4. Use current meme formats and callbacks
            5. Add thought-provoking points
            6. Keep building momentum
            7. Each tweet under 280 characters
            8. Heavy emoji and slang usage
            9. Reference current events where relevant (today is {current_date})

            Maintain the {perspective} perspective while acknowledging potential counterpoints.
            Make it feel authentic and viral-worthy.
            Format as a list of 2 tweets, separated by newlines.
            """
        )

        self.counterpoint_template = PromptTemplate(
            input_variables=["topic", "previous_tweet", "current_date"],
            template="""
            Create a spicy counterpoint tweet to this take about {topic}:
            "{previous_tweet}"

            Make it:
            1. Challenge the previous point while staying respectful
            2. Use Twitter language and current slang
            3. Include emojis and meme formats
            4. Keep it under 280 characters
            5. Make it quotable and engaging
            6. Reference current events or trends if relevant (today is {current_date})
            """
        )

        self.finale_template = PromptTemplate(
            input_variables=["topic", "current_date"],
            template="""
            Create a balanced concluding tweet about {topic}.
            Acknowledge multiple perspectives while adding your own spicy take.
            Make it memorable and quotable.
            Use peak Twitter energy and current slang.
            Include relevant emojis.
            Under 280 characters.
            End with a call for engagement.
            Reference that today is {current_date} if relevant.
            """
        )
        
        self.image_prompt_template = PromptTemplate(
            input_variables=["tweet_content"],
            template="""
            Create an engaging and highly shareable social media image prompt based on this tweet:
            "{tweet_content}"
            
            Make the image description:
            1. Visually striking and attention-grabbing
            2. Capture the essence of the tweet's message
            3. Include relevant elements that would make it viral-worthy
            4. Work well as a Twitter/X image
            5. Be provocative but not offensive
            
            Write a detailed image generation prompt only, no explanations.
            """
        )

    def create_chain(self, prompt_template):
        """Create a chain with a fresh LLM instance"""
        return LLMChain(llm=self.get_llm(), prompt=prompt_template)

    def optimize_tweet(self, tweet):
        """Optimize a tweet for virality"""
        style_metrics = self.style_analyzer.analyze_style(tweet)

        if style_metrics["twitter_native_score"] < 70:
            try:
                enhance_prompt = PromptTemplate(
                    input_variables=["tweet"],
                    template="""
                    Make this tweet absolutely unhinged (in a good way).
                    Max out the sass, add current memes, and make it extremely online.
                    Keep the core message but make it Twitter native af:
                    {tweet}
                    """
                )

                enhance_chain = self.create_chain(enhance_prompt)
                enhanced_tweet = enhance_chain.run(tweet=tweet)

                new_style_metrics = self.style_analyzer.analyze_style(enhanced_tweet)
                if new_style_metrics["twitter_native_score"] > style_metrics["twitter_native_score"]:
                    return enhanced_tweet
            except Exception as e:
                logger.warning(f"Error optimizing tweet: {str(e)}")
                
        return tweet

    def generate_image_prompt(self, tweet_content):
        """Generate an image prompt based on tweet content"""
        try:
            image_prompt_chain = self.create_chain(self.image_prompt_template)
            image_prompt = image_prompt_chain.run(tweet_content=tweet_content)
            return image_prompt.strip()
        except Exception as e:
            logger.error(f"Error generating image prompt: {str(e)}")
            return f"Social media image about {tweet_content[:50]}..."

    def generate_image(self, prompt):
        """Generate an image using Gemini"""
        try:
            api_key = get_random_gemini_key()
            from google import genai
            from google.genai import types
            
            client = genai.Client(api_key=api_key)
            
            # Generate content using the correct method and configuration
            response = client.models.generate_content(
                model="gemini-2.0-flash-exp-image-generation",
                contents=[prompt],
                config=types.GenerateContentConfig(
                    response_modalities=['Text', 'Image']
                )
            )
            print("hoo")
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'inline_data') and part.inline_data is not None:
                    image_data = part.inline_data.data
                    image = Image.open(BytesIO(image_data))
                    
                    # Save to BytesIO and convert to base64
                    buffered = BytesIO()
                    image.save(buffered, format="PNG")
                    img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
                    return img_str
            
            logger.warning("No image data found in response")
            return None
        
        except Exception as e:
            logger.error(f"Error generating image: {str(e)}")
            return None

    def get_current_date(self):
        return datetime.now().strftime("%B %d, %Y")

    def generate_posting_schedule(self, thread_length):
        """Generate an optimal posting schedule based on thread length"""
        current_dt = datetime.now()
        
        # Determine optimal day of week (generally weekdays evenings and weekends)
        today = current_dt.weekday()  # 0-6, Monday is 0
        
        # If today is Friday, Saturday or Sunday, start today
        if today >= 4:  # Friday, Saturday, Sunday
            start_date = current_dt
        else:
            # Otherwise start next Friday
            days_until_friday = 4 - today
            if days_until_friday <= 0:
                days_until_friday += 7
            start_date = current_dt + timedelta(days=days_until_friday)
        
        # Create schedule for each tweet
        schedule = []
        tweet_date = start_date
        
        for i in range(thread_length):
            # Determine optimal time based on day
            if tweet_date.weekday() < 5:  # Weekday
                hour = 18  # 6 PM
                minute = random.randint(0, 59)
            else:  # Weekend
                hour = 12 + random.randint(0, 8)  # Between 12 PM and 8 PM
                minute = random.randint(0, 59)
                
            # Create a datetime for this tweet
            tweet_datetime = datetime(
                tweet_date.year, tweet_date.month, tweet_date.day, 
                hour, minute
            )
            
            # Format it nicely
            formatted_time = tweet_datetime.strftime("%A, %B %d, %Y at %I:%M %p")
            
            schedule.append({
                "tweet_number": i + 1,
                "scheduled_time": formatted_time,
                "datetime": tweet_datetime
            })
            
            # For next tweet
            if i % 3 == 2:  # Every 3 tweets, advance to next day
                tweet_date += timedelta(days=1)
            else:  # Otherwise wait 30-60 minutes
                tweet_date += timedelta(minutes=random.randint(30, 60))
                
        return schedule

    def get_topic_insights(self, topic):
        """Get SERP insights about the topic"""
        try:
            # Parameters for the API request
            params = {
                "api_key": SERP_API_KEY,
                "q": topic,
                "location": "United States",  # You can customize this
                "num": 10,  # Number of results to return
                "hl": "en",
                "engine": "google"
            }
            
            # Make the API request
            response = requests.get("https://serpapi.com/search", params=params)
            if response.status_code != 200:
                raise Exception(f"API request failed with status code {response.status_code}: {response.text}")
            
            # Get the results
            results = response.json()
            
            # Extract useful information
            insights = {
                "top_news": [],
                "related_questions": [],
                "related_searches": []
            }
            
            # Get top news
            if "news_results" in results:
                for item in results["news_results"][:5]:
                    insights["top_news"].append({
                        "title": item.get("title", ""),
                        "source": item.get("source", ""),
                        "date": item.get("date", "")
                    })
                    
            # Get related questions
            if "related_questions" in results:
                for item in results["related_questions"][:5]:
                    insights["related_questions"].append({
                        "question": item.get("question", ""),
                        "snippet": item.get("snippet", "")
                    })
                    
            # Get related searches
            if "related_searches" in results:
                for item in results["related_searches"][:8]:
                    insights["related_searches"].append(item.get("query", ""))
                    
            return insights
            
        except Exception as e:
            logger.error(f"Error getting SERP insights: {str(e)}")
            return {
                "top_news": [],
                "related_questions": [],
                "related_searches": []
            }

    def create_action_plan(self, topic, thread_data, schedule):
        """Generate an action plan based on the thread and insights"""
        try:
            api_key = get_random_gemini_key()
            genai.configure(api_key=api_key)
            llm = GoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=api_key)
            
            # Extract tweet content
            tweets = [tweet["content"] for tweet in thread_data]
            tweets_text = "\n\n".join([f"Tweet {i+1}: {tweet}" for i, tweet in enumerate(tweets)])
            
            # Format schedule
            schedule_text = "\n".join([
                f"Tweet {item['tweet_number']}: {item['scheduled_time']}" 
                for item in schedule
            ])
            
            # Create prompt for action plan
            action_plan_prompt = PromptTemplate(
                input_variables=["topic", "tweets", "schedule", "current_date"],
                template="""
                Create a comprehensive Action Plan for a viral Twitter thread campaign about "{topic}".
                
                Thread Content:
                {tweets}
                
                Posting Schedule:
                {schedule}
                
                Today's date: {current_date}
                
                Include in your action plan:
                1. A catchy campaign name
                2. Strategic objective (what this campaign aims to achieve)
                3. Target audience analysis
                4. Engagement tactics for each tweet
                5. Recommendations for:
                   - Hashtags to use
                   - Accounts to tag
                   - Follow-up content ideas
                6. Metrics to track for success
                7. Potential contingency plans for negative engagement
                
                Format this as a professional action plan that could be presented to a client.
                """
            )
            
            action_plan_chain = LLMChain(llm=llm, prompt=action_plan_prompt)
            action_plan = action_plan_chain.run(
                topic=topic,
                tweets=tweets_text,
                schedule=schedule_text,
                current_date=self.get_current_date()
            )
            
            return action_plan
            
        except Exception as e:
            logger.error(f"Error creating action plan: {str(e)}")
            return "Unable to generate action plan due to an error."

    def generate_thread(self, topic, thread_count=5, email=None):
        """Generate a complete viral thread with the given topic"""
        current_date = self.get_current_date()
        logger.info(f"Generating viral thread about: {topic} on {current_date}")
        
        try:
            # Create all chains with fresh LLM instances
            hook_chain = self.create_chain(self.hook_template)
            thread_chain = self.create_chain(self.thread_template)
            counterpoint_chain = self.create_chain(self.counterpoint_template)
            finale_chain = self.create_chain(self.finale_template)
            
            # Generate hook
            hook = hook_chain.run(topic=topic, current_date=current_date)
            hook = self.optimize_tweet(hook.strip())
            
            # Generate supporting tweets
            supporting_content = thread_chain.run(
                topic=topic,
                hook=hook,
                perspective="supporting",
                current_date=current_date
            )
            supporting_tweets = supporting_content.strip().split('\n')
            
            # Generate opposing tweets
            opposing_content = thread_chain.run(
                topic=topic,
                hook=hook,
                perspective="opposing",
                current_date=current_date
            )
            opposing_tweets = opposing_content.strip().split('\n')
            
            # Generate additional counterpoints in parallel
            counterpoints = []
            
            def generate_counterpoint(tweet):
                if random.random() < 0.3:  # 30% chance for each tweet to get a counterpoint
                    try:
                        counterpoint = counterpoint_chain.run(
                            topic=topic,
                            previous_tweet=tweet,
                            current_date=current_date
                        )
                        return self.optimize_tweet(counterpoint.strip())
                    except Exception as e:
                        logger.error(f"Error generating counterpoint: {str(e)}")
                        return None
                return None
            
            # Generate counterpoints in parallel
            with concurrent.futures.ThreadPoolExecutor() as executor:
                all_tweets = supporting_tweets + opposing_tweets
                potential_counterpoints = list(executor.map(generate_counterpoint, all_tweets))
                counterpoints = [cp for cp in potential_counterpoints if cp]
            
            # Generate finale
            finale = finale_chain.run(topic=topic, current_date=current_date)
            finale = self.optimize_tweet(finale.strip())
            
            # Combine all tweets with transitions
            transitions = [
                "Now here's where it gets spicy... ",
                "BUT WAIT bestie, consider this... ",
                "Plot twist incoming... ",
                "Hot take loading... ",
                "Unpopular opinion time... ",
                "Let's flip the script real quick... ",
                "Tea time besties... ",
                "The discourse™ continues... ",
                "Meanwhile, in another timeline... ",
                "Prepare for a reality check... "
            ]
            
            # Interleave supporting and opposing tweets
            middle_tweets = []
            for s, o in zip(supporting_tweets, opposing_tweets):
                if random.random() < 0.3:  # 30% chance for transition before supporting tweet
                    middle_tweets.append(random.choice(transitions))
                middle_tweets.append(s)
                if random.random() < 0.3:  # 30% chance for transition before opposing tweet
                    middle_tweets.append(random.choice(transitions))
                middle_tweets.append(o)
                
            # Insert counterpoints randomly
            for counterpoint in counterpoints:
                position = random.randint(0, len(middle_tweets))
                if random.random() < 0.3:  # 30% chance for transition before counterpoint
                    middle_tweets.insert(position, random.choice(transitions))
                middle_tweets.insert(position, counterpoint)
                
            # Cap the thread length based on thread_count
            all_tweets = [hook] + middle_tweets + [finale]
            all_tweets = all_tweets[:thread_count]
            
            # Generate metrics for each tweet and create image prompts in parallel
            def process_tweet(tweet):
                if not tweet:
                    return None
                
                try:
                    optimized_tweet = self.optimize_tweet(tweet)
                    image_prompt = self.generate_image_prompt(optimized_tweet)
                    
                    return {
                        "content": optimized_tweet,
                        "image_prompt": image_prompt
                    }
                except Exception as e:
                    logger.error(f"Error processing tweet: {str(e)}")
                    return {"content": tweet, "image_prompt": "Error generating image prompt"}
            
            # Process all tweets in parallel
            with concurrent.futures.ThreadPoolExecutor() as executor:
                processed_tweets = list(executor.map(process_tweet, all_tweets))
                processed_tweets = [t for t in processed_tweets if t]
            
            # Generate images for tweets in parallel
            def generate_tweet_image(tweet_data):
                try:
                    image_base64 = self.generate_image(tweet_data["image_prompt"])
                    tweet_data["image"] = image_base64
                    return tweet_data
                except Exception as e:
                    logger.error(f"Error generating image: {str(e)}")
                    tweet_data["image"] = None
                    return tweet_data
            
            # Generate images for selected tweets (not all to avoid API overuse)
            tweets_with_images = []
            for tweet_data in processed_tweets:
                # 50% chance to generate an image for each tweet
                if random.random() < 0.5:
                    tweet_with_image = generate_tweet_image(tweet_data)
                    tweets_with_images.append(tweet_with_image)
                else:
                    tweet_data["image"] = None
                    tweets_with_images.append(tweet_data)
            
            # Generate posting schedule
            schedule = self.generate_posting_schedule(len(tweets_with_images))
            
            # Get topic insights
            insights = self.get_topic_insights(topic)
            
            # Create action plan
            action_plan = self.create_action_plan(topic, tweets_with_images, schedule)
            
            # Combine everything into final result
            thread_data = {
                "topic": topic,
                "generated_date": current_date,
                "tweets": tweets_with_images,
                "schedule": schedule,
                "insights": insights,
                "action_plan": action_plan
            }
            
            return thread_data
            
        except Exception as e:
            logger.error(f"Error generating thread: {str(e)}")
            return {
                "error": str(e),
                "topic": topic,
                "generated_date": current_date,
                "tweets": []
        }
