from psycopg2.pool import SimpleConnectionPool

# Database configuration
DB_CONFIG = {
    "minconn": 1,
    "maxconn": 5,
    "user": "postgres",
    "password": "mysecretpassword",
    "host": "localhost",
    "port": "5432",
    "database": "CourselectDB"
}

# Create the connection pool
connection_pool = SimpleConnectionPool(
    minconn=DB_CONFIG["minconn"],
    maxconn=DB_CONFIG["maxconn"],
    user=DB_CONFIG["user"],
    password=DB_CONFIG["password"],
    host=DB_CONFIG["host"],
    port=DB_CONFIG["port"],
    database=DB_CONFIG["database"]
)

def get_connection():
    """Fetch a connection from the pool."""
    return connection_pool.getconn()

def release_connection(connection):
    """Return the connection to the pool."""
    connection_pool.putconn(connection)

def close_pool():
    """Close all connections in the pool."""
    connection_pool.closeall()
