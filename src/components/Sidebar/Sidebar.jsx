// src/components/Sidebar/Sidebar.jsx
import React from "react";
import { useGameContext } from "../../context/GameContext";
import { useChessGame } from "../../hooks/useChessGame";
import FenInput from "./FenInput";
import GameControls from "../Controls/GameControls";
import MoveHistory from "./MoveHistory";
import GameInfo from "./GameInfo";
import Settings from "./Settings";

const Sidebar = () => {
  const { isDarkMode, showSettings } = useGameContext();
  const { toggleDarkMode } = useChessGame();

  return (
    <div
      className={`w-full lg:w-80 p-4 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
      } border-l flex flex-col relative`}
    >
      {showSettings ? (
        <Settings />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Chess Game</h2>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                isDarkMode
                  ? "bg-gray-700 text-yellow-300"
                  : "bg-blue-100 text-gray-800"
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? "🌙" : "☀️"}
            </button>
          </div>

          <FenInput />
          <GameControls />
          <MoveHistory />
          <GameInfo />

          <div className="mt-auto text-xs text-gray-500 text-center">
            Made with ♟️ | Chess Engine v2.0
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
