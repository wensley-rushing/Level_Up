from flask import Flask, jsonify, request
import os
import pickle
import json
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from datetime import datetime, timedelta
from flask_cors import CORS
import pandas as pd
from collections import Counter
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# OAuth 2.0 settings
SCOPES = [
    'https://www.googleapis.com/auth/yt-analytics.readonly',
    'https://www.googleapis.com/auth/youtube.readonly'
]
CLIENT_SECRETS_FILE = 'client_secret.json'

def authenticate(email):
    token_file = f'token_{email.replace("@", "_")}.pickle'
    credentials = None
    if os.path.exists(token_file):
        with open(token_file, 'rb') as token:
            credentials = pickle.load(token)
    if not credentials or not credentials.valid:
        flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
        credentials = flow.run_local_server(port=0)
        with open(token_file, 'wb') as token:
            pickle.dump(credentials, token)
    return credentials

def get_video_analytics(credentials, days=365):
    print("Fetching video analytics...")
    youtube_analytics = build('youtubeAnalytics', 'v2', credentials=credentials)
    try:
        end_date = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        
        response = youtube_analytics.reports().query(
            ids='channel==MINE',
            startDate=start_date,
            endDate=end_date,
            metrics='views,estimatedMinutesWatched,averageViewDuration,likes,comments,shares,subscribersGained',
            dimensions='video',
            maxResults=200,
            sort='-views'
        ).execute()
        print(f"Response rows: {response.get('rows', 'None')}")
        return response.get('rows', [])
    
    except HttpError as e:
        print(f"Video Analytics API Error: {e}")
        print(f"Details: {e.content.decode()}")
        return []

def get_time_based_analytics(credentials, days=365):
    youtube_analytics = build('youtubeAnalytics', 'v2', credentials=credentials)
    try:
        end_date = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        
        response = youtube_analytics.reports().query(
            ids='channel==MINE',
            startDate=start_date,
            endDate=end_date,
            metrics='views,estimatedMinutesWatched,subscribersGained',
            dimensions='day',
            sort='day'
        ).execute()
        return response.get('rows', [])
    except HttpError as e:
        print(f"Time-Based Analytics API Error: {e}")
        print(f"Details: {e.content.decode()}")
        return []

def get_demographics_analytics(credentials, days=365):
    youtube_analytics = build('youtubeAnalytics', 'v2', credentials=credentials)
    try:
        end_date = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        
        response = youtube_analytics.reports().query(
            ids='channel==MINE',
            startDate=start_date,
            endDate=end_date,
            metrics='viewerPercentage',
            dimensions='ageGroup,gender',
            maxResults=200
        ).execute()
        return response.get('rows', [])
    except HttpError as e:
        print(f"Demographics API Error: {e}")
        print(f"Details: {e.content.decode()}")
        return []

def get_traffic_source_analytics(credentials, days=365):
    youtube_analytics = build('youtubeAnalytics', 'v2', credentials=credentials)
    try:
        end_date = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        
        response = youtube_analytics.reports().query(
            ids='channel==MINE',
            startDate=start_date,
            endDate=end_date,
            metrics='views',
            dimensions='insightTrafficSourceType',
            maxResults=200,
            sort='-views'
        ).execute()
        return response.get('rows', [])
    except HttpError as e:
        print(f"Traffic Source API Error: {e}")
        print(f"Details: {e.content.decode()}")
        return []

def get_video_metadata(credentials, video_ids):
    youtube = build('youtube', 'v3', credentials=credentials)
    try:
        response = youtube.videos().list(
            part='snippet,contentDetails,statistics',
            id=','.join(video_ids),
            maxResults=50
        ).execute()
        
        video_info = {}
        for item in response.get('items', []):
            video_id = item['id']
            snippet = item.get('snippet', {})
            content_details = item.get('contentDetails', {})
            stats = item.get('statistics', {})
            video_info[video_id] = {
                'title': snippet.get('title', 'N/A'),
                'description': snippet.get('description', 'N/A'),
                'tags': snippet.get('tags', []) if snippet.get('tags') else [],
                'categoryId': snippet.get('categoryId', 'N/A'),
                'publishedAt': snippet.get('publishedAt', 'N/A'),
                'duration': content_details.get('duration', 'N/A'),
                'definition': content_details.get('definition', 'N/A'),
                'viewCount': stats.get('viewCount', 0),
                'likeCount': stats.get('likeCount', 0),
                'commentCount': stats.get('commentCount', 0)
            }
        return video_info
    except HttpError as e:
        print(f"Data API Error: {e}")
        print(f"Details: {e.content.decode()}")
        return {}

