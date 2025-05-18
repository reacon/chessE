// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// import React, { useState, useCallback, useEffect, useRef } from "react";
// import chessApi from "../services/BoardService";

// const ChessBoard = () => {
//   // Core game state
//   const [boardState, setBoardState] = useState(initialBoardSetup());
//   const [selectedSquare, setSelectedSquare] = useState(null);
//   const [currentTurn, setCurrentTurn] = useState("w");
//   const [moveHistory, setMoveHistory] = useState([]);
//   const [gameStatus, setGameStatus] = useState("inactive"); 
//   const [apiLoading, setApiLoading] = useState(false);
//   const [fen, setFen] = useState("");

//   const [gameStarted, setGameStarted] = useState(false);
//   const [whiteTime, setWhiteTime] = useState(600);
//   const [blackTime, setBlackTime] = useState(600);
//   const [timeControl, setTimeControl] = useState("10:0"); 
//   const whiteTimerRef = useRef(null);
//   const blackTimerRef = useRef(null);

//   const [difficultyLevel, setDifficultyLevel] = useState("normal"); 
//   const [theme, setTheme] = useState("standard");
//   const [showLegalMoves, setShowLegalMoves] = useState(true);
//   const [showCoordinates, setShowCoordinates] = useState(true);

//   const [showSettings, setShowSettings] = useState(false);
//   const [showGameInfo, setShowGameInfo] = useState(false);
//   const [legalMoves, setLegalMoves] = useState([]);
//   const [lastMove, setLastMove] = useState(null);
//   const [capturedPieces, setCapturedPieces] = useState({ w: [], b: [] });
//   const [orientation, setOrientation] = useState("white"); 

//   const [isDarkMode, setIsDarkMode] = useState(false);

//   const [showTimeoutModal, setShowTimeoutModal] = useState(false);
//   const [timeoutWinner, setTimeoutWinner] = useState(null);

//   const [fenInput, setFenInput] = useState("");

//   const pieceSymbols = {
//     wr: "♖",
//     wn: "♘",
//     wb: "♗",
//     wq: "♕",
//     wk: "♔",
//     wp: "♙",
//     br: "♜",
//     bn: "♞",
//     bb: "♝",
//     bq: "♛",
//     bk: "♚",
//     bp: "♟",
//   };

