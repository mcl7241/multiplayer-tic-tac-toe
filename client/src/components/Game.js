import React, { useState, useEffect } from "react";
import { Window, MessageList, MessageInput, useChannelStateContext, useChatContext } from "stream-chat-react";
import "./Chat.css";

const Patterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function Square({ chooseSquare, val }) {
  return (
    <div className="square" onClick={chooseSquare}>
      {val}
    </div>
  );
}

function Board({ result, setResult }) {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  useEffect(() => {
    const checkWin = () => {
      for (let pattern of Patterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          setResult({ winner: board[a], state: "won" });
          return;
        }
      }
    };

    const checkIfTie = () => {
      if (board.every(square => square !== "")) {
        setResult({ winner: "none", state: "tie" });
      }
    };

    checkWin();
    checkIfTie();
  }, [board, setResult]);

  useEffect(() => {
    const handleGameMove = event => {
      if (event.type === "game-move" && event.user.id !== client.userID) {
        const { square, player } = event.data;
        updateBoard(square, player);
        setTurn(player === "X" ? "O" : "X");
        setPlayer(player === "X" ? "O" : "X");
      }
    };

    channel.on(handleGameMove);
    return () => {
      channel.off(handleGameMove);
    };
  }, [channel, client.userID]);

  const updateBoard = (square, player) => {
    setBoard(prevBoard =>
      prevBoard.map((val, idx) => (idx === square ? player : val))
    );
  };

  const chooseSquare = async square => {
    if (turn === player && board[square] === "") {
      await channel.sendEvent({
        type: "game-move",
        data: { square, player },
      });
      updateBoard(square, player);
      setTurn(turn === "X" ? "O" : "X");
    }
  };

  return (
    <div className="board">
      {[0, 1, 2].map(row => (
        <div className="row" key={row}>
          {[0, 1, 2].map(col => {
            const index = row * 3 + col;
            return (
              <Square
                key={index}
                val={board[index]}
                chooseSquare={() => chooseSquare(index)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Game({ channel, setChannel }) {
  const [playersJoined, setPlayersJoined] = useState(channel.state.watcher_count === 2);
  const [result, setResult] = useState({ winner: "", state: "" });
  const [gameKey, setGameKey] = useState(0);

  if (!playersJoined) {
    return <div className="waitingMessage"> Please wait for other player to join. Thank you.</div>;
  }

  return (
    <div className="gameContainer">
      <Board result={result} setResult={setResult} />
      <Window>
        <MessageList
          disableDateSeparator
          closeReactionSelectorOnClick
          hideDeletedMessages
          messageActions={["react"]}
        />
        <MessageInput noFiles />
      </Window>
      <button
        onClick={async () => {
          await channel.stopWatching();
          setChannel(false); 
        }}
      >
        {" "}
        Leave Game
      </button>
      {result.state === "won" && (
        <div className="resultMessage winner">
          Congratulations! Player {result.winner} wins!
        </div>
      )}
      {result.state === "tie" && (
        <div className="resultMessage tie">
          It's a tie!
        </div>
      )}
    </div>
  );
}

export default Game;