def get_channel_stats(credentials):
    youtube = build('youtube', 'v3', credentials=credentials)
    try:
        response = youtube.channels().list(
            part='statistics',
            mine=True
        ).execute()
        
        if 'items' in response and len(response['items']) > 0:
            return response['items'][0]['statistics']
        return {}
    except HttpError as e:
        print(f"Channel Stats API Error: {e}")
        print(f"Details: {e.content.decode()}")
        return {}

def get_ai_powered_insights(video_analytics, metadata):
    """
    Use Gemini or similar AI model to analyze video performance and generate insights
    """
    try:
        # Format the data for the AI model
        ai_input = format_data_for_ai(video_analytics, metadata)
        
        # Call the AI model (via API)
        ai_response = call_ai_model(ai_input)
        
        # Parse the AI response
        return parse_ai_response(ai_response)
        
    except Exception as e:
        print(f"AI Analysis Error: {e}")
        return {
            'ai_recommendation': 'AI analysis unavailable. Please try again later.'
        }

def format_data_for_ai(video_analytics, metadata):
    """Format video data in a way the AI model can understand"""
    videos = []
    for row in video_analytics:
        video_id = row[0]
        meta = metadata.get(video_id, {})
        videos.append({
            'title': meta.get('title', 'Unknown'),
            'views': float(row[1]),
            'watchTime': float(row[2]),
            'avgDuration': float(row[3]),
            'likes': float(row[4]),
            'comments': float(row[5]),
            'publishedAt': meta.get('publishedAt', ''),
            'tags': meta.get('tags', []),
            'description': meta.get('description', '')
        })
    
    return {
        'videos': videos
    }

def call_ai_model(data):
    """Call the AI model (like Gemini-1.5-pro) with the video data"""
    # This would be your API call to Gemini or another model
    import google.generativeai as genai
    
    # Configure the API key (You need to set this environment variable or replace with your key)
    genai.configure(api_key=os.environ.get('GEMINI_API_KEY', 'YOUR_API_KEY_HERE'))
    
    # Format the prompt
    prompt = """
    As a YouTube content strategy expert, analyze the following channel data and provide recommendations.
    The goal is to help the creator understand:
    1. What content types perform best for their channel
    2. Optimal posting frequency and schedule
    3. Audience retention strategies
    4. Growth opportunities
    
    Channel data:
    {}
    
    Provide specific, actionable recommendations in JSON format with these keys:
    - content_types_recommendation: what type of content performs best and what should they make more of
    - posting_strategy: optimal posting frequency and schedule
    - audience_retention_tips: how to keep viewers watching longer
    - growth_opportunities: specific ways to grow the channel
    """.format(json.dumps(data, indent=2))
    
    # Call the model
    model = genai.GenerativeModel('gemini-1.5-pro')
    response = model.generate_content(prompt)
    print(response)
    return response.text

def parse_ai_response(response):
    """Parse the AI response into structured data"""
    try:
        # Try to parse as JSON first
        ai_data = json.loads(response)
        return {
            'ai_content_recommendation': ai_data.get('content_types_recommendation', ''),
            'ai_posting_strategy': ai_data.get('posting_strategy', ''),
            'ai_audience_retention_tips': ai_data.get('audience_retention_tips', ''),
            'ai_growth_opportunities': ai_data.get('growth_opportunities', '')
        }
    except json.JSONDecodeError:
        # If not JSON, just return the text
        return {
            'ai_recommendation': response
        }

