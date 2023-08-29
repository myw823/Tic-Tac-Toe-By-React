import { useState } from 'react';

export default function Game() {
    const [histories, setHistories] = useState([Array(9).fill(null)]);
    // * To track which move (by indexof histories) the board is currently displaying
    const [currentMove, setCurrentMove] = useState(0);
    
    const isXTurn = currentMove % 2 ===0;
    
    function handlePlay(nextStates) {
        const newHistories = [...histories.slice(0, currentMove + 1), nextStates];
        setHistories(newHistories);
        setCurrentMove(newHistories.length - 1);
        console.log(histories);
    }

    function jumpTo(moveIndex) {
        setCurrentMove(moveIndex);
    }

    const buttons = histories.map((state, index) => {
        let text;
        if (index === 0) {
            text = "Go to game start";
        } else {
            text = `Go to move #${index}`;
        }
        return (
            <li key={index}>
                <button onClick={() => jumpTo(index)}>{text}</button>
            </li>
        )
    })

    return (
        <div className='game'>
            <div className='board'>
                <Board onPlay={handlePlay} currentStates={histories[currentMove]} isXTurn={isXTurn}/>
            </div>
            <div className='game-info'>
                <ol>{buttons}</ol>
            </div>
        </div>
    );
}

function Board({onPlay, currentStates, isXTurn}) {

    const winner = determineWinner(currentStates);
    let gameResult;
    if(winner) {
        gameResult = `Winner: ${winner}`;
    } else {
        gameResult = `Next player: ${isXTurn ? 'X' : 'O'}`;
    }

    function handleClick(squareIdx) {
        // Banned from clicking on occupied square, or had a winner
        if (currentStates[squareIdx] || determineWinner(currentStates)) {
            return;
        }
        
        const nextStates = [...currentStates];
        if (isXTurn) { 
            nextStates[squareIdx] = 'X';
        } else {
            nextStates[squareIdx] = 'O';
        }

        onPlay(nextStates)
    }

    return (
        <>
            <div className="game-result">{gameResult}</div>
            <div className="board-row">
                <Square value={currentStates[0]} onClick={() => handleClick(0)}/>
                <Square value={currentStates[1]} onClick={() => handleClick(1)}/>
                <Square value={currentStates[2]} onClick={() => handleClick(2)}/>
            </div>
            <div className="board-row">
                <Square value={currentStates[3]} onClick={() => handleClick(3)}/>
                <Square value={currentStates[4]} onClick={() => handleClick(4)}/>
                <Square value={currentStates[5]} onClick={() => handleClick(5)}/>
            </div>
            <div className="board-row">
                <Square value={currentStates[6]} onClick={() => handleClick(6)}/>
                <Square value={currentStates[7]} onClick={() => handleClick(7)}/>
                <Square value={currentStates[8]} onClick={() => handleClick(8)}/>
            </div>
        </>
    );
}

function Square({ value, onClick }) {
    return <button className="square" value={value} onClick={onClick}>{value}</button>
}

function determineWinner(currentStates) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
        const [a,b,c] = combination;
        if (currentStates[a] && currentStates[a] === currentStates[b] && currentStates[b] === currentStates[c]) {
            return currentStates[a];
        }
    }
    return null;

}