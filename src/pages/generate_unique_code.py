import random
from string import ascii_uppercase

def generate_unique_code(active_game_rooms, digits):
    """Create random 4 digit room code that is not an existing room code"""
    while True:
        room_code = ""
        for _ in range(digits):
            room_code += random.choice(ascii_uppercase)
        if room_code not in active_game_rooms:
            break
    return room_code