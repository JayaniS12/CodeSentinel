
from flask import Flask, request, jsonify
from flask_cors import CORS

from analyzer.static_analyzer import analyze_code

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "CodeSentinel API is running!",
        "status": "success"
    })


@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json(silent=True)

    if not data or "code" not in data:
        return jsonify({
            "error": "Please provide Python code."
        }), 400

    code = data["code"]

    if not isinstance(code, str) or not code.strip():
        return jsonify({
            "error": "Code cannot be empty."
        }), 400

    result = analyze_code(code)

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
