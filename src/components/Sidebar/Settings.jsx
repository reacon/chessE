// src/components/Sidebar/Settings.jsx
import React from "react";
import { useGameContext } from "../../context/GameContext";
import { useChessGame } from "../../hooks/useChessGame";

const Settings = () => {
  const {
    isDarkMode,
    timeControl,
    difficultyLevel,
    setDifficultyLevel,
    theme,
    setTheme,
    showLegalMoves,
    setShowLegalMoves,
    showCoordinates,
    setShowCoordinates,
    setShowSettings,
    engineThinkTime,
    setEngineThinkTime,
  } = useGameContext();

  const { handleTimeControlChange } = useChessGame();

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
      } p-4 rounded-lg shadow-lg`}
    >
      <h3 className="text-lg font-bold mb-4">Game Settings</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Time Control</label>
        <select
          className={`w-full px-3 py-2 border rounded-md ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300"
          }`}
          value={timeControl}
          onChange={(e) => handleTimeControlChange(e.target.value)}
        >
          <option value="1:0">1 min</option>
          <option value="3:0">3 min</option>
          <option value="5:0">5 min</option>
          <option value="10:0">10 min</option>
          <option value="3:2">3|2 (3 min + 2 sec increment)</option>
          <option value="5:3">5|3 (5 min + 3 sec increment)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Difficulty</label>
        <select
          className={`w-full px-3 py-2 border rounded-md ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300"
          }`}
          value={difficultyLevel}
          onChange={(e) => setDifficultyLevel(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Engine Response Time (seconds)
        </label>
        <select
          className={`w-full px-3 py-2 border rounded-md ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300"
          }`}
          value={engineThinkTime}
          onChange={(e) => setEngineThinkTime(e.target.value)}
        >
          <option value="1">1 second</option>
          <option value="2">2 seconds</option>
          <option value="3">3 seconds</option>
          <option value="5">5 seconds</option>
          <option value="10">10 seconds</option>
          <option value="0">Instant (no delay)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Board Theme</label>
        <select
          className={`w-full px-3 py-2 border rounded-md ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300"
          }`}
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="standard">Standard</option>
          <option value="wood">Wood</option>
          <option value="blue">Blue</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={showLegalMoves}
            onChange={(e) => setShowLegalMoves(e.target.checked)}
          />
          <span className="text-sm">Show Legal Moves</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={showCoordinates}
            onChange={(e) => setShowCoordinates(e.target.checked)}
          />
          <span className="text-sm">Show Coordinates</span>
        </label>
      </div>

      <button
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        onClick={() => setShowSettings(false)}
      >
        Close
      </button>
    </div>
  );
};

export default Settings;
