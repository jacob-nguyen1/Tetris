const board = Array(21).fill().map(() => Array(10).fill(0));
const boardDisplay = Array(21).fill().map(() => Array(10).fill(null));
const boardElement = document.querySelector('.board');

let activePieceTiles = [[-1,-1],[-1,-1],[-1,-1],[-1,-1]];
let activePiece = -1;
let rotation = 0;

let pieces = ['O', 'I', 'S', 'Z', 'J', 'L', 'T'];
let bag = [];
let hold = '';
let canHold = true;

/*
TO DO

- soft drop
- ARR DAS and the other one
- hold piece
- next pieces
- clear lines
- death screen
- SRS spins???
*/

let fallPieceTimer;

const startTimer = () => {
    fallPieceTimer = setInterval(() => {
        fallPiece();
        updateBoard();
    }, 500)
}

const resetTimer = () => {
    clearInterval(fallPieceTimer);
    startTimer();
}

for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 10; c++) {
        const tile = document.createElement('div');
        if (r === 0){
            tile.className = 'tile top-row';
        } else {
            tile.className = 'tile none';
        }
        boardElement.appendChild(tile);
        boardDisplay[r][c] = tile;
    }
}

const updateBoard = () => {
    for (let r = 0; r < 21; r++) {
        for (let c = 0; c < 10; c++) {
            if (r === 0) {
                boardDisplay[r][c].className = 'tile ' + (board[r][c] === 0 ? 'top-row' : board[r][c])
            } else {
                boardDisplay[r][c].className = 'tile ' + (board[r][c] === 0 ? 'none' : board[r][c])
            }
        }      
    }
}

const clearBoard = () => {
    for (let r = 0; r < 21; r++) {
        for (let c = 0; c < 10; c++) {
            board[r][c] = 0;
        }      
    }
    
    activePieceTiles = [[-1,-1],[-1,-1],[-1,-1],[-1,-1]];
    activePiece = -1;
    rotation = 0;
    bag = []
}

const spawnNextPiece = () => {
    if (bag.length > 0) {
        spawnPiece(bag.pop())
    } else {
        bag = [...pieces]

        for (let i = bag.length - 1; i > 0; i--) { 
            const j = Math.floor(Math.random() * (i + 1));
            const temp = bag[i];
            bag[i] = bag[j];
            bag[j] = temp;
        }
        spawnPiece(bag.pop())
    }
    canHold = true;
}

const spawnPiece = (piece) => {
    switch(piece) {
      case 'O':
        tiles = [[1, 4], [1, 5], [2, 5], [2, 4]];
        break;
      case 'I':
        tiles = [[1, 3], [1, 4], [1, 5], [1, 6]];
        break;
      case 'S':
        tiles = [[2, 3], [2, 4], [1, 4], [1, 5]];
        break;
      case 'Z':
        tiles = [[1, 3], [1, 4], [2, 4], [2, 5]];
        break;
      case 'J':
        tiles = [[1, 3], [2, 3], [2, 4], [2, 5]];
        break;
      case 'L':
        tiles = [[2, 3], [2, 4], [2, 5], [1, 5]];
        break;
      case 'T':
        tiles = [[1, 4], [2, 3], [2, 4], [2, 5]];
        break;
    }

    activePiece = piece
    activePieceTiles = tiles;
    activePieceTiles.forEach(([r, c]) =>
        board[r][c] = piece
    );

    rotation = 0;
};

const fallPiece = () => {
    if (activePieceTiles.some(([r,c]) => 
        r === 20 ||
        (board[r+1][c] !== 0 &&
        !activePieceTiles.some(([r_,c_]) => r_ === r+1 && c_ === c)
        ))) {
        clearLines();
        spawnNextPiece();
    } else {
        activePieceTiles.forEach(([r,c]) => 
            board[r][c] = 0
        )
    
        activePieceTiles.forEach(([r,c]) => 
            board[r+1][c] = activePiece
        )
    
        activePieceTiles = activePieceTiles.map(([r,c]) => [r+1,c])
    }
}

