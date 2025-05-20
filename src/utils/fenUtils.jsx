export const generateFEN = (board, activeColor) => {
  const mapPiece = (piece) => {
    if (!piece) return "";
    const pieceType = piece[1];
    const letterMap = { p: "p", r: "r", n: "n", b: "b", q: "q", k: "k" };
    let letter = letterMap[pieceType] || "";
    return piece[0] === "w" ? letter.toUpperCase() : letter;
  };

  let fenRows = board.map((row) => {
    let fenRow = "";
    let emptyCount = 0;
    row.forEach((cell) => {
      if (cell === "") {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          fenRow += emptyCount;
          emptyCount = 0;
        }
        fenRow += mapPiece(cell);
      }
    });
    if (emptyCount > 0) {
      fenRow += emptyCount;
    }
    return fenRow;
  });

  return `${fenRows.join("/")} ${activeColor} KQkq - 0 1`;
};

export const parseFEN = (fenString) => {
  if (!fenString) return null;

  const parts = fenString.split(" ");
  const position = parts[0];

  const rows = position.split("/");
  const board = [];

  rows.forEach((row) => {
    const boardRow = [];
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (isNaN(parseInt(char))) {
        const color = char === char.toUpperCase() ? "w" : "b";
        let pieceType = char.toLowerCase();
        switch (pieceType) {
          case "p":
            pieceType = "p";
            break;
          case "r":
            pieceType = "r";
            break;
          case "n":
            pieceType = "n";
            break;
          case "b":
            pieceType = "b";
            break;
          case "q":
            pieceType = "q";
            break;
          case "k":
            pieceType = "k";
            break;
          default:
            pieceType = "";
        }
        boardRow.push(color + pieceType);
      } else {
        const emptyCount = parseInt(char);
        for (let j = 0; j < emptyCount; j++) {
          boardRow.push("");
        }
      }
    }
    board.push(boardRow);
  });

  return board;
};

export const validateFEN = (fenString) => {
  if (!fenString.trim()) {
    throw new Error("FEN string cannot be empty");
  }

  const fenParts = fenString.split(" ");
  if (fenParts.length < 4) {
    throw new Error("FEN string must have at least 4 parts");
  }

  const boardPart = fenParts[0];
  const rows = boardPart.split("/");
  if (rows.length !== 8) {
    throw new Error("FEN board must have 8 rows");
  }

  for (const row of rows) {
    let sum = 0;
    for (const char of row) {
      if (isNaN(parseInt(char))) {
        sum++; 
      } else {
        sum += parseInt(char); 
      }
    }
    if (sum !== 8) {
      throw new Error("Each row must represent 8 squares");
    }
  }

  const turn = fenParts[1];
  if (turn !== "w" && turn !== "b") {
    throw new Error("Turn must be 'w' or 'b'");
  }

  return true;
};
