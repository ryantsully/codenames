
import random
import json
from word_pool import word_pool
from generate_unique_code import generate_unique_code

def create_game_board(active_game_rooms):
    # Select 25 Game Words
    game_words = random.sample(word_pool, 25)
    colors = ["neutral"] * 9 + ["red"] * 7 + ["blue"] * 8 + ["black"]
    # Randomly assign the colors to the words
    random.shuffle(colors)
    # Generate a 4 digit code
    room = generate_unique_code(active_game_rooms, 4)
    words_and_values = {
            word: {
            "color": colors[i],
            "position": i + 1,
            "clicked": False
        }
        for i, word in enumerate(game_words)
    }
    word_color_mapping = {room: words_and_values}
    # word_color_mapping = {room: {"word_color_mapping": words_and_values, "bluescore": 0, "redscore": 0,
    #                              "currentTurn": "blue", "gameStarted": True, "gameOver": False,
    #                              "winnerMessage": ""}}
    return word_color_mapping
