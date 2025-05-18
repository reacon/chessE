import React, { createContext, useContext, useState, useRef } from "react";

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [boardState, setBoardState] = useState([
    ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    Array(8).fill(""),
    Array(8).fill(""),
    Array(8).fill(""),
    Array(8).fill(""),
    ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
  ]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);

  const [currentTurn, setCurrentTurn] = useState("w");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStatus, setGameStatus] = useState("inactive");
  const [moveHistory, setMoveHistory] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState({ w: [], b: [] });
  const [fen, setFen] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [engineThinkTime, setEngineThinkTime] = useState("2");

  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const [timeControl, setTimeControl] = useState("10:0");
  const whiteTimerRef = useRef(null);
  const blackTimerRef = useRef(null);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeoutWinner, setTimeoutWinner] = useState(null);

  const [difficultyLevel, setDifficultyLevel] = useState("normal");
  const [theme, setTheme] = useState("standard");
  const [showLegalMoves, setShowLegalMoves] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [orientation, setOrientation] = useState("white");

  const value = {
    boardState,
    setBoardState,
    selectedSquare,
    setSelectedSquare,
    legalMoves,
    setLegalMoves,
    lastMove,
    setLastMove,

    currentTurn,
    setCurrentTurn,
    gameStarted,
    setGameStarted,
    gameStatus,
    setGameStatus,
    moveHistory,
    setMoveHistory,
    capturedPieces,
    setCapturedPieces,
    fen,
    setFen,
    apiLoading,
    setApiLoading,
    engineThinkTime,
    setEngineThinkTime,

    whiteTime,
    setWhiteTime,
    blackTime,
    setBlackTime,
    timeControl,
    setTimeControl,
    whiteTimerRef,
    blackTimerRef,

    isDarkMode,
    setIsDarkMode,
    showSettings,
    setShowSettings,
    showTimeoutModal,
    setShowTimeoutModal,
    timeoutWinner,
    setTimeoutWinner,

    difficultyLevel,
    setDifficultyLevel,
    theme,
    setTheme,
    showLegalMoves,
    setShowLegalMoves,
    showCoordinates,
    setShowCoordinates,
    orientation,
    setOrientation,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
