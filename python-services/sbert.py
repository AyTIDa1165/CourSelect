import torch
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv

import psycopg2

load_dotenv() # Loading environment variables.

db_name = os.getenv("PYTHON_DB_NAME")
db_user = os.getenv("PYTHON_DB_USER")
db_host = os.getenv("PYTHON_DB_HOST")
db_password = os.getenv("PYTHON_DB_PASSWORD")

conn = psycopg2.connect(f"dbname={db_name} user={db_user} password={db_password} host={db_host}")
cur = conn.cursor()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = SentenceTransformer("sentence-transformers/multi-qa-mpnet-base-dot-v1")
model = model.to(device)

def get_vectors(review):
    with torch.no_grad():
        vectors = model.encode([review], convert_to_tensor=True)
        return vectors.cpu().numpy().tolist()
    
def get_similarity(query):
    query_embedding = model.encode(query, convert_to_tensor=True).cpu().numpy().tolist()

    cur.execute(
        "SELECT id FROM reviews ORDER BY (vectors <=> %s) ASC LIMIT 5",
        (query_embedding,)
    )

    top_reviews = cur.fetchall()  # List of tuples [(id1,), (id2,), (id3,)]
    
    # Extract review IDs from tuples
    review_ids = [row[0] for row in top_reviews]

    return review_ids