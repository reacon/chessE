import { useEffect } from "react";
import { useGameContext } from "../context/GameContext";
import { parseFEN, validateFEN, generateFEN } from "../utils/fenUtils";
import { parseTimeControl } from "../utils/moveUtils";
import { fromAlgebraic } from "../utils/moveUtils";

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
    whiteTimerRef,
    blackTimerRef,
    setShowTimeoutModal,
    isDarkMode,
    setIsDarkMode,
    setTimeControl,
    setWhiteTime,
    setBlackTime,
    boardState,
    moveHistory,
    gameStatus,
  } = useGameContext();

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

  const handleFenSubmit = (fenInput) => {
    if (!fenInput.trim()) return false;

    try {
      validateFEN(fenInput);

      const newBoardState = parseFEN(fenInput);
      const parts = fenInput.split(" ");
      const activeColor = parts[1] || "w";

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

  const handleTimeControlChange = (newTimeControl) => {
    setTimeControl(newTimeControl);

    const { minutes } = parseTimeControl(newTimeControl);
    setWhiteTime(minutes * 60);
    setBlackTime(minutes * 60);
  };

  const handleNewGame = () => {
    if (whiteTimerRef.current) clearInterval(whiteTimerRef.current);
    if (blackTimerRef.current) clearInterval(blackTimerRef.current);

    const newBoard = [
      ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
      ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
      Array(8).fill(""),
      Array(8).fill(""),
      Array(8).fill(""),
      Array(8).fill(""),
      ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
      ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
    ];
    const initialFen = generateFEN(newBoard, "w");

    setBoardState(newBoard);
    setSelectedSquare(null);
    setCurrentTurn("w");
    setMoveHistory([]);
    setGameStatus("inactive");
    setApiLoading(false);
    setFen(initialFen);
    setLastMove(null);
    setCapturedPieces({ w: [], b: [] });
    setLegalMoves([]);

    const { minutes } = parseTimeControl("10:0");
    setWhiteTime(minutes * 60);
    setBlackTime(minutes * 60);

    setGameStarted(false);

    setShowTimeoutModal(false);
  };

  const handleUndoMove = () => {
    if (moveHistory.length === 0) return;

    if (moveHistory.length === 1) {
      const lastMove = moveHistory[0];
      const newBoardState = boardState.map((r) => [...r]);
      const [fromRank, fromFile] = fromAlgebraic(lastMove.from);
      const [toRank, toFile] = fromAlgebraic(lastMove.to);

      newBoardState[fromRank][fromFile] = lastMove.piece;
      newBoardState[toRank][toFile] = lastMove.captured || "";

      setBoardState(newBoardState);
      setCurrentTurn("w");
      setMoveHistory([]);
      setLastMove(null);
      setGameStatus("active");
      return;
    }

    const lastTwoMoves = moveHistory.slice(-2);
    if (lastTwoMoves.length === 2) {
      let newBoardState = boardState.map((r) => [...r]);

      for (const move of lastTwoMoves.reverse()) {
        const [fromRank, fromFile] = fromAlgebraic(move.from);
        const [toRank, toFile] = fromAlgebraic(move.to);

        newBoardState[fromRank][fromFile] = move.piece;
        newBoardState[toRank][toFile] = move.captured || "";

        if (move.captured) {
          setCapturedPieces((prev) => {
            const newCaptured = { ...prev };
            const pieceColor = move.piece[0];
            const index = newCaptured[pieceColor].findIndex(
              (p) => p === move.captured
            );
            if (index !== -1) {
              newCaptured[pieceColor].splice(index, 1);
            }
            return newCaptured;
          });
        }
      }

      setBoardState(newBoardState);
      setCurrentTurn("w");
      setMoveHistory((prev) => prev.slice(0, -2));
      setLastMove(null);
      setGameStatus("active");
    }
  };

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
    handleUndoMove,
    handleStartGame,
    handleTimeControlChange,
  };
};
