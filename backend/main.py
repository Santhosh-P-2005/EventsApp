from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import uuid
import bcrypt 

app = Flask(__name__)
CORS(app)

db_config = {
    'host' : 'localhost',
    'user' : 'root',
    'password' : 'santhosh090405@',
    'database' : 'eventsapp'
}

def create_connection():
    connection = mysql.connector.connect(
        host = db_config['host'],
        user = db_config['user'],
        password = db_config['password'],
        database = db_config['database']
    )
    return connection

@app.route('/events', methods = ['GET'])
def get_evnets():
    connection = create_connection()
    cursor = connection.cursor(dictionary = True)

    cursor.execute("SELECT * FROM events")
    events = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(events)

@app.route('/events', methods = ['POST'])
def store_events():
    data = request.json
    Event_Name = data['event_name']
    Event_Date = data['event_date']
    Event_Poster = data['image']
    Event_Description= data['event_desc']

    id = str(uuid.uuid4())

    connection = create_connection()
    cursor = connection.cursor(dictionary = True)

    query = "INSERT INTO events (Event_Name,Event_Date,Event_Description,id,Event_Poster) VALUES (%s, %s, %s, %s, %s)"
    values = (Event_Name,Event_Date,Event_Description,id,Event_Poster)
    cursor.execute(query, values)

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({"result" : "Event added successfully"})

@app.route('/events/<string:id>', methods = ['PUT'])
def update_events(id):
    data = request.json
    Event_Name = data['event_name']
    Event_Date = data['event_date']
    Event_Description= data['event_desc']
    Event_Poster= data['image']

    connection = create_connection()
    cursor = connection.cursor(dictionary = True)

    query = "UPDATE events SET Event_Name = %s, Event_Date = %s, Event_Description = %s, Event_Poster = %s WHERE id = %s"
    values = (Event_Name,Event_Date,Event_Description,Event_Poster,id)
    cursor.execute(query, values)

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({"result" : "Event updated successfully"})

@app.route('/events/<string:id>', methods = ['GET'])
def fetch_one_event(id):
    connection = create_connection()
    cursor = connection.cursor(dictionary = True)

    query = 'SELECT * FROM events WHERE id = %s'
    cursor.execute(query,(id,))
    event = cursor.fetchone()

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify(event)

@app.route('/events/<string:id>', methods = ['DELETE'])
def delete_events(id):
    connection = create_connection()
    cursor = connection.cursor()

    query = 'DELETE FROM events WHERE id = %s'
    cursor.execute(query,(id,))

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({"result" : "Event deleted successfully"})

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user')  # Default to 'user' if role is not provided

    # Validate input
    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    # Check if email already exists
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    existing_user = cursor.fetchone()

    if existing_user:
        return jsonify({"error": "User with this email already exists"}), 409

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Insert the new user into the database
    id = str(uuid.uuid4())
    query = "INSERT INTO users (id, username, email, password, role) VALUES (%s, %s, %s, %s, %s)"
    cursor.execute(query, (id, username, email, hashed_password, role))
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({"message": "User registered successfully"}), 201

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Validate input
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    connection = create_connection()
    cursor = connection.cursor(dictionary=True)

    # Find the user by email
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Check if the password is correct
    if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({"error": "Invalid password"}), 401

    # Return success and role information
    return jsonify({
        "message": "Login successful",
        "role": user['role']
    }), 200

# Example of how to route based on role in frontend
@app.route('/role-check', methods=['POST'])
def role_check():
    data = request.json
    email = data.get('email')

    # Validate input
    if not email:
        return jsonify({"error": "Missing email"}), 400

    connection = create_connection()
    cursor = connection.cursor(dictionary=True)

    # Find the user by email
    cursor.execute("SELECT role FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "role": user['role']
    }), 200


if __name__ == '__main__':
    app.run(host = '0.0.0.0' , port=5000)