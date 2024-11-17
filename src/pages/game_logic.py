from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room, send, emit
from create_game_board import create_game_board

app = Flask(__name__)
app.config["SECRET_KEY"] = "asga"
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

active_game_rooms = {}
room = ""

# class WordColorMapping:
#     def __init__(self, room_code, word_info, blue_score, red_score, current_turn, game_started, winner_message):
#         self.room_code =room_code
#         self.word_info = word_info
#         self.blue_score = blue_score
#         self.red_score = red_score
#         self.current_turn = current_turn
#         self.game_started = game_started
#         self.winner_message = winner_message


def updatedRoom(data):
    room = data
    return room


def emitToRoom(room_code, word_color_mapping):
    socketio.emit(
        "update_word_color_mapping",
        {
            "room_code": room_code,
            "word_color_mapping": word_color_mapping,
            #    "blueScore": 0,
            #    "redScore": 0,
            #    "currentTurn": 'blue',
            #    "gameStarted": True,
            #    "gameOver": False,
            #    "winnerMessage": '',
        },
        to=room_code,
    )


@app.route("/", methods=["POST", "GET"])
def home():
    session.clear()
    return "Welcome to the Code Names game!"


@app.route("/create_new_game", methods=["GET"])
def create_new_game():
    word_color_mapping_dict = create_game_board(active_game_rooms)
    active_game_rooms.update(word_color_mapping_dict)
    room_code = list(word_color_mapping_dict.keys())[0]
    word_color_mapping = word_color_mapping_dict[room_code]
    print("Create New game")
    print(word_color_mapping)
    return jsonify({"word_color_mapping": word_color_mapping, "room_code": room_code})


@app.route("/create_subsequent_game/<inputted_room_code>", methods=["GET"])
def create_subsequent_game(inputted_room_code):
    print("Creating Subsequent Game!!!")
    print(inputted_room_code)
    word_color_mapping_dict = create_game_board(active_game_rooms)
    given_room_code = list(word_color_mapping_dict.keys())[0]
    new_word_mappings = word_color_mapping_dict.get(given_room_code)
    active_game_rooms[inputted_room_code] = new_word_mappings
    print("Create Sub Game")
    print(new_word_mappings)
    socketio.emit(
        "update_word_color_mapping",
        {
            "room_code": inputted_room_code,
            "word_color_mapping": new_word_mappings,
            "blueScore": 0,
            "redScore": 0,
            "currentTurn": "blue",
            "gameStarted": True,
            "gameOver": False,
            "winnerMessage": "",
        },
        to=inputted_room_code,
    )
    return jsonify(
        {"word_color_mapping": new_word_mappings, "room_code": inputted_room_code}
    )


@app.route("/join_game/<inputted_room_code>", methods=["GET"])
def join_game(inputted_room_code):
    word_color_mapping = active_game_rooms[inputted_room_code]
    print(word_color_mapping)
    return jsonify(
        {"word_color_mapping": word_color_mapping, "room_code": inputted_room_code}
    )


@socketio.on("join-room")
def join_a_room(joinCode):
    session["room"] = joinCode
    join_room(joinCode)


@app.route("/click_event/<inputted_room_code>", methods=["POST", "GET"])
def update_word_color_mapping(inputted_room_code):
    data = request.get_json()
    print(data["room_code"])
    room = data["room_code"]
    print("Room from update_word_color_mapping", room)
    word_color_mapping = data["word_color_mapping"]
    blue_score = data["blueScore"]
    red_score = data["redScore"]
    current_turn = data["currentTurn"]
    game_started = data["gameStarted"]
    game_over = data["gameOver"]
    winner_message = data["winnerMessage"]
    room_code = data["room_code"]
    active_game_rooms[inputted_room_code] = data
    print(
        f"Successfully updated active game rooms. Time to emit data to room {inputted_room_code}"
    )
    print(word_color_mapping)
    socketio.emit(
        "update_word_color_mapping",
        {
            "room_code": inputted_room_code,
            "word_color_mapping": word_color_mapping,
            "blueScore": blue_score,
            "redScore": red_score,
            "currentTurn": current_turn,
            "gameStarted": game_started,
            "gameOver": game_over,
            "winnerMessage": winner_message,
        },
        to=inputted_room_code,
    )
    return jsonify(
        {"word_color_mapping": word_color_mapping, "room_code": inputted_room_code}
    )


if __name__ == "__main__":
    socketio.run(app, debug=True)
