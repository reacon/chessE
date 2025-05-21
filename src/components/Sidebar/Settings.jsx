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

  const difficultyToValue = (level) => {
    switch (level) {
      case "easy":
        return 1;
      case "normal":
        return 2;
      case "hard":
        return 3;
      default:
        return 2;
    }
  };

  const valueToDifficulty = (value) => {
    switch (parseInt(value)) {
      case 1:
        return "easy";
      case 2:
        return "normal";
      case 3:
        return "hard";
      default:
        return "normal";
    }
  };

  const handleDifficultyChange = (e) => {
    setDifficultyLevel(valueToDifficulty(e.target.value));
  };

  const sliderValue = difficultyToValue(difficultyLevel);
  const percentage = ((sliderValue - 1) / 2) * 100;
  // eslint-disable-next-line no-unused-vars
  const sliderStyle = {
    background: `linear-gradient(to right, ${
      isDarkMode ? "#3b82f6" : "#2563eb"
    } 0%, ${isDarkMode ? "#3b82f6" : "#2563eb"} ${percentage}%, ${
      isDarkMode ? "#374151" : "#e5e7eb"
    } ${percentage}%, ${isDarkMode ? "#374151" : "#e5e7eb"} 100%)`,
  };

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
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-xs ${
              sliderValue === 1 ? "font-bold text-blue-500" : ""
            }`}
          >
            Easy
          </span>
          <span
            className={`text-xs ${
              sliderValue === 2 ? "font-bold text-blue-500" : ""
            }`}
          >
            Normal
          </span>
          <span
            className={`text-xs ${
              sliderValue === 3 ? "font-bold text-blue-500" : ""
            }`}
          >
            Hard
          </span>
        </div>
        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          value={sliderValue}
          onChange={handleDifficultyChange}
          className="w-full h-2 absolute opacity-0 cursor-pointer -mt-2"
          style={{ touchAction: "none" }}
        />
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
