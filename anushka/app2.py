from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.agents import AgentType, initialize_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from composio_langchain import ComposioToolSet
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()

# Hardcode API keys
os.environ["GOOGLE_API_KEY"] = "AIzaSyAXkV2TzFEFcplzxp7J0DGRFdvoI7DjcnM"
os.environ["COMPOSIO_API_KEY"] = "7x3tgeyd9hcuftbaxha3pn"

# Check if environment variables are set
if not os.getenv("GOOGLE_API_KEY") or not os.getenv("COMPOSIO_API_KEY"):
    raise ValueError("Please set GOOGLE_API_KEY and COMPOSIO_API_KEY in your environment or .env file")

# Initialize the Gemini LLM instead of Groq
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

# Get Composio tools - only calendar related ones
composio_toolset = ComposioToolSet()
tools = composio_toolset.get_tools(actions=[
    'GOOGLECALENDAR_CREATE_EVENT', 
    'GOOGLECALENDAR_QUICK_ADD',
    'GMAIL_SEND_EMAIL'

])

# Create agent with Gemini model
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

@app.route('/schedule_calendar', methods=['POST'])
def schedule_calendar():
    data = request.json
    
    if not data or 'email' not in data or 'thread_data' not in data:
        return jsonify({"error": "Email and thread data are required"}), 400
    
    email = data['email']
    thread_data = data['thread_data']
    
    # Extract schedule information from thread_data
    if not thread_data.get('schedule') or not isinstance(thread_data['schedule'], list):
        return jsonify({"error": "No valid schedule information found in thread data"}), 400
    
    schedule_info = thread_data['schedule']
    
    try:
        # Construct detailed prompts for each event
        results = []
        for event in schedule_info:
            datetime = event.get('datetime')
            scheduled_time = event.get('scheduled_time')
            tweet_number = event.get('tweet_number')
            
            if not datetime or not scheduled_time or not tweet_number:
                continue  # Skip invalid entries
            
            # Format the event details
            event_description = f"Thread meeting with {email}: {thread_data.get('title', 'No Title Provided')}"
            detailed_prompt = (
                f"Schedule a meeting in Google Calendar with the following details:\n"
                f"- Title: {event_description}\n"
                f"- Date and Time: {scheduled_time} ({datetime})\n"
                f"- Tweet Number: {tweet_number}\n"
                f"- Add {email} as an attendee.\n\n"
                f"Additionally, send a detailed email to {email} with the following content:\n"
                f"Subject: Scheduled tweet Details\n"
                f"Body:\n"
                f"Dear {email},\n\n"
                f"This is to confirm the scheduling of a tweet with the following details:\n"
                f"- Title: {event_description}\n"
                f"- Date and Time: {scheduled_time} ({datetime})\n"
                f"- Tweet Number: {tweet_number}\n\n"
                f"Please let us know if you have any questions.\n\n"
                f"Best regards,\nYour Team"
            )
            
            # Run the agent with the detailed prompt
            result = agent.run(detailed_prompt)
            results.append({
                "datetime": datetime,
                "scheduled_time": scheduled_time,
                "tweet_number": tweet_number,
                "details": result
            })
        
        return jsonify({
            "success": True,
            "message": "Events processed successfully",
            "results": results
        })
        
    except Exception as e:
        print(f"Error scheduling calendar events: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