def generate_insights_for_small_channel(video_analytics, metadata):
    """
    Generate appropriate insights for channels with limited data
    """
    videos_count = len(video_analytics)
    total_views = sum(float(row[1]) for row in video_analytics) if video_analytics else 0
    
    insights = {
        'limited_data': True,
        'content_recommendations': [],
        'channel_growth_plan': []
    }
    
    # Basic recommendations based on channel size
    if videos_count < 5:
        insights['content_recommendations'].append(
            f"You currently have {videos_count} videos. Upload at least 10 videos to establish your channel's baseline performance."
        )
        
        insights['channel_growth_plan'] = [
            "Establish a consistent posting schedule (e.g., weekly)",
            "Focus on searchable topics in your niche to gain initial visibility",
            "Optimize video titles and descriptions with relevant keywords",
            "Create content that answers specific questions people search for"
        ]
    
    if total_views < 100:
        insights['content_recommendations'].append(
            "Your channel is in its early growth phase. Focus on promoting your videos on other platforms to increase views."
        )
    
    # Look for any patterns in the limited data
    if videos_count >= 3:
        # Find the best performing video
        best_video_id = max(video_analytics, key=lambda x: float(x[1]))[0]
        best_meta = metadata.get(best_video_id, {})
        
        if best_meta:
            insights['content_recommendations'].append(
                f"Your video '{best_meta.get('title', 'Unknown')}' is your best performer. Consider creating more content similar to this video."
            )
    
    return insights

