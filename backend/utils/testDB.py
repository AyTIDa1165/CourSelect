from db_pool import get_connection, release_connection

def fetch_data_from_table():
    try:
        # Get a connection from the pool
        connection = get_connection()
        cursor = connection.cursor()

        # Fetch data
        cursor.execute('''SELECT column_name
                        FROM information_schema.columns
                        WHERE table_name = 'Review';
                        ''')
        rows = cursor.fetchall()
        print("Service 1 - Data from table:")
        print(rows)

    except Exception as e:
        print("Service 1 - Error:", e)

    finally:
        # Release the connection back to the pool
        if connection:
            release_connection(connection)

if __name__ == "__main__":
    fetch_data_from_table()
