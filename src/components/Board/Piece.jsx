import React from "react";
import { useGameContext } from "../../context/GameContext";

const Piece = ({ piece }) => {
  const { isDarkMode } = useGameContext();

  const pieceSymbols = {
    wr: "♖",
    wn: "♘",
    wb: "♗",
    wq: "♕",
    wk: "♔",
    wp: "♙",
    br: "♜",
    bn: "♞",
    bb: "♝",
    bq: "♛",
    bk: "♚",
    bp: "♟",
  };

  // Determine piece color class
  const pieceColorClass =
    piece[0] === "w"
      ? isDarkMode
        ? "text-white"
        : "text-white"
      : "text-black"; // Always keep black pieces black

  return (
    <div className={`text-5xl ${pieceColorClass}`}>{pieceSymbols[piece]}</div>
  );
};

export default Piece;
