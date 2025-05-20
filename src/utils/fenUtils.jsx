// FEN utility functions
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

  // Adding dummy values for castling rights, en passant square, halfmove clock, and fullmove number
  return `${fenRows.join("/")} ${activeColor} KQkq - 0 1`;
};

export const parseFEN = (fenString) => {
  if (!fenString) return null;

  // Split FEN string to get board position
  const parts = fenString.split(" ");
  const position = parts[0];

  // Convert FEN position to board state
  const rows = position.split("/");
  const board = [];

  rows.forEach((row) => {
    const boardRow = [];
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (isNaN(parseInt(char))) {
        // It's a piece
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
        // It's a number (empty squares)
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
  
  // Basic FEN validation
  const fenParts = fenString.split(" ");
  if (fenParts.length < 4) {
    throw new Error("FEN string must have at least 4 parts");
  }
  
  const boardPart = fenParts[0];
  const rows = boardPart.split("/");
  if (rows.length !== 8) {
    throw new Error("FEN board must have 8 rows");
  }
  
  // Validate each row
  for (const row of rows) {
    let sum = 0;
    for (const char of row) {
      if (isNaN(parseInt(char))) {
        sum++; // It's a piece
      } else {
        sum += parseInt(char); // It's a number of empty squares
      }
    }
    if (sum !== 8) {
      throw new Error("Each row must represent 8 squares");
    }
  }
  
  // Validate turn
  const turn = fenParts[1];
  if (turn !== "w" && turn !== "b") {
    throw new Error("Turn must be 'w' or 'b'");
  }
  
  return true;
};

// Function to update FEN with a move
export const updateFENWithMove = (fenString, from, to, pieceType) => {
  // Parse the FEN string
  const parts = fenString.split(" ");
  const position = parts[0];
  const activeColor = parts[1];
  let castlingRights = parts[2];
  let enPassantTarget = parts[3];
  let halfMoveClock = parseInt(parts[4]);
  let fullMoveNumber = parseInt(parts[5]);
  
  // Convert algebraic notation to indices
  const files = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
  const fromFile = files[from[0]];
  const fromRank = 8 - parseInt(from[1]);
  const toFile = files[to[0]];
  const toRank = 8 - parseInt(to[1]);
  
  // Parse the board position
  const rows = position.split("/");
  
  // Convert the rows to expanded format (with individual squares)
  const expandedRows = rows.map(row => {
    let expanded = "";
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (isNaN(parseInt(char))) {
        expanded += char;
      } else {
        expanded += ".".repeat(parseInt(char));
      }
    }
    return expanded;
  });
  
  // Get the piece at the from position
  const piece = expandedRows[fromRank][fromFile];
  
  // Create new expanded rows with the move applied
  const newExpandedRows = [...expandedRows];
  
  // Remove piece from source
  let rowChars = newExpandedRows[fromRank].split('');
  rowChars[fromFile] = '.';
  newExpandedRows[fromRank] = rowChars.join('');
  
  // Place piece at destination
  rowChars = newExpandedRows[toRank].split('');
  rowChars[toFile] = piece;
  newExpandedRows[toRank] = rowChars.join('');
  
  // Convert back to compressed FEN format
  const newRows = newExpandedRows.map(row => {
    let compressed = "";
    let emptyCount = 0;
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '.') {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          compressed += emptyCount;
          emptyCount = 0;
        }
        compressed += char;
      }
    }
    
    if (emptyCount > 0) {
      compressed += emptyCount;
    }
    
    return compressed;
  });
  
  // Update castling rights if king or rook moved
  if (pieceType === 'k') {
    // If king moved, remove castling rights for that color
    if (activeColor === 'w') {
      castlingRights = castlingRights.replace(/[KQ]/g, '');
    } else {
      castlingRights = castlingRights.replace(/[kq]/g, '');
    }
  } else if (pieceType === 'r') {
    // If rook moved, remove the corresponding castling right
    if (from === 'a1') castlingRights = castlingRights.replace('Q', '');
    if (from === 'h1') castlingRights = castlingRights.replace('K', '');
    if (from === 'a8') castlingRights = castlingRights.replace('q', '');
    if (from === 'h8') castlingRights = castlingRights.replace('k', '');
  }
  
  // If no castling rights left, use '-'
  if (castlingRights === '') castlingRights = '-';
  
  // Update en passant target square
  if (pieceType === 'p' && Math.abs(fromRank - toRank) === 2) {
    // Pawn moved two squares, set en passant target
    const epRank = activeColor === 'w' ? toRank + 1 : toRank - 1;
    const epFile = 'abcdefgh'[toFile];
    enPassantTarget = `${epFile}${8 - epRank}`;
  } else {
    // No en passant possible on this move
    enPassantTarget = '-';
  }
  
  // Update half move clock
  if (pieceType === 'p' || expandedRows[toRank][toFile] !== '.') {
    // Pawn move or capture resets half move clock
    halfMoveClock = 0;
  } else {
    // Otherwise increment
    halfMoveClock++;
  }
  
  // Update full move number
  if (activeColor === 'b') {
    fullMoveNumber++;
  }
  
  // Toggle active color
  const newActiveColor = activeColor === 'w' ? 'b' : 'w';
  
  // Construct new FEN
  return `${newRows.join('/')} ${newActiveColor} ${castlingRights} ${enPassantTarget} ${halfMoveClock} ${fullMoveNumber}`;
};
