import React, { useState, useEffect } from 'react';
import '../index.css';

const Wordle = () => {

    const [guessWord, setGuessWord] = useState('');

    const newWordleGame = () => {
        console.log("Create New Wordle Game!")
    }

    function saveWordCharacters(word) {
        if (word.length !== 5) {
            console.log("Guess Word:", word);
            console.log("Word must be exactly 5 characters long.");
            return;
        }
        var characters = {};
        for (var i = 0; i < word.length; i++) {
            var character = word.charAt(i);
            characters[i] = character;
        }
        console.log("Guess Word:", word);
        console.log(characters);
    }

    return (
        <div className="wordle">
            <h1>Wordle</h1>

            <h2>
                <label>GuessWord:</label>
                <input
                    className="input"
                    type="text"
                    required
                    value={guessWord}
                    maxLength={5}
                    onChange={(e) => setGuessWord(e.target.value)}
                />
            </h2>

            <div className='cells'>
                {guessWord.split('').map((character, index) => (
                    <div key={index} className='cell'>
                        {character}
                    </div>
                ))}
            </div>


            <div className='button'>
                <button onClick={() => saveWordCharacters(guessWord)}>Guess</button>
                <button onClick={newWordleGame}>New Game</button>
            </div>
        </div>
    );
};

export default Wordle;