from flask import Flask, request, jsonify
import torch
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
model = SentenceTransformer("sentence-transformers/multi-qa-mpnet-base-dot-v1")

@app.route('/encode', methods=['POST'])
def encode():
    data = request.get_json()
    text = data.get('text')
    embedding = model.encode(text).tolist()
    return jsonify({'embedding': embedding})

if __name__ == '__main__':
    app.run(port=5001)