const movePiece = (dir) => {
    switch (dir) {
        case "left":
            if (!activePieceTiles.some(([r,c]) => c === 0 ||
            (board[r][c-1] !== 0 &&
                !activePieceTiles.some(([r_,c_]) => r_ === r && c_ === c-1)
            ))) {
                activePieceTiles.forEach(([r,c]) => 
                    board[r][c] = 0
                )
                activePieceTiles.forEach(([r,c]) => 
                    board[r][c-1] = activePiece
                );
                activePieceTiles = activePieceTiles.map(([r,c]) => [r,c-1])
                if (activePieceTiles.some(([r,c]) => 
                    r === 20 ||
                    (board[r+1][c] !== 0 &&
                    !activePieceTiles.some(([r_,c_]) => r_ === r+1 && c_ === c)
                    ))) {
                    resetTimer();
                }
            }
            break;
        case "right":
            if (!activePieceTiles.some(([r,c]) => c === 9 ||
            (board[r][c+1] !== 0 &&
                !activePieceTiles.some(([r_,c_]) => r_ === r && c_ === c+1)
            ))) {
                activePieceTiles.forEach(([r,c]) => 
                    board[r][c] = 0
                )
                activePieceTiles.forEach(([r,c]) => 
                    board[r][c+1] = activePiece
                );
                activePieceTiles = activePieceTiles.map(([r,c]) => [r,c+1])
                if (activePieceTiles.some(([r,c]) => 
                    r === 20 ||
                    (board[r+1][c] !== 0 &&
                    !activePieceTiles.some(([r_,c_]) => r_ === r+1 && c_ === c)
                    ))) {
                    resetTimer();
                }
            }
            break;
    }
}

const hardDrop = () => {
    while (!activePieceTiles.some(([r,c]) => 
        r === 20 ||
        (board[r+1][c] !== 0 &&
        !activePieceTiles.some(([r_,c_]) => r_ === r+1 && c_ === c)
        ))) {

        activePieceTiles.forEach(([r,c]) => 
            board[r][c] = 0
        );
        
        activePieceTiles = activePieceTiles.map(([r,c]) => [r+1, c]);
        
        activePieceTiles.forEach(([r,c]) => 
            board[r][c] = activePiece
        );
    }
    clearLines();
    spawnNextPiece();
}

const softDrop = () => {
    let a = activePieceTiles[0][0]
    while (!activePieceTiles.some(([r,c]) => 
        r === 20 ||
        (board[r+1][c] !== 0 &&
        !activePieceTiles.some(([r_,c_]) => r_ === r+1 && c_ === c)
        ))) {

        activePieceTiles.forEach(([r,c]) => 
            board[r][c] = 0
        );
        
        activePieceTiles = activePieceTiles.map(([r,c]) => [r+1, c]);
        
        activePieceTiles.forEach(([r,c]) => 
            board[r][c] = activePiece
        );
        b = activePieceTiles[0][0]
    }
    if (a !== b) {
        resetTimer();
    }
}

