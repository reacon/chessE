// src/components/Modals/TimeoutModal.jsx
import React from "react";
import { useGameContext } from "../../context/GameContext";
import { useChessGame } from "../../hooks/useChessGame";

const TimeoutModal = () => {
  const { showTimeoutModal, timeoutWinner, isDarkMode, setShowTimeoutModal } =
    useGameContext();

  const { handleNewGame } = useChessGame();

  if (!showTimeoutModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } p-6 rounded-lg shadow-lg max-w-md w-full`}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Time's Up!</h2>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">
            {timeoutWinner === "w" ? "♔" : "♚"}
          </div>
          <p className="text-xl">
            {timeoutWinner === "w" ? "White" : "Black"} wins on time!
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleNewGame}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            New Game
          </button>
          <button
            onClick={() => setShowTimeoutModal(false)}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeoutModal;
