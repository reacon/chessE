import { useEffect } from "react";
import { useGameContext } from "../context/GameContext";
import { parseFEN, validateFEN } from "../utils/fenUtils";
import { parseTimeControl } from "../utils/moveUtils";
import { useChessBoard } from "./useChessBoard";
import chessApi from "../services/BoardService";

export const useChessGame = () => {
  const {
    setBoardState,
    setSelectedSquare,
    setCurrentTurn,
    setMoveHistory,
    setGameStatus,
    setApiLoading,
    setFen,
    setLastMove,
    setCapturedPieces,
    setLegalMoves,
    setGameStarted,
    isDarkMode,
    setIsDarkMode,
    setTimeControl,
    setWhiteTime,
    setBlackTime,
    gameStatus,
  } = useGameContext();
  
  const { handleNewGame } = useChessBoard();

  // Apply dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle FEN string submission
  const handleFenSubmit = (fenInput) => {
    if (!fenInput.trim()) return false;

    try {
      validateFEN(fenInput);
      
      const newBoardState = parseFEN(fenInput);
      const parts = fenInput.split(" ");
      const activeColor = parts[1] || "w";
      
      // Set the custom position in the engine
      chessApi.setPosition(fenInput);
      
      setBoardState(newBoardState);
      setSelectedSquare(null);
      setCurrentTurn(activeColor);
      setMoveHistory([]);
      setGameStatus("inactive");
      setApiLoading(false);
      setFen(fenInput);
      setLastMove(null);
      setCapturedPieces({ w: [], b: [] });
      setLegalMoves([]);
      
      const { minutes } = parseTimeControl("10:0");
      setWhiteTime(minutes * 60);
      setBlackTime(minutes * 60);
      
      setGameStarted(false);
      
      return true;
    } catch (error) {
      console.error("Failed to parse FEN string:", error);
      alert(`Invalid FEN string: ${error.message}`);
      return false;
    }
  };

  // Handle time control change
  const handleTimeControlChange = (newTimeControl) => {
    setTimeControl(newTimeControl);
    const { minutes } = parseTimeControl(newTimeControl);
    setWhiteTime(minutes * 60);
    setBlackTime(minutes * 60);
  };

  // Start game
  const handleStartGame = () => {
    if (gameStatus === "timeout" || gameStatus === "checkmate") {
      handleNewGame();
    }

    setGameStarted(true);
    setGameStatus("active");
  };

  return {
    toggleDarkMode,
    handleFenSubmit,
    handleNewGame,
    handleStartGame,
    handleTimeControlChange,
  };
};
