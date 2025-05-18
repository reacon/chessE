/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useCallback } from "react";
import { useGameContext } from "../context/GameContext";
import { isValidMove, isInCheck, isCheckmate } from "../utils/boardUtils";
import {
  toAlgebraic,
  generateMoveNotation,
  fromAlgebraic,
} from "../utils/moveUtils";
import { generateFEN, parseFEN } from "../utils/fenUtils";
import chessApi from "../services/BoardService";

export const useChessBoard = () => {
  const {
    boardState,
    setBoardState,
    selectedSquare,
    setSelectedSquare,
    currentTurn,
    setCurrentTurn,
    moveHistory,
    setMoveHistory,
    gameStatus,
    setGameStatus,
    apiLoading,
    setApiLoading,
    fen,
    setFen,
    legalMoves,
    setLegalMoves,
    lastMove,
    setLastMove,
    capturedPieces,
    setCapturedPieces,
    gameStarted,
    difficultyLevel,
    whiteTimerRef,
    blackTimerRef,
    setWhiteTime,
    setBlackTime,
    timeControl,
    setGameStarted,
    setShowTimeoutModal,
    setTimeoutWinner,
    engineThinkTime,
  } = useGameContext();

  const addTimeIncrement = (color) => {
    const { increment } = parseTimeControl(timeControl);
    if (increment <= 0) return;

    if (color === "w") {
      setWhiteTime((prev) => prev + increment);
    } else {
      setBlackTime((prev) => prev + increment);
    }
  };

  const parseTimeControl = (timeString) => {
    const [minutes, increment] = timeString.split(":").map(Number);
    return { minutes, increment };
  };

  const endGame = (winner, reason) => {
    clearInterval(whiteTimerRef.current);
    clearInterval(blackTimerRef.current);
    whiteTimerRef.current = null;
    blackTimerRef.current = null;
    setGameStarted(false);
    setGameStatus(reason === "timeout" ? "timeout" : "checkmate");

    if (reason === "timeout") {
      setTimeoutWinner(winner);
      setShowTimeoutModal(true);
    }
  };

  const getLegalMoves = (fromRow, fromCol) => {
    const piece = boardState[fromRow][fromCol];
    if (!piece) return [];

    const moves = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(boardState, fromRow, fromCol, row, col)) {
          const testBoard = boardState.map((r) => [...r]);
          testBoard[row][col] = piece;
          testBoard[fromRow][fromCol] = "";

          if (!isInCheck(testBoard, piece[0])) {
            moves.push([row, col]);
          }
        }
      }
    }

    return moves;
  };

  const executeMove = (fromRow, fromCol, toRow, toCol, piece) => {
    const newBoardState = boardState.map((r) => [...r]);
    newBoardState[fromRow][fromCol] = "";
    newBoardState[toRow][toCol] = piece;
    setBoardState(newBoardState);
  };

  const executeApiMove = (moveString, apiResponse) => {
    if (!moveString || typeof moveString !== "string") {
      console.error("Invalid move string received:", moveString);
      setApiLoading(false);
      return;
    }

    const [from, to] = moveString.split(" ");
    const [fromRow, fromCol] = fromAlgebraic(from);
    const [toRow, toCol] = fromAlgebraic(to);
    const piece = boardState[fromRow][fromCol];
    const capturedPiece = boardState[toRow][toCol];

    if (!piece) {
      console.error(`No piece found at ${from}`);
      setApiLoading(false);
      return;
    }

    if (capturedPiece) {
      setCapturedPieces((prev) => {
        const newCaptured = { ...prev };
        newCaptured[piece[0]].push(capturedPiece);
        return newCaptured;
      });
    }

    const move = {
      piece: piece,
      from: from,
      to: to,
      captured: capturedPiece || null,
      notation: generateMoveNotation(piece, from, to, capturedPiece),
    };

    executeMove(fromRow, fromCol, toRow, toCol, piece);

    let newFen;

    if (apiResponse && apiResponse.fen) {
      newFen = apiResponse.fen;
      setBoardState(parseFEN(newFen));
    } else {
      const newBoardState = boardState.map((r) => [...r]);
      newBoardState[toRow][toCol] = piece;
      newBoardState[fromRow][fromCol] = "";
      newFen = generateFEN(newBoardState, "w");
    }

    setMoveHistory((prev) => [...prev, move]);
    setFen(newFen);
    setCurrentTurn("w");
    setApiLoading(false);
    setLastMove({ from: [fromRow, fromCol], to: [toRow, toCol] });

    addTimeIncrement("b");

    const finalBoardState =
      apiResponse && apiResponse.fen
        ? parseFEN(apiResponse.fen)
        : (() => {
            const board = boardState.map((r) => [...r]);
            board[toRow][toCol] = piece;
            board[fromRow][fromCol] = "";
            return board;
          })();

    if (isInCheck(finalBoardState, "w")) {
      if (isCheckmate(finalBoardState, "w")) {
        endGame("b", "checkmate");
      } else {
        setGameStatus("check");
      }
    } else {
      setGameStatus("active");
    }
  };

  const handleSquareClick = useCallback(
    (row, col) => {
      if (!gameStarted || currentTurn !== "w" || apiLoading) return;

      const piece = boardState[row][col];

      if (!selectedSquare) {
        if (piece && piece[0] === "w") {
          setSelectedSquare([row, col]);
          setLegalMoves(getLegalMoves(row, col));
        }
      } else {
        const [fromRow, fromCol] = selectedSquare;
        const fromPiece = boardState[fromRow][fromCol];

        if (fromRow === row && fromCol === col) {
          setSelectedSquare(null);
          setLegalMoves([]);
          return;
        }

        if (piece && piece[0] === "w") {
          setSelectedSquare([row, col]);
          setLegalMoves(getLegalMoves(row, col));
          return;
        }

        const legalMovesForPiece = getLegalMoves(fromRow, fromCol);
        const isLegal = legalMovesForPiece.some(
          ([r, c]) => r === row && c === col
        );

        if (isLegal) {
          const capturedPiece = boardState[row][col];

          if (capturedPiece) {
            setCapturedPieces((prev) => {
              const newCaptured = { ...prev };
              newCaptured[fromPiece[0]].push(capturedPiece);
              return newCaptured;
            });
          }

          executeMove(fromRow, fromCol, row, col, fromPiece);

          const move = {
            piece: fromPiece,
            from: toAlgebraic(fromRow, fromCol),
            to: toAlgebraic(row, col),
            captured: capturedPiece || null,
            notation: generateMoveNotation(
              fromPiece,
              toAlgebraic(fromRow, fromCol),
              toAlgebraic(row, col),
              capturedPiece
            ),
          };

          setMoveHistory((prev) => [...prev, move]);
          setCurrentTurn("b");
          setLastMove({ from: [fromRow, fromCol], to: [row, col] });

          addTimeIncrement("w");

          const newBoardState = boardState.map((r) => [...r]);
          newBoardState[row][col] = fromPiece;
          newBoardState[fromRow][fromCol] = "";

          if (isInCheck(newBoardState, "b")) {
            if (isCheckmate(newBoardState, "b")) {
              endGame("w", "checkmate");
            } else {
              setGameStatus("check");
            }
          } else {
            setGameStatus("active");
          }

          const newFen = generateFEN(newBoardState, "b");
          setFen(newFen);

          if (gameStatus !== "checkmate" && gameStatus !== "timeout") {
            requestNextMove(newBoardState, newFen);
          }
        }

        setSelectedSquare(null);
        setLegalMoves([]);
      }
    },
    [
      selectedSquare,
      boardState,
      currentTurn,
      gameStatus,
      apiLoading,
      gameStarted,
    ]
  );

  const requestNextMove = async (boardStateToUse, fenString) => {
    const currentBoardState = boardStateToUse || boardState;
    const currentFen = fenString || fen;

    if (gameStatus === "checkmate" || gameStatus === "timeout") return;

    try {
      setApiLoading(true);

      try {
        const response = await chessApi.getBestMove(
          currentFen,
          engineThinkTime
        );

        if (response && response.best_move) {
          executeApiMove(response.best_move, response);
        } else {
          setApiLoading(false);
          console.error("API did not return a valid move", response);
        }
      } catch (error) {
        setApiLoading(false);
        console.error("Engine error:", error);
        alert(
          "The chess engine encountered an error. Please try a different position."
        );
      }
    } catch (error) {
      setApiLoading(false);
      console.error("API request failed:", error);
    }
  };

  return {
    handleSquareClick,
    getLegalMoves,
    executeMove,
    executeApiMove,
    requestNextMove,
    addTimeIncrement,
    endGame,
  };
};
