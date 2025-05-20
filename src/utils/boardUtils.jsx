export const isValidMove = (board, fromRow, fromCol, toRow, toCol) => {
  const piece = board[fromRow][fromCol];
  if (!piece) return false;

  const pieceType = piece[1];
  const pieceColor = piece[0];
  const targetPiece = board[toRow][toCol];

  if (targetPiece && targetPiece[0] === pieceColor) return false;

  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  switch (pieceType) {
    case "p":
      const direction = pieceColor === "w" ? -1 : 1;
      const startRow = pieceColor === "w" ? 6 : 1;

      if (colDiff === 0 && !targetPiece) {
        if (toRow - fromRow === direction) return true;
        if (
          fromRow === startRow &&
          toRow - fromRow === 2 * direction &&
          !board[fromRow + direction][fromCol]
        )
          return true;
      }

      if (colDiff === 1 && toRow - fromRow === direction && targetPiece)
        return true;

      return false;

    case "r":
      return (
        isPathClear(board, fromRow, fromCol, toRow, toCol) &&
        (rowDiff === 0 || colDiff === 0)
      );

    case "n":
      return (
        (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
      );

    case "b":
      return (
        isPathClear(board, fromRow, fromCol, toRow, toCol) &&
        rowDiff === colDiff
      );

    case "q":
      return (
        isPathClear(board, fromRow, fromCol, toRow, toCol) &&
        (rowDiff === colDiff || rowDiff === 0 || colDiff === 0)
      );

    case "k":
      return rowDiff <= 1 && colDiff <= 1;

    default:
      return false;
  }
};

export const isPathClear = (board, fromRow, fromCol, toRow, toCol) => {
  if (
    fromRow < 0 ||
    fromRow > 7 ||
    fromCol < 0 ||
    fromCol > 7 ||
    toRow < 0 ||
    toRow > 7 ||
    toCol < 0 ||
    toCol > 7
  ) {
    return false;
  }

  const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
  const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;

  while (
    currentRow >= 0 &&
    currentRow <= 7 &&
    currentCol >= 0 &&
    currentCol <= 7 &&
    (currentRow !== toRow || currentCol !== toCol)
  ) {
    if (board[currentRow][currentCol]) return false;
    currentRow += rowStep;
    currentCol += colStep;
  }

  return true;
};

export const isInCheck = (board, color) => {
  let kingRow, kingCol;

  outerLoop: for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === `${color}k`) {
        kingRow = row;
        kingCol = col;
        break outerLoop;
      }
    }
  }

  if (kingRow === undefined) return false;

  const opponentColor = color === "w" ? "b" : "w";

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece[0] === opponentColor) {
        if (isValidMove(board, row, col, kingRow, kingCol)) return true;
      }
    }
  }

  return false;
};

export const isCheckmate = (board, color) => {
  if (!isInCheck(board, color)) return false;

  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol];
      if (piece && piece[0] === color) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(board, fromRow, fromCol, toRow, toCol)) {
              const testBoard = board.map((r) => [...r]);
              testBoard[toRow][toCol] = piece;
              testBoard[fromRow][fromCol] = "";
              if (!isInCheck(testBoard, color)) return false;
            }
          }
        }
      }
    }
  }

  return true;
};