//   useEffect(() => {
//     if (isDarkMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [isDarkMode]);

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   const boardThemes = {
//     standard: {
//       light: isDarkMode ? "bg-gray-600" : "bg-[#f0d9b5]",
//       dark: isDarkMode ? "bg-gray-800" : "bg-[#b58863]",
//       selected: isDarkMode ? "bg-blue-700" : "bg-yellow-300",
//       highlight: isDarkMode
//         ? "ring-4 ring-inset ring-blue-500"
//         : "ring-4 ring-inset ring-yellow-400",
//       lastMove: isDarkMode
//         ? "bg-blue-600 bg-opacity-50"
//         : "bg-yellow-200 bg-opacity-50",
//       check: "bg-red-400 bg-opacity-50",
//       legalMove:
//         "before:content-[''] before:absolute before:w-3 before:h-3 before:rounded-full before:bg-black before:bg-opacity-20 before:z-10",
//     },
//     wood: {
//       light: isDarkMode ? "bg-gray-500" : "bg-[#e8c99d]",
//       dark: isDarkMode ? "bg-gray-700" : "bg-[#925130]",
//       selected: isDarkMode ? "bg-blue-700" : "bg-yellow-300",
//       highlight: isDarkMode
//         ? "ring-4 ring-inset ring-blue-500"
//         : "ring-4 ring-inset ring-yellow-400",
//       lastMove: isDarkMode
//         ? "bg-blue-600 bg-opacity-50"
//         : "bg-yellow-200 bg-opacity-50",
//       check: "bg-red-400 bg-opacity-50",
//       legalMove:
//         "before:content-[''] before:absolute before:w-3 before:h-3 before:rounded-full before:bg-black before:bg-opacity-20 before:z-10",
//     },
//     blue: {
//       light: isDarkMode ? "bg-gray-400" : "bg-[#dee3e6]",
//       dark: isDarkMode ? "bg-gray-600" : "bg-[#8ca2ad]",
//       selected: isDarkMode ? "bg-blue-700" : "bg-blue-300",
//       highlight: isDarkMode
//         ? "ring-4 ring-inset ring-blue-500"
//         : "ring-4 ring-inset ring-blue-400",
//       lastMove: isDarkMode
//         ? "bg-blue-600 bg-opacity-50"
//         : "bg-blue-200 bg-opacity-50",
//       check: "bg-red-400 bg-opacity-50",
//       legalMove:
//         "before:content-[''] before:absolute before:w-3 before:h-3 before:rounded-full before:bg-black before:bg-opacity-20 before:z-10",
//     },
//   };

//   function initialBoardSetup() {
//     return [
//       ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
//       ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
//       Array(8).fill(""),
//       Array(8).fill(""),
//       Array(8).fill(""),
//       Array(8).fill(""),
//       ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
//       ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
//     ];
//   }

//   useEffect(() => {
//     if (!gameStarted) return;

//     const currentTimer = currentTurn === "w" ? whiteTimerRef : blackTimerRef;
//     const setTime = currentTurn === "w" ? setWhiteTime : setBlackTime;
//     const time = currentTurn === "w" ? whiteTime : blackTime;

//     if (time <= 0) {
//       endGame(currentTurn === "w" ? "b" : "w", "timeout");
//       return;
//     }

//     currentTimer.current = setInterval(() => {
//       setTime((prevTime) => {
//         if (prevTime <= 1) {
//           clearInterval(currentTimer.current);
//           endGame(currentTurn === "w" ? "b" : "w", "timeout");
//           return 0;
//         }
//         return prevTime - 1;
//       });
//     }, 1000);

//     return () => {
//       if (currentTimer.current) {
//         clearInterval(currentTimer.current);
//       }
//     };
//   }, [currentTurn, gameStarted, whiteTime, blackTime]);

//   const parseTimeControl = (timeString) => {
//     const [minutes, increment] = timeString.split(":").map(Number);
//     return { minutes, increment };
//   };

//   // Add increment after move
//   const addTimeIncrement = (color) => {
//     const { increment } = parseTimeControl(timeControl);
//     if (increment <= 0) return;

//     if (color === "w") {
//       setWhiteTime((prev) => prev + increment);
//     } else {
//       setBlackTime((prev) => prev + increment);
//     }
//   };

//   const handleTimeControlChange = (newTimeControl) => {
//     setTimeControl(newTimeControl);

//     const { minutes } = parseTimeControl(newTimeControl);

//     if (!gameStarted) {
//       setWhiteTime(minutes * 60);
//       setBlackTime(minutes * 60);
//     } else {
//       setWhiteTime(minutes * 60);
//       setBlackTime(minutes * 60);
//     }
//   };

//   const endGame = (winner, reason) => {
//     clearInterval(whiteTimerRef.current);
//     clearInterval(blackTimerRef.current);
//     whiteTimerRef.current = null;
//     blackTimerRef.current = null;
//     setGameStarted(false);
//     setGameStatus(reason === "timeout" ? "timeout" : "checkmate");

//     if (reason === "timeout") {
//       setTimeoutWinner(winner);
//       setShowTimeoutModal(true);
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? "0" + secs : secs}`;
//   };

//   const toAlgebraic = (row, col) => {
//     const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
//     const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
//     return files[col] + ranks[row];
//   };

//   const fromAlgebraic = (algebraic) => {
//     const files = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
//     const rank = 8 - parseInt(algebraic[1]);
//     const file = files[algebraic[0]];
//     return [rank, file];
//   };

//   const generateFEN = (board, activeColor) => {
//     const mapPiece = (piece) => {
//       if (!piece) return "";
//       const pieceType = piece[1];
//       const letterMap = { p: "p", r: "r", n: "n", b: "b", q: "q", k: "k" };
//       let letter = letterMap[pieceType] || "";
//       return piece[0] === "w" ? letter.toUpperCase() : letter;
//     };

//     let fenRows = board.map((row) => {
//       let fenRow = "";
//       let emptyCount = 0;
//       row.forEach((cell) => {
//         if (cell === "") {
//           emptyCount++;
//         } else {
//           if (emptyCount > 0) {
//             fenRow += emptyCount;
//             emptyCount = 0;
//           }
//           fenRow += mapPiece(cell);
//         }
//       });
//       if (emptyCount > 0) {
//         fenRow += emptyCount;
//       }
//       return fenRow;
//     });

//     return `${fenRows.join("/")} ${activeColor} KQkq - 0 1`;
//   };

//   const parseFEN = (fenString) => {
//     if (!fenString) return initialBoardSetup();

//     const parts = fenString.split(" ");
//     const position = parts[0];
//     const activeColor = parts[1] || "w";

//     const rows = position.split("/");
//     const board = [];

//     rows.forEach((row) => {
//       const boardRow = [];
//       for (let i = 0; i < row.length; i++) {
//         const char = row[i];
//         if (isNaN(parseInt(char))) {
//           const color = char === char.toUpperCase() ? "w" : "b";
//           let pieceType = char.toLowerCase();
//           switch (pieceType) {
//             case "p":
//               pieceType = "p";
//               break;
//             case "r":
//               pieceType = "r";
//               break;
//             case "n":
//               pieceType = "n";
//               break;
//             case "b":
//               pieceType = "b";
//               break;
//             case "q":
//               pieceType = "q";
//               break;
//             case "k":
//               pieceType = "k";
//               break;
//             default:
//               pieceType = "";
//           }
//           boardRow.push(color + pieceType);
//         } else {
//           const emptyCount = parseInt(char);
//           for (let j = 0; j < emptyCount; j++) {
//             boardRow.push("");
//           }
//         }
//       }
//       board.push(boardRow);
//     });

//     return board;
//   };

//   const handleFenSubmit = (e) => {
//     e.preventDefault();
//     if (!fenInput.trim()) return;

//     try {
//       // Parse the FEN string
//       const newBoardState = parseFEN(fenInput);
//       const parts = fenInput.split(" ");
//       const activeColor = parts[1] || "w";

//       // Reset the game state with the new board
//       setBoardState(newBoardState);
//       setSelectedSquare(null);
//       setCurrentTurn(activeColor);
//       setMoveHistory([]);
//       setGameStatus("inactive");
//       setApiLoading(false);
//       setFen(fenInput);
//       setLastMove(null);
//       setCapturedPieces({ w: [], b: [] });
//       setLegalMoves([]);

//       // Reset timers
//       const { minutes } = parseTimeControl(timeControl);
//       setWhiteTime(minutes * 60);
//       setBlackTime(minutes * 60);

//       // Keep game not started until user clicks start
//       setGameStarted(false);

//       // Clear input
//       setFenInput("");
//     } catch (error) {
//       console.error("Failed to parse FEN string:", error);
//       alert("Invalid FEN string. Please check and try again.");
//     }
//   };

//   // Get all legal moves for a piece
//   const getLegalMoves = (fromRow, fromCol) => {
//     const piece = boardState[fromRow][fromCol];
//     if (!piece) return [];

//     const moves = [];

//     for (let row = 0; row < 8; row++) {
//       for (let col = 0; col < 8; col++) {
//         if (isValidMove(fromRow, fromCol, row, col)) {
//           // Check if the move would put the king in check
//           const testBoard = boardState.map((r) => [...r]);
//           testBoard[row][col] = piece;
//           testBoard[fromRow][fromCol] = "";

//           if (!isInCheck(testBoard, piece[0])) {
//             moves.push([row, col]);
//           }
//         }
//       }
//     }

//     return moves;
//   };

//   // Square click handler
//   const handleSquareClick = useCallback(
//     async (row, col) => {
//       // If game not started or it's not player's turn, do nothing
//       if (!gameStarted || currentTurn !== "w" || apiLoading) return;

//       const piece = boardState[row][col];

//       if (!selectedSquare) {
//         // Select a piece
//         if (piece && piece[0] === "w") {
//           setSelectedSquare([row, col]);
//           setLegalMoves(getLegalMoves(row, col));
//         }
//       } else {
//         const [fromRow, fromCol] = selectedSquare;
//         const fromPiece = boardState[fromRow][fromCol];

//         // Deselect if clicking the same square
//         if (fromRow === row && fromCol === col) {
//           setSelectedSquare(null);
//           setLegalMoves([]);
//           return;
//         }

//         // Try selecting a different piece
//         if (piece && piece[0] === "w") {
//           setSelectedSquare([row, col]);
//           setLegalMoves(getLegalMoves(row, col));
//           return;
//         }

//         // Check if the move is legal
//         const legalMovesForPiece = getLegalMoves(fromRow, fromCol);
//         const isLegal = legalMovesForPiece.some(
//           ([r, c]) => r === row && c === col
//         );

//         if (isLegal) {
//           // Make the move
//           const newBoardState = boardState.map((r) => [...r]);
//           const capturedPiece = newBoardState[row][col];

//           // Update captured pieces
//           if (capturedPiece) {
//             setCapturedPieces((prev) => {
//               const newCaptured = { ...prev };
//               newCaptured[fromPiece[0]].push(capturedPiece);
//               return newCaptured;
//             });
//           }

//           newBoardState[row][col] = fromPiece;
//           newBoardState[fromRow][fromCol] = "";

//           const move = {
//             piece: fromPiece,
//             from: toAlgebraic(fromRow, fromCol),
//             to: toAlgebraic(row, col),
//             captured: capturedPiece || null,
//             notation: generateMoveNotation(
//               fromPiece,
//               toAlgebraic(fromRow, fromCol),
//               toAlgebraic(row, col),
//               capturedPiece
//             ),
//           };

//           // Apply move
//           setMoveHistory((prev) => [...prev, move]);
//           setBoardState(newBoardState);
//           setCurrentTurn("b");
//           setLastMove({ from: [fromRow, fromCol], to: [row, col] });

//           // Add time increment for white
//           addTimeIncrement("w");

//           // Check game state
//           if (isInCheck(newBoardState, "b")) {
//             if (isCheckmate(newBoardState, "b")) {
//               endGame("w", "checkmate");
//             } else {
//               setGameStatus("check");
//             }
//           } else {
//             setGameStatus("active");
//           }

//           // Generate FEN and request AI move
//           const newFen = generateFEN(newBoardState, "b");
//           setFen(newFen);

//           if (gameStatus !== "checkmate" && gameStatus !== "timeout") {
//             requestNextMove(newBoardState, newFen);
//           }
//         }

//         // Clear selection
//         setSelectedSquare(null);
//         setLegalMoves([]);
//       }
//     },
//     [
//       selectedSquare,
//       boardState,
//       currentTurn,
//       gameStatus,
//       apiLoading,
//       gameStarted,
//     ]
//   );

//   // Generate standard chess notation for a move
//   const generateMoveNotation = (piece, from, to, capturedPiece) => {
//     const pieceLetters = { p: "", r: "R", n: "N", b: "B", q: "Q", k: "K" };
//     const pieceLetter = pieceLetters[piece[1]];
//     const captureSymbol = capturedPiece ? "x" : "";

//     return `${pieceLetter}${captureSymbol}${to}`;
//   };

//   // Execute AI move
//   const executeApiMove = (moveString, apiResponse) => {
//     if (!moveString || typeof moveString !== "string") {
//       console.error("Invalid move string received:", moveString);
//       setApiLoading(false);
//       return;
//     }

//     const [from, to] = moveString.split(" ");
//     const [fromRow, fromCol] = fromAlgebraic(from);
//     const [toRow, toCol] = fromAlgebraic(to);
//     const piece = boardState[fromRow][fromCol];
//     const capturedPiece = boardState[toRow][toCol];

//     if (!piece) {
//       console.error(`No piece found at ${from}`);
//       setApiLoading(false);
//       return;
//     }

//     // Update captured pieces
//     if (capturedPiece) {
//       setCapturedPieces((prev) => {
//         const newCaptured = { ...prev };
//         newCaptured[piece[0]].push(capturedPiece);
//         return newCaptured;
//       });
//     }

//     // Create move record
//     const move = {
//       piece: piece,
//       from: from,
//       to: to,
//       captured: capturedPiece || null,
//       notation: generateMoveNotation(piece, from, to, capturedPiece),
//     };

//     // Apply move
//     let newBoardState;
//     let newFen;

//     if (apiResponse && apiResponse.fen) {
//       newFen = apiResponse.fen;
//       newBoardState = parseFEN(newFen);
//     } else {
//       newBoardState = boardState.map((r) => [...r]);
//       newBoardState[toRow][toCol] = piece;
//       newBoardState[fromRow][fromCol] = "";
//       newFen = generateFEN(newBoardState, "w");
//     }

//     // Update state
//     setMoveHistory((prev) => [...prev, move]);
//     setBoardState(newBoardState);
//     setFen(newFen);
//     setCurrentTurn("w");
//     setApiLoading(false);
//     setLastMove({ from: [fromRow, fromCol], to: [toRow, toCol] });

//     // Add time increment for black
//     addTimeIncrement("b");

//     // Check game state
//     if (isInCheck(newBoardState, "w")) {
//       if (isCheckmate(newBoardState, "w")) {
//         endGame("b", "checkmate");
//       } else {
//         setGameStatus("check");
//       }
//     } else {
//       setGameStatus("active");
//     }
//   };

//   // Request AI move
//   const requestNextMove = async (boardStateToUse, fenString) => {
//     const currentBoardState = boardStateToUse || boardState;
//     const currentFen = fenString || fen;

//     if (gameStatus === "checkmate" || gameStatus === "timeout") return;

//     try {
//       setApiLoading(true);

//       // Add difficulty level parameter to API call
//       const response = await chessApi.getBestMove(currentFen, difficultyLevel);

//       if (response && response.best_move) {
//         executeApiMove(response.best_move, response);
//       } else {
//         setApiLoading(false);
//         console.error("API did not return a valid move", response);
//       }
//     } catch (error) {
//       setApiLoading(false);
//       console.error("API request failed:", error);
//     }
//   };

//   // Move validation
//   const isValidMove = (fromRow, fromCol, toRow, toCol) => {
//     const piece = boardState[fromRow][fromCol];
//     if (!piece) return false;

//     const pieceType = piece[1];
//     const pieceColor = piece[0];
//     const targetPiece = boardState[toRow][toCol];

//     if (targetPiece && targetPiece[0] === pieceColor) return false;

//     const rowDiff = Math.abs(toRow - fromRow);
//     const colDiff = Math.abs(toCol - fromCol);

//     switch (pieceType) {
//       case "p":
//         const direction = pieceColor === "w" ? -1 : 1;
//         const startRow = pieceColor === "w" ? 6 : 1;

//         if (colDiff === 0 && !targetPiece) {
//           if (toRow - fromRow === direction) return true;
//           if (
//             fromRow === startRow &&
//             toRow - fromRow === 2 * direction &&
//             !boardState[fromRow + direction][fromCol]
//           )
//             return true;
//         }

//         if (colDiff === 1 && toRow - fromRow === direction && targetPiece)
//           return true;

//         return false;

//       case "r":
//         return (
//           isPathClear(fromRow, fromCol, toRow, toCol) &&
//           (rowDiff === 0 || colDiff === 0)
//         );

//       case "n":
//         return (
//           (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
//         );

//       case "b":
//         return (
//           isPathClear(fromRow, fromCol, toRow, toCol) && rowDiff === colDiff
//         );

//       case "q":
//         return (
//           isPathClear(fromRow, fromCol, toRow, toCol) &&
//           (rowDiff === colDiff || rowDiff === 0 || colDiff === 0)
//         );

//       case "k":
//         return rowDiff <= 1 && colDiff <= 1;

//       default:
//         return false;
//     }
//   };

//   // Check if path is clear for rook, bishop, queen
//   const isPathClear = (fromRow, fromCol, toRow, toCol) => {
//     // Validate inputs are within bounds
//     if (
//       fromRow < 0 ||
//       fromRow > 7 ||
//       fromCol < 0 ||
//       fromCol > 7 ||
//       toRow < 0 ||
//       toRow > 7 ||
//       toCol < 0 ||
//       toCol > 7
//     ) {
//       return false;
//     }

//     const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
//     const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

//     let currentRow = fromRow + rowStep;
//     let currentCol = fromCol + colStep;

//     while (
//       currentRow >= 0 &&
//       currentRow <= 7 &&
//       currentCol >= 0 &&
//       currentCol <= 7 &&
//       (currentRow !== toRow || currentCol !== toCol)
//     ) {
//       if (boardState[currentRow][currentCol]) return false;
//       currentRow += rowStep;
//       currentCol += colStep;
//     }

//     return true;
//   };

//   // Check if king is in check
//   const isInCheck = (board, color) => {
//     let kingRow, kingCol;

//     // Find king position
//     outerLoop: for (let row = 0; row < 8; row++) {
//       for (let col = 0; col < 8; col++) {
//         if (board[row][col] === `${color}k`) {
//           kingRow = row;
//           kingCol = col;
//           break outerLoop;
//         }
//       }
//     }

//     if (kingRow === undefined) return false;

//     // Check if any opponent piece can attack the king
//     const opponentColor = color === "w" ? "b" : "w";

//     for (let row = 0; row < 8; row++) {
//       for (let col = 0; col < 8; col++) {
//         const piece = board[row][col];
//         if (piece && piece[0] === opponentColor) {
//           if (isValidMove(row, col, kingRow, kingCol)) return true;
//         }
//       }
//     }

//     return false;
//   };

//   // Check if it's checkmate
//   const isCheckmate = (board, color) => {
//     if (!isInCheck(board, color)) return false;

//     // Check if any piece can make a valid move to get out of check
//     for (let fromRow = 0; fromRow < 8; fromRow++) {
//       for (let fromCol = 0; fromCol < 8; fromCol++) {
//         const piece = board[fromRow][fromCol];
//         if (piece && piece[0] === color) {
//           for (let toRow = 0; toRow < 8; toRow++) {
//             for (let toCol = 0; toCol < 8; toCol++) {
//               if (isValidMove(fromRow, fromCol, toRow, toCol)) {
//                 const testBoard = board.map((r) => [...r]);
//                 testBoard[toRow][toCol] = piece;
//                 testBoard[fromRow][fromCol] = "";
//                 if (!isInCheck(testBoard, color)) return false;
//               }
//             }
//           }
//         }
//       }
//     }

//     return true;
//   };

//   // Start new game
//   const handleNewGame = () => {
//     // Clear intervals
//     if (whiteTimerRef.current) clearInterval(whiteTimerRef.current);
//     if (blackTimerRef.current) clearInterval(blackTimerRef.current);

//     // Reset board
//     const newBoard = initialBoardSetup();
//     const initialFen = generateFEN(newBoard, "w");

//     // Reset all game state
//     setBoardState(newBoard);
//     setSelectedSquare(null);
//     setCurrentTurn("w");
//     setMoveHistory([]);
//     setGameStatus("inactive");
//     setApiLoading(false);
//     setFen(initialFen);
//     setLastMove(null);
//     setCapturedPieces({ w: [], b: [] });
//     setLegalMoves([]);

//     // Reset timers
//     const { minutes } = parseTimeControl(timeControl);
//     setWhiteTime(minutes * 60);
//     setBlackTime(minutes * 60);

//     // Don't start game automatically
//     setGameStarted(false);

//     // Close timeout modal if open
//     setShowTimeoutModal(false);
//   };

//   // Undo last move
//   const handleUndoMove = () => {
//     if (moveHistory.length === 0) return;

//     // If only one move in history, just undo it
//     if (moveHistory.length === 1) {
//       const lastMove = moveHistory[0];
//       const newBoardState = boardState.map((r) => [...r]);
//       const [fromRank, fromFile] = fromAlgebraic(lastMove.from);
//       const [toRank, toFile] = fromAlgebraic(lastMove.to);

//       // Restore piece
//       newBoardState[fromRank][fromFile] = lastMove.piece;
//       newBoardState[toRank][toFile] = lastMove.captured || "";

//       // Update board
//       setBoardState(newBoardState);
//       setCurrentTurn("w");
//       setMoveHistory([]);
//       setLastMove(null);
//       setGameStatus("active");
//       return;
//     }

//     // Undo last two moves (API move and player move)
//     const lastTwoMoves = moveHistory.slice(-2);
//     if (lastTwoMoves.length === 2) {
//       let newBoardState = boardState.map((r) => [...r]);

//       // Apply undo for each of the last two moves
//       for (const move of lastTwoMoves.reverse()) {
//         const [fromRank, fromFile] = fromAlgebraic(move.from);
//         const [toRank, toFile] = fromAlgebraic(move.to);

//         // Restore piece
//         newBoardState[fromRank][fromFile] = move.piece;
//         newBoardState[toRank][toFile] = move.captured || "";

//         // Remove from captured pieces if was captured
//         if (move.captured) {
//           setCapturedPieces((prev) => {
//             const newCaptured = { ...prev };
//             const pieceColor = move.piece[0];
//             const index = newCaptured[pieceColor].findIndex(
//               (p) => p === move.captured
//             );
//             if (index !== -1) {
//               newCaptured[pieceColor].splice(index, 1);
//             }
//             return newCaptured;
//           });
//         }
//       }

//       // Update board
//       setBoardState(newBoardState);
//       setCurrentTurn("w");
//       setMoveHistory((prev) => prev.slice(0, -2));
//       setLastMove(null);
//       setGameStatus("active");
//     }
//   };

//   // Start game
//   const handleStartGame = () => {
//     if (gameStarted) return;

//     // Reset game state if it ended in timeout or checkmate
//     if (gameStatus === "timeout" || gameStatus === "checkmate") {
//       handleNewGame();
//     }

//     setGameStarted(true);
//     setGameStatus("active");
//   };

//   // Toggle orientation
//   const handleFlipBoard = () => {
//     setOrientation((prev) => (prev === "white" ? "black" : "white"));
//   };

//   // Get current piece at position
//   const getPieceAtPosition = (row, col) => {
//     const piece = boardState[row][col];
//     return piece ? pieceSymbols[piece] : "";
//   };

//   // Get square classes
//   const getSquareClasses = (row, col) => {
//     const colorClass =
//       (row + col) % 2 === 0
//         ? boardThemes[theme].light
//         : boardThemes[theme].dark;

//     let classes = `relative flex items-center justify-center text-5xl ${colorClass}`;

//     // Selected square
//     if (
//       selectedSquare &&
//       selectedSquare[0] === row &&
//       selectedSquare[1] === col
//     ) {
//       classes += ` ${boardThemes[theme].selected}`;
//     }

//     // Last move
//     if (
//       lastMove &&
//       ((lastMove.from[0] === row && lastMove.from[1] === col) ||
//         (lastMove.to[0] === row && lastMove.to[1] === col))
//     ) {
//       classes += ` ${boardThemes[theme].lastMove}`;
//     }

//     // Check if king is in check
//     const piece = boardState[row][col];
//     if (piece && piece[1] === "k" && isInCheck(boardState, piece[0])) {
//       classes += ` ${boardThemes[theme].check}`;
//     }

//     // Show legal moves
//     if (showLegalMoves && legalMoves.some(([r, c]) => r === row && c === col)) {
//       classes += ` ${boardThemes[theme].legalMove}`;
//     }

//     // Cursor
//     if (currentTurn === "w" && gameStarted && !apiLoading) {
//       classes += " cursor-pointer";
//     } else {
//       classes += " cursor-not-allowed";
//     }

//     return classes;
//   };

//   // Render files (a-h)
//   const renderFiles = () => {
//     const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

//     if (orientation === "black") {
//       files.reverse();
//     }

//     return (
//       <div className="flex">
//         <div className="w-8"></div>
//         {files.map((file, i) => (
//           <div
//             key={i}
//             className={`flex-1 text-center text-xs font-medium ${
//               isDarkMode ? "text-gray-300" : "text-gray-600"
//             }`}
//           >
//             {file}
//           </div>
//         ))}
//         <div className="w-8"></div>
//       </div>
//     );
//   };

//   // Render ranks (1-8)
//   const renderRanks = (row) => {
//     const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
//     let rankIndex = row;

//     if (orientation === "black") {
//       rankIndex = 7 - row;
//     }

//     return (
//       <div
//         className={`w-8 flex items-center justify-center text-xs font-medium ${
//           isDarkMode ? "text-gray-300" : "text-gray-600"
//         }`}
//       >
//         {ranks[rankIndex]}
//       </div>
//     );
//   };

//   // Render board
//   const renderBoard = () => {
//     let rows = [...Array(8).keys()];
//     let cols = [...Array(8).keys()];

//     if (orientation === "black") {
//       rows = rows.reverse();
//       cols = cols.reverse();
//     }

//     return (
//       <div className="grid grid-rows-8 w-full h-full">
//         {rows.map((r) => (
//           <div key={r} className="grid grid-cols-8 flex-1">
//             {cols.map((c) => {
//               // Map to actual board coordinates
//               const boardRow = orientation === "white" ? r : 7 - r;
//               const boardCol = orientation === "white" ? c : 7 - c;

//               return (
//                 <div
//                   key={`${r}-${c}`}
//                   className={getSquareClasses(boardRow, boardCol)}
//                   onClick={() => handleSquareClick(boardRow, boardCol)}
//                 >
//                   {getPieceAtPosition(boardRow, boardCol)}
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   // Render move history with proper numbering
//   const renderMoveHistory = () => {
//     const moves = [];

//     for (let i = 0; i < moveHistory.length; i += 2) {
//       const moveNumber = Math.floor(i / 2) + 1;
//       const whiteMove = moveHistory[i];
//       const blackMove = moveHistory[i + 1];

//       moves.push(
//         <div key={moveNumber} className="flex text-sm mb-1">
//           <div
//             className={`w-7 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
//           >
//             {moveNumber}.
//           </div>
//           <div className="w-16">{whiteMove.notation}</div>
//           <div className="flex-1">{blackMove ? blackMove.notation : ""}</div>
//         </div>
//       );
//     }

//     return moves;
//   };

//   // Render captured pieces
//   const renderCapturedPieces = (color) => {
//     return capturedPieces[color].map((piece, index) => (
//       <span key={index} className="text-2xl">
//         {pieceSymbols[piece]}
//       </span>
//     ));
//   };

//   // Get status message
//   const getStatusMessage = () => {
//     if (apiLoading) return "Engine is thinking...";
//     if (gameStatus === "checkmate")
//       return currentTurn === "w"
//         ? "Checkmate! Black wins."
//         : "Checkmate! White wins.";
//     if (gameStatus === "check")
//       return `${currentTurn === "w" ? "White" : "Black"} is in check!`;
//     if (gameStatus === "timeout")
//       return `${currentTurn === "w" ? "Black" : "White"} wins on time!`;
//     if (gameStatus === "inactive") return "Press Start to begin the game";
//     return `${currentTurn === "w" ? "Your" : "Engine's"} turn`;
//   };

//   // Render game settings panel
//   const renderSettings = () => {
//     return (
//       <div
//         className={`${
//           isDarkMode ? "bg-gray-800 text-white" : "bg-white"
//         } p-4 rounded-lg shadow-lg`}
//       >
//         <h3 className="text-lg font-bold mb-4">Game Settings</h3>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Time Control</label>
//           <select
//             className={`w-full px-3 py-2 border rounded-md ${
//               isDarkMode
//                 ? "bg-gray-700 border-gray-600 text-white"
//                 : "bg-white border-gray-300"
//             }`}
//             value={timeControl}
//             onChange={(e) => handleTimeControlChange(e.target.value)}
//           >
//             <option value="1:0">1 min</option>
//             <option value="3:0">3 min</option>
//             <option value="5:0">5 min</option>
//             <option value="10:0">10 min</option>
//             <option value="3:2">3|2 (3 min + 2 sec increment)</option>
//             <option value="5:3">5|3 (5 min + 3 sec increment)</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Difficulty</label>
//           <select
//             className={`w-full px-3 py-2 border rounded-md ${
//               isDarkMode
//                 ? "bg-gray-700 border-gray-600 text-white"
//                 : "bg-white border-gray-300"
//             }`}
//             value={difficultyLevel}
//             onChange={(e) => setDifficultyLevel(e.target.value)}
//           >
//             <option value="easy">Easy</option>
//             <option value="normal">Normal</option>
//             <option value="hard">Hard</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Board Theme</label>
//           <select
//             className={`w-full px-3 py-2 border rounded-md ${
//               isDarkMode
//                 ? "bg-gray-700 border-gray-600 text-white"
//                 : "bg-white border-gray-300"
//             }`}
//             value={theme}
//             onChange={(e) => setTheme(e.target.value)}
//           >
//             <option value="standard">Standard</option>
//             <option value="wood">Wood</option>
//             <option value="blue">Blue</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="flex items-center">
//             <input
//               type="checkbox"
//               className="mr-2"
//               checked={showLegalMoves}
//               onChange={(e) => setShowLegalMoves(e.target.checked)}
//             />
//             <span className="text-sm">Show Legal Moves</span>
//           </label>
//         </div>

//         <div className="mb-4">
//           <label className="flex items-center">
//             <input
//               type="checkbox"
//               className="mr-2"
//               checked={showCoordinates}
//               onChange={(e) => setShowCoordinates(e.target.checked)}
//             />
//             <span className="text-sm">Show Coordinates</span>
//           </label>
//         </div>

//         <button
//           className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
//           onClick={() => setShowSettings(false)}
//         >
//           Close
//         </button>
//       </div>
//     );
//   };

//   // Timeout Modal Component
//   const TimeoutModal = () => {
//     if (!showTimeoutModal) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div
//           className={`${
//             isDarkMode ? "bg-gray-800 text-white" : "bg-white"
//           } p-6 rounded-lg shadow-lg max-w-md w-full`}
//         >
//           <h2 className="text-2xl font-bold mb-4 text-center">Time's Up!</h2>
//           <div className="text-center mb-6">
//             <div className="text-6xl mb-4">
//               {timeoutWinner === "w" ? "♔" : "♚"}
//             </div>
//             <p className="text-xl">
//               {timeoutWinner === "w" ? "White" : "Black"} wins on time!
//             </p>
//           </div>
//           <div className="flex space-x-4">
//             <button
//               onClick={handleNewGame}
//               className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//             >
//               New Game
//             </button>
//             <button
//               onClick={() => setShowTimeoutModal(false)}
//               className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // FEN Input Form Component
//   const FenInputForm = () => {
//     return (
//       <form onSubmit={handleFenSubmit} className="mb-4">
//         <div className="mb-2">
//           <label htmlFor="fen-input" className="block text-sm font-medium mb-1">
//             Enter FEN Position
//           </label>
//           <div className="flex">
//             <input
//               id="fen-input"
//               type="text"
//               value={fenInput}
//               onChange={(e) => setFenInput(e.target.value)}
//               placeholder="e.g., rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
//               className={`flex-1 px-3 py-2 border rounded-l-md ${
//                 isDarkMode
//                   ? "bg-gray-700 border-gray-600 text-white"
//                   : "bg-white border-gray-300"
//               }`}
//             />
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
//             >
//               Set
//             </button>
//           </div>
//         </div>
//       </form>
//     );
//   };

//   return (
//     <>
//       <div
//         className={`flex flex-col lg:flex-row h-screen ${
//           isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
//         }`}
//       >
//         {/* Main board area */}
//         <div className="flex-1 p-4 flex items-center justify-center">
//           <div className="w-full max-w-3xl">
//             {/* Top controls area */}
//             <div className="flex items-center justify-between mb-2">
//               <div
//                 className={`flex items-center ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-800"
//                 } text-white px-3 py-2 rounded-md`}
//               >
//                 <span className="text-2xl mr-2">♚</span>
//                 <div className="text-xl font-mono">{formatTime(blackTime)}</div>
//               </div>

//               <div
//                 className={`text-sm ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-800"
//                 } text-white px-3 py-1 rounded-md`}
//               >
//                 {apiLoading && <span className="animate-pulse">●</span>}
//                 {getStatusMessage()}
//               </div>

//               <div className="flex items-center space-x-2">
//                 {renderCapturedPieces("w")}
//               </div>
//             </div>

//             {/* Actual chess board */}
//             <div className="relative w-full" style={{ paddingBottom: "100%" }}>
//               <div
//                 className={`absolute inset-0 border-2 ${
//                   isDarkMode ? "border-gray-600" : "border-gray-800"
//                 } rounded-md overflow-hidden flex flex-col`}
//               >
//                 {showCoordinates && renderFiles()}

//                 <div className="flex flex-1">
//                   {showCoordinates && (
//                     <div className="w-8 flex flex-col">
//                       {Array(8)
//                         .fill()
//                         .map((_, i) => renderRanks(i))}
//                     </div>
//                   )}

//                   <div className="flex-1 relative">{renderBoard()}</div>

//                   {showCoordinates && <div className="w-8"></div>}
//                 </div>

//                 {showCoordinates && renderFiles()}
//               </div>
//             </div>

//             {/* Bottom controls area */}
//             <div className="flex items-center justify-between mt-2">
//               <div
//                 className={`flex items-center ${
//                   isDarkMode ? "bg-gray-700" : "bg-gray-200"
//                 } ${
//                   isDarkMode ? "text-white" : "text-gray-800"
//                 } px-3 py-2 rounded-md`}
//               >
//                 <span className="text-2xl mr-2">♔</span>
//                 <div className="text-xl font-mono">{formatTime(whiteTime)}</div>
//               </div>

//               <div className="flex items-center space-x-2">
//                 {renderCapturedPieces("b")}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Side panel */}
//         <div
//           className={`w-full lg:w-80 p-4 ${
//             isDarkMode
//               ? "bg-gray-800 border-gray-700"
//               : "bg-white border-gray-300"
//           } border-l flex flex-col relative`}
//         >
//           {showSettings ? (
//             renderSettings()
//           ) : (
//             <>
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-bold">Chess Game</h2>
//                 <button
//                   onClick={toggleDarkMode}
//                   className={`p-2 rounded-full ${
//                     isDarkMode
//                       ? "bg-gray-700 text-yellow-300"
//                       : "bg-blue-100 text-gray-800"
//                   }`}
//                   aria-label="Toggle dark mode"
//                 >
//                   {isDarkMode ? "🌙" : "☀️"}
//                 </button>
//               </div>

//               {/* FEN Input Form */}
//               <FenInputForm />

//               <div className="flex space-x-2 mb-4">
//                 {!gameStarted ? (
//                   <button
//                     className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//                     onClick={handleStartGame}
//                   >
//                     Start Game
//                   </button>
//                 ) : (
//                   <button
//                     className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                     onClick={handleNewGame}
//                   >
//                     New Game
//                   </button>
//                 )}
//               </div>

//               <div className="flex space-x-2 mb-4">
//                 <button
//                   className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                   onClick={() => setShowSettings(true)}
//                 >
//                   Settings
//                 </button>

//                 <button
//                   className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//                   onClick={handleUndoMove}
//                   disabled={moveHistory.length === 0 || apiLoading}
//                 >
//                   Undo Move
//                 </button>
//               </div>

//               <div className="mb-4">
//                 <h3 className="font-bold mb-2">Move History</h3>
//                 <div
//                   className={`h-48 overflow-y-auto border ${
//                     isDarkMode
//                       ? "border-gray-700 bg-gray-700"
//                       : "border-gray-200 bg-gray-50"
//                   } rounded p-2`}
//                 >
//                   {renderMoveHistory()}
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <h3 className="font-bold mb-2">Game Information</h3>
//                 <div
//                   className={`border ${
//                     isDarkMode
//                       ? "border-gray-700 bg-gray-700"
//                       : "border-gray-200 bg-gray-50"
//                   } rounded p-2`}
//                 >
//                   <div className="text-sm mb-1">
//                     <span className="font-medium">Time Control:</span>{" "}
//                     {timeControl.replace(":", "|")}
//                   </div>
//                   <div className="text-sm mb-1">
//                     <span className="font-medium">Difficulty:</span>{" "}
//                     {difficultyLevel.charAt(0).toUpperCase() +
//                       difficultyLevel.slice(1)}
//                   </div>
//                   <div className="text-sm">
//                     <span className="font-medium">FEN:</span>{" "}
//                     <span className="font-mono text-xs break-all">
//                       {fen || "No position set"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-auto text-xs text-gray-500 text-center">
//                 Made with ♟️ | Chess Engine v2.0
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Timeout Modal */}
//       <TimeoutModal />
//     </>
//   );
// };

// export default ChessBoard;
