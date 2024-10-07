from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import uuid

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

    connection = create_connection()
    cursor = connection.cursor(dictionary = True)

    query = "UPDATE events SET Event_Name = %s, Event_Date = %s, Event_Description = %s WHERE id = %s"
    values = (Event_Name,Event_Date,Event_Description,id)
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

if __name__ == '__main__':
    app.run(host = '0.0.0.0' , port=5000)