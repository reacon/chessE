// src/components/Sidebar/MoveHistory.jsx
import React from "react";
import { useGameContext } from "../../context/GameContext";

const MoveHistory = () => {
  const { moveHistory, isDarkMode } = useGameContext();

  const renderMoveHistory = () => {
    const moves = [];

    for (let i = 0; i < moveHistory.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      const whiteMove = moveHistory[i];
      const blackMove = moveHistory[i + 1];

      moves.push(
        <div key={moveNumber} className="flex text-sm mb-1">
          <div
            className={`w-7 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            {moveNumber}.
          </div>
          <div className="w-16">{whiteMove.notation}</div>
          <div className="flex-1">{blackMove ? blackMove.notation : ""}</div>
        </div>
      );
    }

    return moves;
  };

  return (
    <div className="mb-4">
      <h3 className="font-bold mb-2">Move History</h3>
      <div
        className={`h-48 overflow-y-auto border ${
          isDarkMode
            ? "border-gray-700 bg-gray-700"
            : "border-gray-200 bg-gray-50"
        } rounded p-2`}
      >
        {renderMoveHistory()}
      </div>
    </div>
  );
};

export default MoveHistory;
