from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# 🔐 Bland.ai API details
BLAND_API_URL = "https://api.bland.ai/v1/calls"
BLAND_API_KEY = "org_a8a8312efa4234bb5112fefd6dde6b611a82d26765e203f35b3fe8c04999bec4c92d269f4f8c96c8d06969"  # Replace this with your real token

@app.route('/start-call', methods=['POST'])
def start_call():
    data = request.get_json()

    phone_number = data.get("phone_number")
    pathway_id = data.get("pathway_id")

    if not phone_number or not pathway_id:
        return jsonify({"error": "Missing phone_number or pathway_id"}), 400

    payload = {
        "phone_number": phone_number,
        "pathway_id": pathway_id
    }

    headers = {
        "authorization": BLAND_API_KEY,
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(BLAND_API_URL, json=payload, headers=headers)
        return jsonify({
            "status_code": response.status_code,
            "response": response.json()
        }), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

