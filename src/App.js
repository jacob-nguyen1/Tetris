import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [board, setBoard] = useState(Array.from({ length: 20 }, () => Array(10).fill(0)));
  const [activePieceTiles, setActivePieceTiles] = useState([[0,0], [0,0], [0,0], [0,0]]);
  const [activePiece, setActivePiece] = useState('');
  const [rotation, setRotation] = useState(0);

  const getColor = (num) => {
    switch (num) {
      case 0: return 'blank';
      case 'O': return 'yellow';
      case 'I': return 'lightblue';
      case 'S': return 'lightgreen';
      case 'Z': return 'red';
      case 'J': return 'blue';
      case 'L': return 'orange';
      case 'T': return 'purple';
      default: return '';
    }
  };

  const spawnPiece = () => {
    let x = Math.floor(Math.random() * 7);
    let pieceType = '';
    let tiles = [];

    switch(x) {
      case 0:
        pieceType = 'O';
        tiles = [[0, 4], [0, 5], [1, 4], [1, 5]];
        break;
      case 1:
        pieceType = 'I';
        tiles = [[0, 3], [0, 4], [0, 5], [0, 6]];
        break;
      case 2:
        pieceType = 'S';
        tiles = [[0, 3], [0, 4], [1, 4], [1, 5]];
        break;
      case 3:
        pieceType = 'Z';
        tiles = [[0, 4], [0, 5], [1, 3], [1, 4]];
        break;
      case 4:
        pieceType = 'J';
        tiles = [[0, 5], [1, 3], [1, 4], [1, 5]];
        break;
      case 5:
        pieceType = 'L';
        tiles = [[0, 3], [1, 3], [1, 4], [1, 5]];
        break;
      case 6:
        pieceType = 'T';
        tiles = [[0, 4], [1, 3], [1, 4], [1, 5]];
        break;
      default:
        break;
    }

    setBoard(prevBoard => {
      let newBoard = prevBoard.map(row => [...row]);

      tiles.forEach(([row, col]) => {
        newBoard[row][col] = pieceType;
      });

      return newBoard;
    });

    setActivePiece(pieceType);
    setActivePieceTiles(tiles);
    setRotation(0);
  };

  const fallPiece = () => {
    setBoard((prevBoard) => {
      let newBoard = prevBoard.map((row) => [...row]);
      let newActivePieceTiles = activePieceTiles.map(([row, col]) => [row + 1, col]);

      activePieceTiles.forEach(([row, col]) => {
        newBoard[row][col] = 0;
      });

      newActivePieceTiles.forEach(([row, col]) => {
        newBoard[row][col] = activePiece;
      });

      return newBoard;
    });

    setActivePieceTiles((prev) => prev.map(([row, col]) => [row + 1, col]));
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
        if (event.key === 'ArrowUp') {
            spawnPiece();
        }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
        window.removeEventListener('keydown', handleKeyPress);
    };
}, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fallPiece();
    }, 1000);

    return () => clearInterval(interval);
  }, [fallPiece]);

  return (
    <div className="App">
      <div className="Board">
        {board.map((row, i) => (
          row.map((cell, j) => (
            <div key={`${i}-${j}`} className={`Tile ${getColor(cell)}`} />
          ))
        ))}
      </div>
    </div>
  );
}

export default App;
