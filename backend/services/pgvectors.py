import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

DB_CONFIG = {
    "host": "localhost",
    "database": "CourselectDB",
    "user": "postgres",
    "password": "mysecretpassword"
}

TABLE_NAME = "Review"
NEW_COLUMN_NAME = "vectors"
VECTOR_DIMENSION = 768

def add_pgvector_column():
    try:
        connection = psycopg2.connect(**DB_CONFIG)
        connection.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = connection.cursor()

        cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")

        alter_query = f"""
        ALTER TABLE \"{TABLE_NAME}\"
        ADD COLUMN {NEW_COLUMN_NAME} VECTOR({VECTOR_DIMENSION});
        """
        cursor.execute(alter_query)
        print(f"Added pgvector column '{NEW_COLUMN_NAME}' with dimension {VECTOR_DIMENSION} to table '{TABLE_NAME}'.")

    except Exception as e:
        print("Error:", e)

    finally:
        # Close the cursor and connection
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == "__main__":
    add_pgvector_column()