from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# 🔐 Bland.ai API details
BLAND_API_URL = "https://api.bland.ai/v1/calls"
BLAND_API_KEY = "org_12928eb3ba4076ace049014110ab4667ec6325a2379c1c5d6b79d1f460cdd18c2d71c582953d2543c98169"  # Replace this with your real token

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

