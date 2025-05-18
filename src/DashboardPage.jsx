import React from "react";
import { GameProvider } from "./context/GameContext";
import Board from "./components/Board/Board";
import Sidebar from "./components/Sidebar/Sidebar";
import TimeoutModal from "./components/Modals/TimeoutModal";
import { useGameContext } from "./context/GameContext";
import { useChessTimer } from "./hooks/useChessTimer";

const DashboardPage = () => {
  return (
    <GameProvider>
      <ChessDashboard />
    </GameProvider>
  );
};

const ChessDashboard = () => {
  const { isDarkMode } = useGameContext();

  // Initialize the timer
  useChessTimer();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={`py-4 px-6 flex justify-between items-center ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } shadow-md`}
      >
        <div className="flex items-center">
          <span className="text-3xl mr-2">♞</span>
          <h1 className="text-2xl font-bold">Out Of Stock Fish</h1>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/" className="hover:text-blue-500 transition-colors">
            Home
          </a>
        </div>
      </header>

      {/* Chess Game Area */}
      <div
        className={`flex-1 flex flex-col lg:flex-row ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="flex-1 p-4 flex items-center justify-center">
          <Board />
        </div>
        <Sidebar />
      </div>

      {/* Modals */}
      <TimeoutModal />
    </div>
  );
};

export default DashboardPage;
