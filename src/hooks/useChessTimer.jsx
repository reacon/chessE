/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useGameContext } from "../context/GameContext";

export const useChessTimer = () => {
  const {
    gameStarted,
    currentTurn,
    whiteTime,
    setWhiteTime,
    blackTime,
    setBlackTime,
    whiteTimerRef,
    blackTimerRef,
    setGameStarted,
    setGameStatus,
    setShowTimeoutModal,
    setTimeoutWinner,
  } = useGameContext();

  useEffect(() => {
    if (!gameStarted) return;

    if (whiteTimerRef.current) clearInterval(whiteTimerRef.current);
    if (blackTimerRef.current) clearInterval(blackTimerRef.current);

    const currentTimer = currentTurn === "w" ? whiteTimerRef : blackTimerRef;

    currentTimer.current = setInterval(() => {
      if (currentTurn === "w") {
        setWhiteTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(currentTimer.current);
            endGame("b", "timeout");
            return 0;
          }
          return prevTime - 1;
        });
      } else {
        setBlackTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(currentTimer.current);
            endGame("w", "timeout");
            return 0;
          }
          return prevTime - 1;
        });
      }
    }, 1000);

    return () => {
      if (currentTimer.current) {
        clearInterval(currentTimer.current);
      }
    };
  }, [currentTurn, gameStarted]);

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

  return { endGame };
};
