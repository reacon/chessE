// src/components/Controls/GameControls.jsx
import React from "react";
import { useGameContext } from "../../context/GameContext";
import { useChessGame } from "../../hooks/useChessGame";

const GameControls = () => {
  const {
    gameStarted,
    moveHistory,
    apiLoading,
    gameStatus,
    boardState,
    setShowSettings,
  } = useGameContext();

  const { handleStartGame, handleNewGame, handleUndoMove } = useChessGame();

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {!gameStarted ? (
          <button
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => handleStartGame(gameStatus)}
          >
            Start Game
          </button>
        ) : (
          <button
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleNewGame}
          >
            New Game
          </button>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </button>

        <button
          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={() => handleUndoMove(moveHistory, boardState)}
          disabled={moveHistory.length === 0 || apiLoading}
        >
          Undo Move
        </button>
      </div>
    </div>
  );
};

export default GameControls;
