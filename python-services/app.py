from flask import Flask, request, jsonify
from flask_cors import CORS
from sbert import get_vectors, get_similarity

app = Flask(__name__)
CORS(app)

@app.route("/embed", methods=["POST"])
def embed():
    data = request.get_json()
    review = data.get("review", "")

    if not review:
        return jsonify({"error": "No review provided"}), 400

    vectors = get_vectors(review)
    return jsonify({"vectors": vectors})

@app.route("/similarity", methods=["POST"])
def similarity():
    data = request.get_json()
    query = data.get("query", "")

    if not query:
        return jsonify({"error": "No query provided"}), 400

    similar_review_ids = get_similarity(query)
    return jsonify({"review_ids": similar_review_ids})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