const rotatePiece = (dir) => {
    let a = JSON.parse(JSON.stringify(activePieceTiles));
    let r = rotation

    switch(activePiece) {
        case "O":
            break;
        case "I":
            switch(rotation) {
                case 0:
                    switch(dir){
                        case "right":
                            a[0][0] -= 1; a[0][1] += 2;
                            a[1][0] -= 0; a[1][1] += 1;
                            a[2][0] += 1; a[2][1] -= 0;
                            a[3][0] += 2; a[3][1] -= 1;
                            rotation = 1;
                            break;
                        case "left":
                            a[0][0] += 2; a[0][1] += 1;
                            a[1][0] += 1; a[1][1] += 0;
                            a[2][0] += 0; a[2][1] -= 1;
                            a[3][0] -= 1; a[3][1] -= 2;
                            rotation = 3;
                            break;
                    }
                    break;
                case 1:
                    switch(dir){
                        case "right":
                            a[0][0] += 2; a[0][1] += 1;
                            a[1][0] += 1; a[1][1] += 0;
                            a[2][0] += 0; a[2][1] -= 1;
                            a[3][0] -= 1; a[3][1] -= 2;
                            rotation = 2;
                            break;
                        case "left":
                            a[0][0] += 1; a[0][1] -= 2;
                            a[1][0] -= 0; a[1][1] -= 1;
                            a[2][0] -= 1; a[2][1] += 0;
                            a[3][0] -= 2; a[3][1] += 1;
                            rotation = 0;
                            break;
                    }
                    break;
                case 2:
                    switch(dir){
                        case "right":
                            a[0][0] += 1; a[0][1] -= 2;
                            a[1][0] -= 0; a[1][1] -= 1;
                            a[2][0] -= 1; a[2][1] += 0;
                            a[3][0] -= 2; a[3][1] += 1;
                            rotation = 3;
                            break;
                        case "left":
                            a[0][0] -= 2; a[0][1] -= 1;
                            a[1][0] -= 1; a[1][1] += 0;
                            a[2][0] += 0; a[2][1] += 1;
                            a[3][0] += 1; a[3][1] += 2;
                            rotation = 1;
                            break;
                    }
                    break;
                case 3:
                    switch(dir){
                        case "right":
                            a[0][0] -= 2; a[0][1] -= 1;
                            a[1][0] -= 1; a[1][1] -= 0;
                            a[2][0] -= 0; a[2][1] += 1;
                            a[3][0] += 1; a[3][1] += 2;
                            rotation = 0;
                            break;
                        case "left":
                            a[0][0] -= 1; a[0][1] += 2;
                            a[1][0] += 0; a[1][1] += 1;
                            a[2][0] += 1; a[2][1] += 0;
                            a[3][0] += 2; a[3][1] -= 1;
                            rotation = 2;
                            break;
                    }
                    break;
            }
            break;
        case "S":
            switch(rotation) {
                case 0:
                    switch(dir){
                        case "right":
                            a[0][0] -= 1; a[0][1] += 1;
                            a[2][0] += 1; a[2][1] += 1;
                            a[3][0] += 2; a[3][1] += 0;
                            rotation = 1;
                            break;
                        case "left":
                            a[0][0] += 1; a[0][1] += 1;
                            a[2][0] += 1; a[2][1] -= 1;
                            a[3][0] -= 0; a[3][1] -= 2;
                            rotation = 3;
                            break;
                    }
                    break;
                case 1:
                    switch(dir){
                        case "right":
                            a[0][0] += 1; a[0][1] += 1;
                            a[2][0] += 1; a[2][1] -= 1;
                            a[3][0] += 0; a[3][1] -= 2;
                            rotation = 2;
                            break;
                        case "left":
                            a[0][0] += 1; a[0][1] -= 1;
                            a[2][0] -= 1; a[2][1] -= 1;
                            a[3][0] -= 2; a[3][1] -= 0;
                            rotation = 0;
                            break;
                    }
                    break;
                case 2:
                    switch(dir){
                        case "right":
                            a[0][0] += 1; a[0][1] -= 1;
                            a[2][0] -= 1; a[2][1] -= 1;
                            a[3][0] -= 2; a[3][1] -= 0;
                            rotation = 3;
                            break;
                        case "left":
                            a[0][0] -= 1; a[0][1] -= 1;
                            a[2][0] -= 1; a[2][1] += 1;
                            a[3][0] += 0; a[3][1] += 2;
                            rotation = 1;
                            break;
                    }
                    break;
                case 3:
                    switch(dir){
                        case "right":
                            a[0][0] -= 1; a[0][1] -= 1;
                            a[2][0] -= 1; a[2][1] += 1;
                            a[3][0] += 0; a[3][1] += 2;
                            rotation = 0;
                            break;
                        case "left":
                            a[0][0] -= 1; a[0][1] += 1;
                            a[2][0] += 1; a[2][1] += 1;
                            a[3][0] += 2; a[3][1] += 0;
                            rotation = 2;
                            break;
                    }
                    break;
            }
            break;
        case "Z":
            switch(rotation) {
                case 0:
                    switch(dir){
                        case "right":
                            a[0][0] -= 0; a[0][1] += 2;
                            a[1][0] += 1; a[1][1] += 1;
                            a[3][0] += 1; a[3][1] -= 1;
                            rotation = 1;
                            break;
                        case "left":
                            a[0][0] += 2; a[0][1] += 0;
                            a[1][0] += 1; a[1][1] -= 1;
                            a[3][0] -= 1; a[3][1] -= 1;
                            rotation = 3;
                            break;
                    }
                    break;
                case 1:
                    switch(dir){
                        case "right":
                            a[0][0] += 2; a[0][1] += 0;
                            a[1][0] += 1; a[1][1] -= 1;
                            a[3][0] -= 1; a[3][1] -= 1;
                            rotation = 2;
                            break;
                        case "left":
                            a[0][0] -= 0; a[0][1] -= 2;
                            a[1][0] -= 1; a[1][1] -= 1;
                            a[3][0] -= 1; a[3][1] += 1;
                            rotation = 0;
                            break;
                    }
                    break;
                case 2:
                    switch(dir){
                        case "right":
                            a[0][0] -= 0; a[0][1] -= 2;
                            a[1][0] -= 1; a[1][1] -= 1;
                            a[3][0] -= 1; a[3][1] += 1;
                            rotation = 3;
                            break;
                        case "left":
                            a[0][0] -= 2; a[0][1] -= 0;
                            a[1][0] -= 1; a[1][1] += 1;
                            a[3][0] += 1; a[3][1] += 1;
                            rotation = 1;
                            break;
                    }
                    break;
                case 3:
                    switch(dir){
                        case "right":
                            a[0][0] -= 2; a[0][1] -= 0;
                            a[1][0] -= 1; a[1][1] += 1;
                            a[3][0] += 1; a[3][1] += 1;
                            rotation = 0;
                            break;
                        case "left":
                            a[0][0] -= 0; a[0][1] += 2;
                            a[1][0] += 1; a[1][1] += 1;
                            a[3][0] += 1; a[3][1] -= 1;
                            rotation = 2;
                            break;
                    }
                    break;
            }
            break;
        case "J":
            switch(rotation) {
                case 0:
                    switch(dir){
                        case "right":
                            a[0][0] -= 0; a[0][1] += 2;
                            a[1][0] -= 1; a[1][1] += 1;
                            a[3][0] += 1; a[3][1] -= 1;
                            rotation = 1;
                            break;
                        case "left":
                            a[0][0] += 2; a[0][1] += 0;
                            a[1][0] += 1; a[1][1] += 1;
                            a[3][0] -= 1; a[3][1] -= 1;
                            rotation = 3;
                            break;
                    }
                    break;
                case 1:
                    switch(dir){
                        case "right":
                            a[0][0] += 2; a[0][1] += 0;
                            a[1][0] += 1; a[1][1] += 1;
                            a[3][0] -= 1; a[3][1] -= 1;
                            rotation = 2;
                            break;
                        case "left":
                            a[0][0] -= 0; a[0][1] -= 2;
                            a[1][0] += 1; a[1][1] -= 1;
                            a[3][0] -= 1; a[3][1] += 1;
                            rotation = 0;
                            break;
                    }
                    break;
                case 2:
                    switch(dir){
                        case "right":
                            a[0][0] -= 0; a[0][1] -= 2;
                            a[1][0] += 1; a[1][1] -= 1;
                            a[3][0] -= 1; a[3][1] += 1;
                            rotation = 3;
                            break;
                        case "left":
                            a[0][0] -= 2; a[0][1] -= 0;
                            a[1][0] -= 1; a[1][1] -= 1;
                            a[3][0] += 1; a[3][1] += 1;
                            rotation = 1;
                            break;
                    }
                    break;
                case 3:
                    switch(dir){
                        case "right":
                            a[0][0] -= 2; a[0][1] -= 0;
                            a[1][0] -= 1; a[1][1] -= 1;
                            a[3][0] += 1; a[3][1] += 1;
                            rotation = 0;
                            break;
                        case "left":
                            a[0][0] -= 0; a[0][1] += 2;
                            a[1][0] -= 1; a[1][1] += 1;
                            a[3][0] += 1; a[3][1] -= 1;
                            rotation = 2;
                            break;
                    }
                    break;
            }
            break;
        case "L":
            switch(rotation) {
                case 0:
                    switch(dir){
                        case "right":
                            a[0][0] -= 1; a[0][1] += 1;
                            a[2][0] += 1; a[2][1] -= 1;
                            a[3][0] += 2; a[3][1] += 0;
                            rotation = 1;
                            break;
                        case "left":
                            a[0][0] += 1; a[0][1] += 1;
                            a[2][0] -= 1; a[2][1] -= 1;
                            a[3][0] -= 0; a[3][1] -= 2;
                            rotation = 3;
                            break;
                    }
                    break;
                case 1:
                    switch(dir){
                        case "right":
                            a[0][0] += 1; a[0][1] += 1;
                            a[2][0] -= 1; a[2][1] -= 1;
                            a[3][0] += 0; a[3][1] -= 2;
                            rotation = 2;
                            break;
                        case "left":
                            a[0][0] += 1; a[0][1] -= 1;
                            a[2][0] -= 1; a[2][1] += 1;
                            a[3][0] -= 2; a[3][1] += 0;
                            rotation = 0;
                            break;
                    }
                    break;
                case 2:
                    switch(dir){
                        case "right":
                            a[0][0] += 1; a[0][1] -= 1;
                            a[2][0] -= 1; a[2][1] += 1;
                            a[3][0] -= 2; a[3][1] -= 0;
                            rotation = 3;
                            break;
                        case "left":
                            a[0][0] -= 1; a[0][1] -= 1;
                            a[2][0] += 1; a[2][1] += 1;
                            a[3][0] += 0; a[3][1] += 2;
                            rotation = 1;
                            break;
                    }
                    break;
                case 3:
                    switch(dir){
                        case "right":
                            a[0][0] -= 1; a[0][1] -= 1;
                            a[2][0] += 1; a[2][1] += 1;
                            a[3][0] += 0; a[3][1] += 2;
                            rotation = 0;
                            break;
                        case "left":
                            a[0][0] -= 1; a[0][1] += 1;
                            a[2][0] += 1; a[2][1] -= 1;
                            a[3][0] += 2; a[3][1] -= 0;
                            rotation = 2;
                            break;
                    }
                    break;
            }
            break;
        case "T":
            switch(rotation) {
                case 0:
                    switch(dir){
                        case "right":
                            a[0][0] += 1; a[0][1] += 1;
                            a[1][0] -= 1; a[1][1] += 1;
                            a[3][0] += 1; a[3][1] -= 1;
                            rotation = 1;
                            break;
                        case "left":
                            a[0][0] += 1; a[0][1] -= 1;
                            a[1][0] += 1; a[1][1] += 1;
                            a[3][0] -= 1; a[3][1] -= 1;
                            rotation = 3;
                            break;
                    }
                    break;
                case 1:
                    switch(dir){
                        case "right":
                            a[0][0] += 1; a[0][1] -= 1;
                            a[1][0] += 1; a[1][1] += 1;
                            a[3][0] -= 1; a[3][1] -= 1;
                            rotation = 2;
                            break;
                        case "left":
                            a[0][0] -= 1; a[0][1] -= 1;
                            a[1][0] += 1; a[1][1] -= 1;
                            a[3][0] -= 1; a[3][1] += 1;
                            rotation = 0;
                            break;
                    }
                    break;
                case 2:
                    switch(dir){
                        case "right":
                            a[0][0] -= 1; a[0][1] -= 1;
                            a[1][0] += 1; a[1][1] -= 1;
                            a[3][0] -= 1; a[3][1] += 1;
                            rotation = 3;
                            break;
                        case "left":
                            a[0][0] -= 1; a[0][1] += 1;
                            a[1][0] -= 1; a[1][1] -= 1;
                            a[3][0] += 1; a[3][1] += 1;
                            rotation = 1;
                            break;
                    }
                    break;
                case 3:
                    switch(dir){
                        case "right":
                            a[0][0] -= 1; a[0][1] += 1;
                            a[1][0] -= 1; a[1][1] -= 1;
                            a[3][0] += 1; a[3][1] += 1;
                            rotation = 0;
                            break;
                        case "left":
                            a[0][0] += 1; a[0][1] += 1;
                            a[1][0] -= 1; a[1][1] += 1;
                            a[3][0] += 1; a[3][1] -= 1;
                            rotation = 2;
                            break;
                    }
                    break;
            }
            break;
    }

    activePieceTiles.forEach(([r,c]) => 
        board[r][c] = 0
    );

    if (a.some(([r,c]) =>
        r > 20 || c < 0 || c > 9 ||
        (board[r][c] !== 0 &&
        !activePieceTiles.some((r_,c_) => r_ === r && c_ === c))
    )) {
        activePieceTiles.forEach(([r,c]) => 
            board[r][c] = activePiece
        );
        rotation = r;
    } else {
        activePieceTiles = a.map(tile => [...tile]);

        activePieceTiles.forEach(([r,c]) => 
        board[r][c] = activePiece
        );
    }
}