@app.route('/api/authenticate', methods=['POST'])
def api_authenticate():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    try:
        credentials = authenticate(email)
        return jsonify({'success': True, 'message': 'Authentication successful'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_content_insights(video_analytics, metadata):
    """
    Analyze video performance data and generate content strategy insights
    """
    insights = {
        'content_recommendations': [],
        'posting_strategy': {},
        'growth_opportunities': [],
        'audience_insights': {}
    }
    
    # Skip analysis if there's not enough data
    if len(video_analytics) < 3:
        insights['limited_data'] = True
        insights['content_recommendations'].append(
            "Upload more videos to get personalized content recommendations. We need at least 5 videos to provide meaningful analysis."
        )
        return insights
    
    # Analyze video types/categories
    categories = {}
    engagement_by_category = {}
    avg_duration_by_category = {}
    
    for row in video_analytics:
        video_id = row[0]
        views = float(row[1])
        watch_time = float(row[2])
        avg_duration = float(row[3])
        likes = float(row[4])
        comments = float(row[5])
        
        meta = metadata.get(video_id, {})
        category = meta.get('categoryId', 'Other')
        title = meta.get('title', '').lower()
        tags = [tag.lower() for tag in meta.get('tags', [])]
        
        # Determine content type from title, tags, and description
        content_type = determine_content_type(title, tags, meta.get('description', ''))
        
        # Track performance by content type
        if content_type not in categories:
            categories[content_type] = {'views': 0, 'videos': 0}
        categories[content_type]['views'] += views
        categories[content_type]['videos'] += 1
        
        # Track engagement by content type
        engagement = (likes + comments) / views if views > 0 else 0
        if content_type not in engagement_by_category:
            engagement_by_category[content_type] = []
        engagement_by_category[content_type].append(engagement)
        
        # Track retention by content type
        if content_type not in avg_duration_by_category:
            avg_duration_by_category[content_type] = []
        avg_duration_by_category[content_type].append(avg_duration)
    
    # Calculate average metrics by content type
    for content_type in categories:
        if content_type in engagement_by_category:
            avg_engagement = sum(engagement_by_category[content_type]) / len(engagement_by_category[content_type])
            categories[content_type]['avg_engagement'] = avg_engagement
        
        if content_type in avg_duration_by_category:
            avg_duration = sum(avg_duration_by_category[content_type]) / len(avg_duration_by_category[content_type])
            categories[content_type]['avg_duration'] = avg_duration
        
        categories[content_type]['avg_views'] = categories[content_type]['views'] / categories[content_type]['videos']
    
    # Find best performing content types
    best_by_views = sorted(categories.items(), key=lambda x: x[1]['avg_views'], reverse=True)
    best_by_engagement = sorted(categories.items(), key=lambda x: x[1].get('avg_engagement', 0), reverse=True)
    best_by_retention = sorted(categories.items(), key=lambda x: x[1].get('avg_duration', 0), reverse=True)
    
    # Generate content recommendations
    if best_by_views:
        insights['content_recommendations'].append(
            f"Your {best_by_views[0][0]} videos get the most views. Consider making more of these."
        )
    
    if best_by_engagement:
        insights['content_recommendations'].append(
            f"Your {best_by_engagement[0][0]} videos have the highest engagement. Your audience responds well to this content."
        )
    
    if best_by_retention:
        insights['content_recommendations'].append(
            f"Your {best_by_retention[0][0]} videos keep viewers watching longer. Focus on this style to increase watch time."
        )
    
    # Analyze posting frequency and optimal schedule
    posting_strategy = analyze_posting_frequency(video_analytics, metadata)
    insights['posting_strategy'] = posting_strategy
    
    return insights

def determine_content_type(title, tags, description):
    """
    Determine content type based on video metadata
    """
    # Map common keywords to content types
    content_types = {
        'tutorial': ['tutorial', 'how to', 'guide', 'learn', 'step by step'],
        'review': ['review', 'unboxing', 'test', 'hands on'],
        'vlog': ['vlog', 'day in the life', 'follow me', 'journey'],
        'educational': ['explain', 'education', 'course', 'lesson', 'tips'],
        'entertainment': ['funny', 'comedy', 'prank', 'challenge', 'reaction'],
        'hackathon': ['hackathon', 'hack', 'coding challenge'],
        'tech': ['tech', 'technology', 'programming', 'coding', 'developer']
    }
    
    for content_type, keywords in content_types.items():
        for keyword in keywords:
            if (keyword in title or
                any(keyword in tag for tag in tags) or
                keyword in description):
                return content_type
    
    return 'other'

def analyze_posting_frequency(video_analytics, metadata):
    """
    Analyze posting frequency and optimal schedule
    """
    # Extract publish dates
    publish_dates = []
    for video_id, meta in metadata.items():
        if meta.get('publishedAt'):
            try:
                publish_date = datetime.strptime(meta['publishedAt'], '%Y-%m-%dT%H:%M:%SZ')
                views = next((row[1] for row in video_analytics if row[0] == video_id), 0)
                publish_dates.append({
                    'date': publish_date,
                    'views': float(views)
                })
            except Exception:
                pass
    
    # Sort by date
    publish_dates.sort(key=lambda x: x['date'])
    
    if len(publish_dates) < 2:
        return {
            'current_frequency': 'irregular',
            'recommended_frequency': 'weekly',
            'recommendation': 'Try to establish a regular weekly posting schedule to build audience expectations.'
        }
    
    # Calculate gaps between videos
    gaps = []
    for i in range(1, len(publish_dates)):
        gap_days = (publish_dates[i]['date'] - publish_dates[i-1]['date']).days
        gaps.append(gap_days)
    
    # Calculate average gap
    avg_gap = sum(gaps) / len(gaps) if gaps else 0
    
    # Determine current frequency
    if avg_gap <= 2:
        current_frequency = 'every 1-2 days'
    elif avg_gap <= 7:
        current_frequency = 'weekly'
    elif avg_gap <= 14:
        current_frequency = 'biweekly'
    elif avg_gap <= 30:
        current_frequency = 'monthly'
    else:
        current_frequency = 'irregular'
    
    # Make recommendation based on views and frequency
    total_views = sum(item['views'] for item in publish_dates)
    
    if total_views < 100 and avg_gap > 14:
        recommendation = 'Increase your posting frequency to weekly to build audience momentum.'
    elif avg_gap > 30:
        recommendation = 'Your posting schedule is very irregular. Try to establish a consistent rhythm.'
    else:
        recommendation = f'Your current {current_frequency} posting frequency works well for your channel.'
    
    return {
        'current_frequency': current_frequency,
        'average_gap_days': round(avg_gap, 1),
        'recommended_frequency': 'weekly' if avg_gap > 7 else current_frequency,
        'recommendation': recommendation
    }

@app.route('/api/dashboard', methods=['GET'])
def api_dashboard():
    email = request.args.get('email')
    days = int(request.args.get('days', 365))
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    try:
        credentials = authenticate(email)
        
        # Get all analytics data
        video_analytics = get_video_analytics(credentials, days)
        if not video_analytics:
            return jsonify({'error': 'No video analytics data available'}), 404
        
        time_analytics = get_time_based_analytics(credentials, days)
        demo_analytics = get_demographics_analytics(credentials, days)
        traffic_data = get_traffic_source_analytics(credentials, days)
        channel_stats = get_channel_stats(credentials)
        
        # Get video metadata
        video_ids = list(set(row[0] for row in video_analytics))
        metadata = get_video_metadata(credentials, video_ids)
        
        # Calculate dashboard metrics with error handling
        total_subscribers = int(channel_stats.get('subscriberCount', 0))
        total_views = int(channel_stats.get('viewCount', 0))
        
        subs_gained = sum(float(row[6]) for row in video_analytics) if video_analytics and len(video_analytics[0]) > 6 else 0
        total_video_views = sum(float(row[0]) for row in video_analytics) if video_analytics else 0
        total_likes = sum(float(row[3]) for row in video_analytics) if video_analytics and len(video_analytics[0]) > 3 else 0
        total_comments = sum(float(row[4]) for row in video_analytics) if video_analytics and len(video_analytics[0]) > 4 else 0
        total_shares = sum(float(row[5]) for row in video_analytics) if video_analytics and len(video_analytics[0]) > 5 else 0
        
        # Calculate engagement rate
        engagement_rate = round((total_likes + total_comments + total_shares) / total_video_views * 100, 1) if total_video_views > 0 else 0
        
        # Process time-based data for audience growth chart
        time_data = []
        for row in time_analytics:
            time_data.append({
                'day': row[0],
                'views': int(row[1]),
                'watchTime': float(row[2]),
                'subscribersGained': float(row[3]) if len(row) > 3 else 0
            })
        
        # Audience growth data for chart
        # Simplify by taking points every 30 days
        audience_growth = []
        subscribers_so_far = total_subscribers - subs_gained
        
        # Group by week or month for better visualization
        growth_points = time_data[-30::5]  # Every 5 days from last 30
        for i, point in enumerate(growth_points):
            subscribers_so_far += point.get('subscribersGained', 0)
            audience_growth.append({
                'day': i * 5 + 1,  # Days 1, 6, 11, etc.
                'subscribers': int(subscribers_so_far)
            })
            
        # Process video categories for content performance
        categories = {}
        for video_id, meta in metadata.items():
            category = meta.get('categoryId', 'Other')
            # Map category IDs to names (simplified)
            category_name = {
                '1': 'Films',
                '2': 'Autos',
                '10': 'Music',
                '15': 'Pets',
                '17': 'Sports',
                '20': 'Gaming',
                '22': 'People',
                '23': 'Comedy',
                '24': 'Entertainment',
                '25': 'News',
                '26': 'How-to',
                '27': 'Education',
                '28': 'Science',
                '29': 'Nonprofits'
            }.get(category, f'Category {category}')
            
            # Find the views for this video
            views = next((row[1] for row in video_analytics if row[0] == video_id), 0)
            
            if category_name in categories:
                categories[category_name] += float(views)
            else:
                categories[category_name] = float(views)
        
        # Convert to array for chart
        content_performance = [{'category': cat, 'views': int(views)} for cat, views in categories.items()]
        content_performance.sort(key=lambda x: x['views'], reverse=True)
        content_performance = content_performance[:6]  # Top 6 categories
        
        # Process demographics
        demographics = []
        for age, gender, percentage in demo_analytics:
            demographics.append({
                'ageGroup': age,
                'gender': gender,
                'percentage': float(percentage)
            })
        
        # Find top demographic
        top_demo = max(demographics, key=lambda x: x['percentage']) if demographics else None
        
        # Process traffic sources
        traffic_sources = []
        for source, views in traffic_data:
            traffic_sources.append({
                'source': source,
                'views': int(views)
            })
        
        # Best posting time analysis
        pub_times = []
        for vid_id, meta in metadata.items():
            if meta['publishedAt'] != 'N/A':
                try:
                    pub_time = datetime.strptime(meta['publishedAt'], '%Y-%m-%dT%H:%M:%SZ')
                    # Find video views
                    views = next((row[1] for row in video_analytics if row[0] == vid_id), 0)
                    pub_times.append({
                        'dayOfWeek': pub_time.strftime('%A'),
                        'hour': pub_time.hour,
                        'views': float(views)
                    })
                except Exception as e:
                    print(f"Error parsing publish time: {e}")
        
        # Find best day and hour by average views
        day_performance = {}
        hour_performance = {}
        
        for entry in pub_times:
            day = entry['dayOfWeek']
            hour = entry['hour']
            views = entry['views']
            
            if day not in day_performance:
                day_performance[day] = {'total': 0, 'count': 0}
            day_performance[day]['total'] += views
            day_performance[day]['count'] += 1
            
            if hour not in hour_performance:
                hour_performance[hour] = {'total': 0, 'count': 0}
            hour_performance[hour]['total'] += views
            hour_performance[hour]['count'] += 1
        
        # Calculate averages
        for day in day_performance:
            day_performance[day]['average'] = day_performance[day]['total'] / day_performance[day]['count']
        
        for hour in hour_performance:
            hour_performance[hour]['average'] = hour_performance[hour]['total'] / hour_performance[hour]['count']
        
        # Find best day and hour
        best_day = max(day_performance.items(), key=lambda x: x[1]['average'])[0] if day_performance else "N/A"
        best_hour = max(hour_performance.items(), key=lambda x: x[1]['average'])[0] if hour_performance else "N/A"
        
        # Top hashtags/tags analysis
        all_tags = [tag.lower() for vid_id, meta in metadata.items() for tag in meta['tags']]
        tag_counter = Counter(all_tags)
        top_tags = [{'tag': tag, 'count': count} for tag, count in tag_counter.most_common(5)]
        
        # Top performing videos
        top_videos = []
        for row in video_analytics[:3]:  # Top 3 videos by views
            video_id = row[0]
            meta = metadata.get(video_id, {})
            likes = float(row[3])
            top_videos.append({
                'title': meta.get('title', 'Unknown Video'),
                'likes': int(likes)
            })
        
        # Calculate growth percentages (mock data since we don't have historical data)
        subscribers_growth_percent = round(subs_gained / (total_subscribers - subs_gained) * 100, 1) if total_subscribers > subs_gained else 0
        engagement_growth_percent = 0.9  # Mock data
        views_growth_percent = 12.4  # Mock data
        impressions_growth_percent = -1.2  # Mock data
        
        # Prepare AI recommendation based on data
        ai_recommendation = "Increase posting frequency to 2-3 videos/week based on subscriber growth."
        if engagement_rate < 3:
            ai_recommendation = "Focus on creating more engaging content to improve your engagement rate."
        elif total_likes < total_comments * 5:
            ai_recommendation = "Encourage more likes by adding calls-to-action in your videos."
        
        # Format the response
        response_data = {
            'dashboardData': {
                'totalSubscribers': total_subscribers,
                'subscribersGained': int(subs_gained),
                'subscribersGrowthPercent': subscribers_growth_percent,
                'engagementRate': engagement_rate,
                'engagementGrowthPercent': engagement_growth_percent,
                'totalViews': int(total_video_views),
                'viewsGrowthPercent': views_growth_percent,
                'impressions': int(total_video_views * 2.05),  # Estimate impressions as 2.05x views
                'impressionsGrowthPercent': impressions_growth_percent,
            },
            'audienceGrowthData': audience_growth,
            'contentPerformanceData': content_performance,
            'sentimentData': [
                {'name': 'Positive', 'value': 80},  # Mock data - YouTube API doesn't provide sentiment
                {'name': 'Neutral', 'value': 15},
                {'name': 'Negative', 'value': 5},
            ],
            'topPerformingContent': top_videos,
            'bestPostingTime': {
                'day': best_day,
                'hour': best_hour,
                'formatted': f"{best_day}s @ {best_hour}:00"
            },
            'topHashtag': {
                'tag': top_tags[0]['tag'] if top_tags else "N/A",
                'growth': '+256%'  # Mock growth data
            },
            'topDemographic': {
                'ageGroup': top_demo['ageGroup'] if top_demo else "25-34",
                'gender': top_demo['gender'] if top_demo else "Female",
                'region': "US",  # Region data typically requires additional API calls
                'formatted': f"{top_demo['gender'] if top_demo else 'Women'}, {top_demo['ageGroup'] if top_demo else '25-34'}, US"
            },
            'aiRecommendation': ai_recommendation
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Dashboard Error: {str(e)}")  # Debug print
        return jsonify({'error': str(e)}), 500

@app.route('/api/detailed-video-analytics', methods=['GET'])
def api_detailed_video_analytics():
    email = request.args.get('email')
    days = int(request.args.get('days', 365))
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    try:
        credentials = authenticate(email)
        
        video_analytics = get_video_analytics(credentials, days)
        if not video_analytics:
            return jsonify({'error': 'No video analytics data available'}), 404
        
        video_ids = list(set(row[0] for row in video_analytics))
        metadata = get_video_metadata(credentials, video_ids)
        
        detailed_videos = []
        for row in video_analytics:
            video_id, views, watch_time, avg_duration, likes, comments, shares, subs_gained = row
            meta = metadata.get(video_id, {})
            
            detailed_videos.append({
                'videoId': video_id,
                'title': meta.get('title', 'Unknown'),
                'publishedAt': meta.get('publishedAt'),
                'views': int(float(views)),
                'watchTimeMinutes': float(watch_time),
                'avgDurationSeconds': float(avg_duration),
                'likes': int(float(likes)),
                'comments': int(float(comments)),
                'shares': int(float(shares)),
                'subscribersGained': int(float(subs_gained)),
                'tags': meta.get('tags', []),
                'description': meta.get('description', '')
            })
        
        return jsonify({'videos': detailed_videos})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/demographic-analytics', methods=['GET'])
def api_demographic_analytics():
    email = request.args.get('email')
    days = int(request.args.get('days', 365))
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    try:
        credentials = authenticate(email)
        
        demo_analytics = get_demographics_analytics(credentials, days)
        if not demo_analytics:
            return jsonify({'error': 'No demographic data available'}), 404
        
        demographics = []
        for age, gender, percentage in demo_analytics:
            demographics.append({
                'ageGroup': age,
                'gender': gender,
                'percentage': float(percentage)
            })
        
        return jsonify({'demographics': demographics})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/traffic-sources', methods=['GET'])
def api_traffic_sources():
    email = request.args.get('email')
    days = int(request.args.get('days', 365))
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    try:
        credentials = authenticate(email)
        
        traffic_data = get_traffic_source_analytics(credentials, days)
        if not traffic_data:
            return jsonify({'error': 'No traffic source data available'}), 404
        
        traffic_sources = []
        for source, views in traffic_data:
            traffic_sources.append({
                'source': source,
                'views': int(float(views))
            })
        
        return jsonify({'trafficSources': traffic_sources})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/time-analytics', methods=['GET'])
def api_time_analytics():
    email = request.args.get('email')
    days = int(request.args.get('days', 365))
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    try:
        credentials = authenticate(email)
        
        time_analytics = get_time_based_analytics(credentials, days)
        if not time_analytics:
            return jsonify({'error': 'No time-based data available'}), 404
        
        time_data = []
        for row in time_analytics:
            time_data.append({
                'day': row[0],
                'views': int(float(row[1])),
                'watchTimeMinutes': float(row[2]),
                'subscribersGained': float(row[3]) if len(row) > 3 else 0
            })
        
        return jsonify({'timeData': time_data})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/content-strategy', methods=['GET'])
def api_content_strategy():
    email = request.args.get('email')
    days = int(request.args.get('days', 30))
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    try:
        credentials = authenticate(email)
        
        # Get all analytics data
        video_analytics = get_video_analytics(credentials, days)
        if not video_analytics:
            # Return basic recommendations for channels with no data
            return jsonify({
                'contentStrategy': {
                    'recommendations': [
                        'Upload your first video to start getting analytics',
                        'Focus on consistent uploads to build an audience',
                        'Optimize your video titles and descriptions for search'
                    ],
                    'posting_strategy': {
                        'current': 'No uploads yet',
                        'recommended': 'Start with weekly uploads'
                    }
                }
            })
        
        # Get video metadata
        video_ids = list(set(row[0] for row in video_analytics))
        metadata = get_video_metadata(credentials, video_ids)
        
        # Generate basic insights
        insights = generate_content_insights(video_analytics, metadata)
        
        try:
            # Get AI-powered insights
            if os.environ.get('GEMINI_API_KEY'):
                ai_insights = get_ai_powered_insights(video_analytics, metadata)
                if isinstance(ai_insights, dict):
                    insights.update(ai_insights)
                else:
                    # Handle non-dict AI response
                    insights['ai_recommendation'] = str(ai_insights)
        except Exception as ai_error:
            print(f"AI analysis error: {ai_error}")
            insights['ai_error'] = 'AI analysis temporarily unavailable'
        
        return jsonify({'contentStrategy': insights})
        
    except Exception as e:
        print(f"Content strategy error: {e}")
        return jsonify({
            'error': 'Failed to generate content strategy',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)