import React from "react";
import Piece from "./Piece";
import { useGameContext } from "../../context/GameContext";

const Square = ({ row, col, onClick }) => {
  const {
    boardState,
    selectedSquare,
    lastMove,
    legalMoves,
    showLegalMoves,
    theme,
    isDarkMode,
    gameStarted,
    currentTurn,
    apiLoading,
  } = useGameContext();

  const getSquareColor = () => {
    const isLight = (row + col) % 2 === 0;
    const themes = {
      standard: {
        light: isDarkMode ? "bg-gray-600" : "bg-[#f0d9b5]",
        dark: isDarkMode ? "bg-gray-800" : "bg-[#b58863]",
      },
      wood: {
        light: isDarkMode ? "bg-gray-500" : "bg-[#e8c99d]",
        dark: isDarkMode ? "bg-gray-700" : "bg-[#925130]",
      },
      blue: {
        light: isDarkMode ? "bg-gray-400" : "bg-[#dee3e6]",
        dark: isDarkMode ? "bg-gray-600" : "bg-[#8ca2ad]",
      },
    };
    return isLight ? themes[theme].light : themes[theme].dark;
  };

  const getSquareClasses = () => {
    let classes = getSquareColor();

    if (
      selectedSquare &&
      selectedSquare[0] === row &&
      selectedSquare[1] === col
    ) {
      classes += isDarkMode ? " bg-blue-700" : " bg-yellow-300";
    }

    if (
      lastMove &&
      ((lastMove.from[0] === row && lastMove.from[1] === col) ||
        (lastMove.to[0] === row && lastMove.to[1] === col))
    ) {
      classes += isDarkMode
        ? " bg-blue-600 bg-opacity-50"
        : " bg-yellow-200 bg-opacity-50";
    }

    if (showLegalMoves && legalMoves.some(([r, c]) => r === row && c === col)) {
      classes +=
        " before:content-[''] before:absolute before:w-3 before:h-3 before:rounded-full before:bg-black before:bg-opacity-20 before:z-10";
    }

    if (currentTurn === "w" && gameStarted && !apiLoading) {
      classes += " cursor-pointer";
    } else {
      classes += " cursor-not-allowed";
    }

    return classes;
  };

  const piece = boardState[row][col];

  return (
    <div
      className={`relative flex items-center justify-center ${getSquareClasses()}`}
      onClick={() => onClick(row, col)}
    >
      {piece && <Piece piece={piece} />}
    </div>
  );
};

export default Square;