const clearLines = () => {
    for (let i = 1; i < board.length; i++) {
        if (board[i].every((val) => val !== 0)) {
            for (let j = 0; j < 10; j++) {
                board[i][j] = 0;
            }

            for (let k = i; k > 1; k--) {
                for (let j = 0; j < 10; j++) {
                    board[k][j] = board[k-1][j];
                }
            }
        }
    }
}

let leftHeld = false;
let leftKeyTimer;
let leftKeyInterval;
let rightHeld = false;
let rightKeyTimer;
let rightKeyInterval;

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'r':
            clearBoard();
            spawnNextPiece();
            updateBoard();
            break;
        case 'ArrowLeft':
            if (!leftHeld) {
                movePiece('left');
                updateBoard();
            }
            leftHeld = true;
            leftKeyTimer = setTimeout(() => {
                leftKeyInterval = setInterval(() => {
                    movePiece('left');
                    updateBoard();
                }, 0);
            }, 133);
            break;
        case 'ArrowRight':
            if (!rightHeld) {
                movePiece('right');
                updateBoard();
            }
            rightHeld = true;
            rightKeyTimer = setTimeout(() => {
                rightKeyInterval = setInterval(() => {
                    movePiece('right');
                    updateBoard();
                }, 0);
            }, 133);
            break;
        case 'ArrowUp':
            hardDrop();
            updateBoard();
            break;
        case 'ArrowDown':
            softDrop();
            updateBoard();
            break;
        case 'z':
            rotatePiece("left");
            updateBoard();
            break;
        case 'x':
            rotatePiece("right");
            updateBoard();
            break;
        case 'c':
            rotatePiece("right");
            rotatePiece("right");
            updateBoard();
            break;
        case 'a':
            if (canHold) {
                if (hold) {
                    bag.push(hold)
                }
                hold = activePiece;
                activePieceTiles.forEach(([r,c]) => board[r][c] = 0);
                document.getElementById("hold-text").innerHTML = hold;
                spawnNextPiece();
                canHold = false;
                updateBoard();
            }
    }
});

document.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'ArrowLeft':
            clearTimeout(leftKeyTimer);
            clearInterval(leftKeyInterval);
            leftHeld = false;
            break;
        case 'ArrowRight':
            clearTimeout(rightKeyTimer);
            clearInterval(rightKeyInterval);
            rightHeld = false;
            break;
        default:
            break;
    }
});

spawnNextPiece();
updateBoard();

startTimer();
