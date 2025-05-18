// src/components/Controls/StatusBar.jsx
import React from "react";
import { useGameContext } from "../../context/GameContext";

const StatusBar = () => {
  const { apiLoading, gameStatus, currentTurn, isDarkMode } = useGameContext();

  const getStatusMessage = () => {
    if (apiLoading) return "Engine is thinking...";
    if (gameStatus === "checkmate")
      return currentTurn === "w"
        ? "Checkmate! Black wins."
        : "Checkmate! White wins.";
    if (gameStatus === "check")
      return `${currentTurn === "w" ? "White" : "Black"} is in check!`;
    if (gameStatus === "timeout")
      return `${currentTurn === "w" ? "Black" : "White"} wins on time!`;
    if (gameStatus === "inactive") return "Press Start to begin the game";
    return `${currentTurn === "w" ? "Your" : "Engine's"} turn`;
  };

  return (
    <div
      className={`text-sm ${
        isDarkMode ? "bg-gray-700" : "bg-gray-800"
      } text-white px-3 py-1 rounded-md`}
    >
      {apiLoading && <span className="animate-pulse">●</span>}
      {getStatusMessage()}
    </div>
  );
};

export default StatusBar;
