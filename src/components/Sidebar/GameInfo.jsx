// src/components/Sidebar/GameInfo.jsx
import React from "react";
import { useGameContext } from "../../context/GameContext";

const GameInfo = () => {
  const { timeControl, difficultyLevel, fen, isDarkMode } = useGameContext();

  return (
    <div className="mb-4">
      <h3 className="font-bold mb-2">Game Information</h3>
      <div
        className={`border ${
          isDarkMode
            ? "border-gray-700 bg-gray-700"
            : "border-gray-200 bg-gray-50"
        } rounded p-2`}
      >
        <div className="text-sm mb-1">
          <span className="font-medium">Time Control:</span>{" "}
          {timeControl.replace(":", "|")}
        </div>
        <div className="text-sm mb-1">
          <span className="font-medium">Difficulty:</span>{" "}
          {difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1)}
        </div>
        <div className="text-sm">
          <span className="font-medium">FEN:</span>{" "}
          <span className="font-mono text-xs break-all">
            {fen || "No position set"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
