import { useCallback } from "react";
import { useGameContext } from "../context/GameContext";
import { isValidMove, isInCheck, isCheckmate } from "../utils/boardUtils";
import { toAlgebraic, generateMoveNotation, fromAlgebraic } from "../utils/moveUtils";
import { generateFEN, parseFEN, updateFENWithMove } from "../utils/fenUtils";
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
    engineThinkTime
  } = useGameContext();

  // Add time increment after move
  const addTimeIncrement = (color) => {
    const { increment } = parseTimeControl(timeControl);
    if (increment <= 0) return;

    if (color === "w") {
      setWhiteTime((prev) => prev + increment);
    } else {
      setBlackTime((prev) => prev + increment);
    }
  };

  // Parse time control
  const parseTimeControl = (timeString) => {
    const [minutes, increment] = timeString.split(":").map(Number);
    return { minutes, increment };
  };

  // End game function
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

  // Get all legal moves for a piece
  const getLegalMoves = (fromRow, fromCol) => {
    const piece = boardState[fromRow][fromCol];
    if (!piece) return [];

    const moves = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(boardState, fromRow, fromCol, row, col)) {
          // Check if the move would put the king in check
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

  // Execute move without animation
  const executeMove = (fromRow, fromCol, toRow, toCol, piece) => {
    // Create a copy of the current board state
    const newBoardState = boardState.map(r => [...r]);
    
    // Remove the piece from its original position
    newBoardState[fromRow][fromCol] = "";
    
    // Place it directly in the new position
    newBoardState[toRow][toCol] = piece;
    
    // Update board state immediately
    setBoardState(newBoardState);
  };

  // Execute API move
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

    // Update captured pieces
    if (capturedPiece) {
      setCapturedPieces((prev) => {
        const newCaptured = { ...prev };
        newCaptured[piece[0]].push(capturedPiece);
        return newCaptured;
      });
    }

    // Create move record
    const move = {
      piece: piece,
      from: from,
      to: to,
      captured: capturedPiece || null,
      notation: generateMoveNotation(
        piece,
        from,
        to,
        capturedPiece
      ),
    };
    
    // Execute the move without animation
    executeMove(fromRow, fromCol, toRow, toCol, piece);

    // Update FEN using the move
    const newFen = updateFENWithMove(fen, from, to, piece[1]);
    setFen(newFen);

    // Update state
    setMoveHistory((prev) => [...prev, move]);
    setCurrentTurn("w");
    setApiLoading(false);
    setLastMove({ from: [fromRow, fromCol], to: [toRow, toCol] });

    // Add time increment for black
    addTimeIncrement("b");

    // Check game state
    const finalBoardState = boardState.map((r) => [...r]);
    finalBoardState[toRow][toCol] = piece;
    finalBoardState[fromRow][fromCol] = "";
    
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

  // Square click handler
  const handleSquareClick = useCallback(
    (row, col) => {
      // If game not started or it's not player's turn, do nothing
      if (!gameStarted || currentTurn !== "w" || apiLoading) return;

      const piece = boardState[row][col];

      if (!selectedSquare) {
        // Select a piece
        if (piece && piece[0] === "w") {
          setSelectedSquare([row, col]);
          setLegalMoves(getLegalMoves(row, col));
        }
      } else {
        const [fromRow, fromCol] = selectedSquare;
        const fromPiece = boardState[fromRow][fromCol];

        // Deselect if clicking the same square
        if (fromRow === row && fromCol === col) {
          setSelectedSquare(null);
          setLegalMoves([]);
          return;
        }

        // Try selecting a different piece
        if (piece && piece[0] === "w") {
          setSelectedSquare([row, col]);
          setLegalMoves(getLegalMoves(row, col));
          return;
        }

        // Check if the move is legal
        const legalMovesForPiece = getLegalMoves(fromRow, fromCol);
        const isLegal = legalMovesForPiece.some(
          ([r, c]) => r === row && c === col
        );

        if (isLegal) {
          // Make the move
          const capturedPiece = boardState[row][col];

          // Update captured pieces
          if (capturedPiece) {
            setCapturedPieces((prev) => {
              const newCaptured = { ...prev };
              newCaptured[fromPiece[0]].push(capturedPiece);
              return newCaptured;
            });
          }
          
          // Execute the move without animation
          executeMove(fromRow, fromCol, row, col, fromPiece);

          // Get algebraic coordinates for the move
          const fromAlg = toAlgebraic(fromRow, fromCol);
          const toAlg = toAlgebraic(row, col);

          // Add player move to the engine's history
          chessApi.addPlayerMove(fromAlg, toAlg);

          const move = {
            piece: fromPiece,
            from: fromAlg,
            to: toAlg,
            captured: capturedPiece || null,
            notation: generateMoveNotation(
              fromPiece,
              fromAlg,
              toAlg,
              capturedPiece
            ),
          };

          // Apply move
          setMoveHistory((prev) => [...prev, move]);
          setCurrentTurn("b");
          setLastMove({ from: [fromRow, fromCol], to: [row, col] });

          // Add time increment for white
          addTimeIncrement("w");

          // Update FEN using the move
          const newFen = updateFENWithMove(fen, fromAlg, toAlg, fromPiece[1]);
          setFen(newFen);

          // Check game state
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

          if (gameStatus !== "checkmate" && gameStatus !== "timeout") {
            requestNextMove();
          }
        }

        // Clear selection
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
      fen
    ]
  );

  // Request AI move
  const requestNextMove = async () => {
    if (gameStatus === "checkmate" || gameStatus === "timeout") return;

    try {
      setApiLoading(true);

      try {
        // Call the API with think time only
        const response = await chessApi.getBestMove(engineThinkTime);

        if (response && response.best_move) {
          executeApiMove(response.best_move, response);
        } else {
          setApiLoading(false);
          console.error("Engine did not return a valid move", response);
        }
      } catch (error) {
        setApiLoading(false);
        console.error("Engine error:", error);
        alert("The chess engine encountered an error. Please try a different position.");
      }
    } catch (error) {
      setApiLoading(false);
      console.error("API request failed:", error);
    }
  };

  // Handle new game
  const handleNewGame = () => {
    // Reset the engine's state for a new game
    chessApi.startNewGame();
    
    // Other new game logic...
    clearInterval(whiteTimerRef.current);
    clearInterval(blackTimerRef.current);
    whiteTimerRef.current = null;
    blackTimerRef.current = null;
    
    // Reset board to initial position
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
    
    // Generate FEN for initial position
    const initialFen = generateFEN(newBoard, "w");
    
    // Reset all game state
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
    
    // Reset timers
    const { minutes } = parseTimeControl(timeControl);
    setWhiteTime(minutes * 60);
    setBlackTime(minutes * 60);
    
    // Don't start game automatically
    setGameStarted(false);
    
    // Close timeout modal if open
    setShowTimeoutModal(false);
  };

  return {
    handleSquareClick,
    getLegalMoves,
    executeMove,
    executeApiMove,
    requestNextMove,
    addTimeIncrement,
    endGame,
    handleNewGame
  };
};
