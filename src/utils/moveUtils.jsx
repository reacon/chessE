// Move utility functions
export const toAlgebraic = (row, col) => {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
  return files[col] + ranks[row];
};

export const fromAlgebraic = (algebraic) => {
  const files = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
  const rank = 8 - parseInt(algebraic[1]);
  const file = files[algebraic[0]];
  return [rank, file];
};

export const generateMoveNotation = (piece, from, to, capturedPiece) => {
  const pieceLetters = { p: "", r: "R", n: "N", b: "B", q: "Q", k: "K" };
  const pieceLetter = pieceLetters[piece[1]];
  const captureSymbol = capturedPiece ? "x" : "";

  return `${pieceLetter}${captureSymbol}${to}`;
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
};

export const parseTimeControl = (timeString) => {
  const [minutes, increment] = timeString.split(":").map(Number);
  return { minutes, increment };
};
