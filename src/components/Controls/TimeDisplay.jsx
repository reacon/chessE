// src/components/Controls/TimeDisplay.jsx
import React from "react";
import { useGameContext } from "../../context/GameContext";

const TimeDisplay = ({ color }) => {
  const { whiteTime, blackTime, isDarkMode } = useGameContext();

  const time = color === "white" ? whiteTime : blackTime;
  const symbol = color === "white" ? "♔" : "♚";

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const bgColor =
    color === "white"
      ? isDarkMode
        ? "bg-gray-700"
        : "bg-gray-200"
      : isDarkMode
      ? "bg-gray-700"
      : "bg-gray-800";

  const textColor =
    color === "white" && !isDarkMode ? "text-gray-800" : "text-white";

  return (
    <div
      className={`flex items-center ${bgColor} ${textColor} px-3 py-2 rounded-md`}
    >
      <span className="text-2xl mr-2">{symbol}</span>
      <div className="text-xl font-mono">{formatTime(time)}</div>
    </div>
  );
};

export default TimeDisplay;
