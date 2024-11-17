import React, { useState, useEffect } from 'react';
import '../index.css';

import io from 'socket.io-client'


const CodeNames = () => {
  let [wordColorMapping, setWordColorMapping] = useState([]);
  let [words, setWords] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [clickedCells, setClickedCells] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('blue');
  const [blueScore, setBlueScore] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false);
  const [spymasterMode, setSpymasterMode] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winnerMessage, setWinnerMessage] = useState('');
  const [gameNotFound, setGameNotFound] = useState(false);
  const BLUE_WORD_COUNT = 8;
  const RED_WORD_COUNT = 7;
  const displayCode = '';

  const socket = io('http://127.0.0.1:5000');
  try {
    socket.on('update_word_color_mapping', (data) => {
      console.log("New activity found on server, refreshing stuff")
      console.log("Received from socket server")
      console.log(data)
      setWordColorMapping({ 'room_code': data['room_code'], 'word_color_mapping': data['word_color_mapping'] })
      setCurrentTurn(data['currentTurn'])
      setBlueScore(data['blueScore'])
      setRedScore(data['redScore'])
      setGameStarted(data['gameStarted'])
      setGameOver(data['gameOver'])
      setWinnerMessage(data['winnerMessage'])
      setJoinCode(data['room_code'])
    })
  }
  catch (error) {
    console.log("Failed to refresh data from server")
  };

  const createGame = async () => {
    console.log("Create new game")
    try {
      setGameNotFound(false)
      const response = await fetch(`http://127.0.0.1:5000/create_new_game`)
      if (!response) {
        throw new Error('Create game didnt work')
      }
      const data = await response.json();
      console.log("New game data received from server", data)
      setWordColorMapping(data);
    }
    catch (error) {
      console.log("There was an error with create new game")
    }
  }

  const createSubsequentGame = async (joinCode) => {
    console.log("Create sub game")
    setJoinCode(joinCode)
    try {
      setGameNotFound(false)
      const response = await fetch(`http://127.0.0.1:5000/create_subsequent_game/${joinCode}`)
      if (!response) {
        throw new Error('Create game didnt work')
      }
      const data = await response.json();
      console.log("New game data received from server", data)
      setWordColorMapping(data);
    }
    catch (error) {
      console.log("There was an error with create new game")
    }
  }

  const joinGame = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/join_game/${joinCode}`)
      if (!response) {
        throw new Error('Join didnt work')
      }
      const data = await response.json();
      console.log(data)
      setGameNotFound(false);
      setGameStarted(true);
      setWordColorMapping(data);
    }
    catch (error) {
      console.log("There was an error with join game")
      setGameNotFound(true)
    }
  }

  const updateGridOnServer = async (updatedWordColorMapping) => {
    console.log("updateGridOnServer begun")
    try {
      const response = await fetch(`http://127.0.0.1:5000/click_event/${updatedWordColorMapping['room_code']}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          {
            word_color_mapping: updatedWordColorMapping['word_color_mapping'],
            blueScore: updatedWordColorMapping['blueScore'],
            redScore: updatedWordColorMapping['redScore'],
            currentTurn: updatedWordColorMapping['currentTurn'],
            gameStarted: updatedWordColorMapping['gameStarted'],
            gameOver: updatedWordColorMapping['gameOver'],
            winnerMessage: updatedWordColorMapping['winnerMessage'],
            room_code: joinCode,
            clicked_cells: clickedCells
          }
        )
      })
      console.log("updateGridOnServer completed")
    }
    catch (error) {
      console.log("There was an error with retrieving updated grid from server")
    }
  }

  useEffect(() => {
    if (wordColorMapping.length !== 0) {
      console.log("useEffect triggered")
      console.log(wordColorMapping)
      setWords(Object.keys(wordColorMapping['word_color_mapping']))
      setJoinCode(wordColorMapping["room_code"])
      setWordColorMapping(wordColorMapping)
    }
  }, [wordColorMapping]);

  useEffect(() => {
    if (clickedCells.length !== 0 && joinCode.length !== 0 && wordColorMapping.length !== 0) {
      console.log("Second useEffect triggered")
      wordColorMapping['blueScore'] = blueScore
      wordColorMapping['redScore'] = redScore
      wordColorMapping['currentTurn'] = currentTurn
      wordColorMapping['gameStarted'] = gameStarted
      wordColorMapping['gameOver'] = gameOver
      wordColorMapping['winnerMessage'] = winnerMessage
      wordColorMapping['room_code'] = joinCode
      setWords(Object.keys(wordColorMapping['word_color_mapping']))
      updateGridOnServer(wordColorMapping)
    }
  }, [blueScore, redScore, currentTurn, gameStarted, gameOver, winnerMessage]);

  useEffect(() => {
    if (joinCode !== '') {
      socket.emit('join-room', joinCode)
    }
  }, [joinCode])


  function getKeyByPosition(obj, position) {
    for (const key in obj) {
      if (obj[key].position === position) {
        return key;
      }
    }
    return null;
  }

  function createGrid(wordColorMapping) {
    console.log(wordColorMapping)
    if (wordColorMapping !== null) {
      const numRows = 5;
      const numColumns = 5;
      let grid = [];
      for (let row = 0; row < numRows; row++) {     // Loop through the rows
        let rowCells = [];
        for (let column = 0; column < numColumns; column++) {
          let key = (row + 1) + (column * 5)
          let word = getKeyByPosition(wordColorMapping['word_color_mapping'], key)
          // CANNOT READ PROPERTIES OF UNDEFINED 'color'
          let color = wordColorMapping['word_color_mapping'][word]['color']
          let clicked = wordColorMapping['word_color_mapping'][word]['clicked']
          let cellStyle = {
            backgroundColor: 'white',
            boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
          };
          if (spymasterMode || clicked) {
            cellStyle.backgroundColor =
              color === 'neutral' ? (color === 'black' ? 'black' : 'lightgrey') : color;
            cellStyle.color = color === 'neutral' ? 'black' : 'white';
          }
          const cell = <div key={key}
            className="box"
            style={cellStyle}
            onClick={() => handleCellClick(key)}>
            {word}</div>; // Create a cell
          rowCells.push(cell); //Add Cell to row
        }
        grid.push(rowCells); //Add row to grid
      }
      return grid
    }
  }

  const handleCellClick = (index) => {
    if (gameOver || spymasterMode || clickedCells[index]) {
      console.log("cell", index, "clicked! Do nothing since game over, spymaster mode, or cell already clicked")
      return;
    }
    let word = getKeyByPosition(wordColorMapping['word_color_mapping'], index)
    let color = wordColorMapping['word_color_mapping'][word].color
    wordColorMapping['word_color_mapping'][word].clicked = true
    console.log("Click event detected")
    if (color === 'black') {
      if (currentTurn === 'blue') {
        setWinner('red');
        setWinnerMessage('Red Wins!');
        setGameOver(true);
      }
      else {
        setWinner('blue');
        setWinnerMessage('Blue Wins!');
        setGameOver(true);
      }
      setGameOver(true);
    }
    else if (color === 'blue') {
      setBlueScore(blueScore + 1);
      if (blueScore + 1 === BLUE_WORD_COUNT) {
        setWinner('blue');
        setWinnerMessage('Blue Wins!');
        setGameOver(true);
        updateGridOnServer(wordColorMapping)
      }
    }
    else if (color === 'red') {
      setRedScore(redScore + 1);
      if (redScore + 1 === RED_WORD_COUNT) {
        setWinner('red');
        setWinnerMessage('Red Wins!');
        setGameOver(true);
        updateGridOnServer(wordColorMapping)
      }
    }
    if (currentTurn !== color && color !== 'black') {
      setCurrentTurn((prevTurn) => (prevTurn === 'blue' ? 'red' : 'blue'));
    }
    setClickedCells(index)
  };

  const handleNewGame = async () => {
    setClickedCells([])
    setWords([]);
    setCurrentTurn('blue');
    setBlueScore(0);
    setRedScore(0);
    setGameOver(false);
    setGameStarted(true);
    setGameNotFound(false)
    {
      !gameStarted &&
        createGame()
    }
    {
      gameStarted &&
        createSubsequentGame(joinCode)
    }
  };

  const handleJoinGame = async () => {
    setGameNotFound(false)
    joinGame(joinCode)
  };

  const handleToggleSpymasterMode = () => {
    setSpymasterMode(!spymasterMode);
  };

  const endTurn = () => {
    if (currentTurn == 'red') {
      setCurrentTurn('blue')
    }
    else { setCurrentTurn('red') }
  }

  const leaveGame = () => {
    setGameStarted(false)
    setJoinCode('')
  }

  const calculateRemainingWords = (teamScore, totalWords) => {
    return totalWords - teamScore;
  };

  const remainingBlueWords = calculateRemainingWords(blueScore, BLUE_WORD_COUNT);
  const remainingRedWords = calculateRemainingWords(redScore, RED_WORD_COUNT);

  return (

    <div className="codenames">

      {!gameStarted &&
        <div className="pregame">
          <h1>Code Names</h1>
          <div className="pregame-buttons">
            <button onClick={handleNewGame}>Create Game</button>
            <div className="join-game">
              <button onClick={handleJoinGame}>Join Game</button>
              <input className="input" type="text" placeholder="Code" name="code" value={joinCode} onChange={(e) => setJoinCode(e.target.value)}
              />
            </div>
          </div>
        </div>
      }

      {gameNotFound && !gameStarted &&
        <div className="gamenotfound"> Game {displayCode} Not found! </div>}

      {gameStarted &&
        <div>
          <div className="gameinfo">
            <h4>
              Game Room: {joinCode}<br />
              Blue: {remainingBlueWords} | Red: {remainingRedWords}<br />

              {currentTurn === "red" && !gameOver &&

                <div className='turn-indicator'>
                  Turn: <div className="red"> {currentTurn}
                  </div>
                </div>
              }
              {currentTurn === "blue" && !gameOver &&
                <div className='turn-indicator'>
                  Turn: <div className="blue"> {currentTurn}
                  </div>
                </div>

              }
              {gameOver && winner === "red" && <div className='turn-indicator'>
                <div className="red"> {winnerMessage}</div>
              </div>}
              {gameOver && winner === "blue" && <div className='turn-indicator'>
                <div className="blue"> {winnerMessage}</div>
              </div>}

            </h4>
          </div>
          <div />

          <div className="codenames-board">
            {words.length === 25 &&
              <div className="codenames-grid">{createGrid(wordColorMapping)}</div>
            }
          </div>

          <div className="buttongroup">
            <button onClick={handleNewGame}>New Game</button>
            <button onClick={handleToggleSpymasterMode}>Spymaster Mode</button>
            <button onClick={endTurn}>End Turn</button>
            <button onClick={leaveGame}>Leave Room</button>
          </div>
        </div>
      }
    </div >
  );
};

export default CodeNames;
