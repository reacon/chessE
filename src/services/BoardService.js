// src/services/BoardService.js

const chessApi = {
  // Track if a new game has been started
  isNewGame: true,
  
  // Track move history for UCI protocol
  moveHistory: [],
  
  // Current FEN string
  currentFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  
  // Reset game state
  resetGame: function() {
    this.isNewGame = true;
    this.moveHistory = [];
    this.currentFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  },
  
  // Set custom position
  setPosition: function(fen) {
    this.isNewGame = true;
    this.moveHistory = [];
    this.currentFen = fen;
  },
  
  // Add move to history
  addMove: function(uciMove) {
    this.moveHistory.push(uciMove);
    this.isNewGame = false;
  },
  
  // Convert algebraic notation to UCI format (e.g., "e2" + "e4" to "e2e4")
  convertToUciMove: function(from, to) {
    return from + to;
  },
  
  getBestMove: async function(thinkTime = "2") {
    try {
      let commandString = "";
      
      // Only send ucinewgame if this is a new game
      if (this.isNewGame) {
        commandString += "ucinewgame\n";
      }
      
      // Set position with FEN and moves
      if (this.moveHistory.length > 0) {
        commandString += `position fen ${this.currentFen} moves ${this.moveHistory.join(' ')}\n`;
      } else {
        commandString += `position fen ${this.currentFen}\n`;
      }
      
      // Set search time
      commandString += `go movetime ${parseInt(thinkTime) * 1000}`;
      
      // Send commands to backend
      const response = await fetch(`/api/engine-move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: commandString }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Process engine response
      if (data && data.bestMove) {
        // Convert UCI move format (e.g., "e2e4") to internal format
        const from = data.bestMove.substring(0, 2);
        const to = data.bestMove.substring(2, 4);
        
        // Add move to history
        this.addMove(data.bestMove);
        
        return { best_move: `${from} ${to}` };
      } else {
        throw new Error("No valid move returned from engine");
      }
    } catch (error) {
      console.error("Error fetching best move:", error);
      throw error;
    }
  },
  
  // Add a player move to history
  addPlayerMove: function(from, to) {
    const uciMove = this.convertToUciMove(from, to);
    this.addMove(uciMove);
  },
  
  // Method to reset game state when starting a new game
  startNewGame: function() {
    this.resetGame();
  }
};

export default chessApi;
