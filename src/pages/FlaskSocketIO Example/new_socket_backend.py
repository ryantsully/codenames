from flask import Flask, request, jsonify, session
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
CORS(app)
socketio = SocketIO(app, cors_allowed_origin="*")

@app.route('/')
def home():
    data = {'data': 'Home page'}
    return jsonify(data)

@socketio.on('connect')
def connected():
    print(request.sid)
    print("Client is connected")
    emit("connect", {
        "data":f"id:{request.sid} is connected"
    })

@socketio.on('disconnect')
def disconnected():
    print("User disconnected")
    emit("disconnect",
         f"user {request.sid} has been disconnected",broadcast=True)

@socketio.on('data')
def handle_message(data):
    print("Data from the front end: ", str(data))
    emit("data", {
        'data':data, 'id': request.sid},
        broadcast=True)

if __name__ == "__main__":
    socketio.run(app, debug=True, port=5001)