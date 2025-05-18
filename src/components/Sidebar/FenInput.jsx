// src/components/Sidebar/FenInput.jsx
import React, { useState } from "react";
import { useGameContext } from "../../context/GameContext";
import { useChessGame } from "../../hooks/useChessGame";

const FenInput = () => {
  const [fenInput, setFenInput] = useState("");
  const { isDarkMode } = useGameContext();
  const { handleFenSubmit } = useChessGame();

  const onSubmit = (e) => {
    e.preventDefault();
    if (handleFenSubmit(fenInput)) {
      setFenInput("");
    }
  };

  return (
    <form onSubmit={onSubmit} className="mb-4">
      <div className="mb-2">
        <label htmlFor="fen-input" className="block text-sm font-medium mb-1">
          Enter FEN Position
        </label>
        <div className="flex">
          <input
            id="fen-input"
            type="text"
            value={fenInput}
            onChange={(e) => setFenInput(e.target.value)}
            placeholder="e.g., rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            className={`flex-1 px-3 py-2 border rounded-l-md ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
            }`}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
          >
            Set
          </button>
        </div>
      </div>
    </form>
  );
};

export default FenInput;
