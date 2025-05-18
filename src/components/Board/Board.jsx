// src/components/Board/Board.jsx
import React from "react";
import Square from "./Square";
import TimeDisplay from "../Controls/TimeDisplay";
import StatusBar from "../Controls/StatusBar";
import { useGameContext } from "../../context/GameContext";
import { useChessBoard } from "../../hooks/useChessBoard";

const Board = () => {
  const {
    orientation,
    showCoordinates,
    isDarkMode,
    whiteTime,
    blackTime,
    capturedPieces,
  } = useGameContext();

  const { handleSquareClick } = useChessBoard();

  // Render files (a-h)
  const renderFiles = () => {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    if (orientation === "black") files.reverse();

    return (
      <div className="flex">
        <div className="w-8"></div>
        {files.map((file, i) => (
          <div
            key={i}
            className={`flex-1 text-center text-xs font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {file}
          </div>
        ))}
        <div className="w-8"></div>
      </div>
    );
  };

  // Render ranks (1-8)
  const renderRanks = (row) => {
    const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
    let rankIndex = row;
    if (orientation === "black") rankIndex = 7 - row;

    return (
      <div className="h-full flex items-center justify-center">
        <div
          className={`text-xs font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {ranks[rankIndex]}
        </div>
      </div>
    );
  };

  // Render board
  const renderBoard = () => {
    let rows = [...Array(8).keys()];
    let cols = [...Array(8).keys()];

    if (orientation === "black") {
      rows = rows.reverse();
      cols = cols.reverse();
    }

    return (
      <div className="grid grid-rows-8 w-full h-full">
        {rows.map((r) => (
          <div key={r} className="grid grid-cols-8 flex-1">
            {cols.map((c) => {
              const boardRow = orientation === "white" ? r : 7 - r;
              const boardCol = orientation === "white" ? c : 7 - c;
              return (
                <Square
                  key={`${r}-${c}`}
                  row={boardRow}
                  col={boardCol}
                  onClick={handleSquareClick}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl">
      {/* Top controls */}
      <div className="flex items-center justify-between mb-2">
        <TimeDisplay color="black" time={blackTime} />
        <StatusBar />
        <div className="flex items-center space-x-2">
          {capturedPieces.w.map((piece, index) => (
            <span key={index} className="text-2xl">
              {getPieceSymbol(piece)}
            </span>
          ))}
        </div>
      </div>

      {/* Chess board */}
      <div className="relative w-full" style={{ paddingBottom: "100%" }}>
        <div
          className={`absolute inset-0 border-2 ${
            isDarkMode ? "border-gray-600" : "border-gray-800"
          } rounded-md overflow-hidden flex flex-col`}
        >
          {showCoordinates && renderFiles()}
          <div className="flex flex-1">
            {showCoordinates && (
              <div className="w-8 grid grid-rows-8">
                {Array(8)
                  .fill()
                  .map((_, i) => (
                    <div key={i} className="flex-1">
                      {renderRanks(i)}
                    </div>
                  ))}
              </div>
            )}
            <div className="flex-1 relative">{renderBoard()}</div>
            {showCoordinates && <div className="w-8"></div>}
          </div>
          {showCoordinates && renderFiles()}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-between mt-2">
        <TimeDisplay color="white" time={whiteTime} />
        <div className="flex items-center space-x-2">
          {capturedPieces.b.map((piece, index) => (
            <span key={index} className="text-2xl">
              {getPieceSymbol(piece)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get piece symbol
const getPieceSymbol = (piece) => {
  const symbols = {
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
  return symbols[piece] || "";
};

export default Board;
