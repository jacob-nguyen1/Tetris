import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [board, setBoard] = useState(Array.from({ length: 20 }, () => Array(10).fill(0)));
  const [activePieceTiles, setActivePieceTiles] = useState([[0,0], [0,0], [0,0], [0,0]]);
  const [activePiece, setActivePiece] = useState(0);
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
      default: return 0;
    }
  };

  const spawnPiece = () => {
    let x = Math.floor(Math.random() * 7);
    let pieceType = 0;
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
    if(activePieceTiles.some(tile => tile[0] === 19 || 
      (tile[0] + 1 < 20 &&
      board[tile[0]+1][tile[1]] !== 0 && 
      !activePieceTiles.some(([row, col]) => row === tile[0]+1 && col === tile[1])))) {
      spawnPiece()
    }
    else
    {
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
    }
  };

  const movePiece = (dir) => {
    switch(dir) {
      case 'left':
        if(!activePieceTiles.some((tile) => 
          tile[1] === 0
        ))
        {
          setBoard((prevBoard) => {
            let newBoard = prevBoard.map((row) => [...row]);
            let newActivePieceTiles = activePieceTiles.map(([row, col]) => [row, col - 1]);
            
          activePieceTiles.forEach(([row, col]) => {
              newBoard[row][col] = 0;
          });
      
            newActivePieceTiles.forEach(([row, col]) => {
              newBoard[row][col] = activePiece;
            });
      
            return newBoard;
          });
      
          setActivePieceTiles((prev) => prev.map(([row, col]) => [row, col - 1]));
        }
        return;
        
      case 'right':
        if(!activePieceTiles.some((tile) =>
          tile[1] === 9
        ))
        {
          setBoard((prevBoard) => {
            let newBoard = prevBoard.map((row) => [...row]);
            let newActivePieceTiles = activePieceTiles.map(([row, col]) => [row, col + 1]);
            
          activePieceTiles.forEach(([row, col]) => {
              newBoard[row][col] = 0;
          });
      
            newActivePieceTiles.forEach(([row, col]) => {
              newBoard[row][col] = activePiece;
            });
      
            return newBoard;
          });
      
          setActivePieceTiles((prev) => prev.map(([row, col]) => [row, col + 1]));
        }
        return;
      }
  }

  const hardDrop = () => {
    if(!activePiece) return;

    let newActivePieceTiles = activePieceTiles.map(([row, col]) => [row, col]);
    while(!newActivePieceTiles.some(tile => 
        tile[0] === 19 || 
        (tile[0] + 1 < 20 &&
        board[tile[0]+1][tile[1]] !== 0 && 
        !newActivePieceTiles.some(([row, col]) => row === tile[0]+1 && col === tile[1]))
    )) {
        newActivePieceTiles.forEach(tile =>
            tile[0]++
        );
    }

    setBoard((prevBoard) => {
      let newBoard = prevBoard.map((row) => [...row]);
      
      activePieceTiles.forEach(([row, col]) => {
        newBoard[row][col] = 0;
      });

      newActivePieceTiles.forEach(([row, col]) => {
        newBoard[row][col] = activePiece;
      });

      return newBoard;
    });

    spawnPiece();
    };

  const rotatePiece = (dir) => {
    let newActivePieceTiles = activePieceTiles.map(([row, col]) => [row, col]);
    switch(activePiece) {
      case "O":
        return;
      case "I":
        switch(rotation) {
          case 0:
            switch(dir) {
              case "right":
                newActivePieceTiles[0][0] -= 1; newActivePieceTiles[0][1] += 2;
                newActivePieceTiles[1][0] -= 0; newActivePieceTiles[1][1] += 1;
                newActivePieceTiles[2][0] += 1; newActivePieceTiles[2][1] -= 0;
                newActivePieceTiles[3][0] += 2; newActivePieceTiles[3][1] -= 1;
                setRotation(1);
          }
        }
    }
    setBoard((prevBoard) => {
      let newBoard = prevBoard.map((row) => [...row]);
      
      activePieceTiles.forEach(([row, col]) => {
        newBoard[row][col] = 0;
      });

      newActivePieceTiles.forEach(([row, col]) => {
        newBoard[row][col] = activePiece;
      });

      return newBoard;
    });

    setActivePieceTiles(newActivePieceTiles)
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch(event.key) {
        case ' ':
          spawnPiece();
          return;
        case 'ArrowUp':
          hardDrop();
          return;
        case 'ArrowLeft':
          movePiece('left');
          return;
        case 'ArrowRight':
          movePiece('right');
          return;
        case 'x':
          rotatePiece('right')
          return;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
        window.removeEventListener('keydown', handleKeyPress);
    };
}, [hardDrop, movePiece]);

  useEffect(() => {
    const interval = setInterval(() => {
      fallPiece();
    }, 500);

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
