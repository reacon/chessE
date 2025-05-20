package engine

import (
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func (inter *UCIInterface) goCommandResponse2(command string) string {
	if inter.OptionUseBook {
		if entries, ok := inter.OpeningBook[GenPolyglotHash(&inter.Search.Pos)]; ok {

			// To allow opening variety, randomly select a move from an entry matching
			// the current position.
			entry := entries[rand.Intn(len(entries))]
			move := moveFromCoord(&inter.Search.Pos, entry.Move)

			if inter.Search.Pos.MoveIsPseduoLegal(move) {
				time.Sleep(time.Duration(inter.OptionBookMoveDelay) * time.Second)
				return fmt.Sprint(move)
				// return fmt.Sprint(move.FromSq(), " ", move.ToSq())
			}
		}
	}

	command = strings.TrimPrefix(command, "go")
	command = strings.TrimPrefix(command, " ")
	fields := strings.Fields(command)

	colorPrefix := "b"
	if inter.Search.Pos.SideToMove == White {
		colorPrefix = "w"
	}

	// Parse the go command arguments.
	timeLeft, increment, movesToGo := int(InfiniteTime), int(NoValue), int(NoValue)
	maxDepth, maxNodeCount, moveTime := uint64(MaxDepth), uint64(math.MaxUint64), uint64(NoValue)

	for index, field := range fields {
		if strings.HasPrefix(field, colorPrefix) {
			if strings.HasSuffix(field, "time") {
				timeLeft, _ = strconv.Atoi(fields[index+1])
			} else if strings.HasSuffix(field, "inc") {
				increment, _ = strconv.Atoi(fields[index+1])
			}
		} else if field == "movestogo" {
			movesToGo, _ = strconv.Atoi(fields[index+1])
		} else if field == "depth" {
			maxDepth, _ = strconv.ParseUint(fields[index+1], 10, 8)
		} else if field == "nodes" {
			maxNodeCount, _ = strconv.ParseUint(fields[index+1], 10, 64)
		} else if field == "movetime" {
			moveTime, _ = strconv.ParseUint(fields[index+1], 10, 64)
		}
	}

	// Setup the timer with the go command time control information.
	inter.Search.Timer.Setup(
		int64(timeLeft),
		int64(increment),
		int64(moveTime),
		int16(movesToGo),
		uint8(maxDepth),
		maxNodeCount,
	)

	// Report the best move found by the engine to the GUI.
	bestMove := inter.Search.Search()
	return fmt.Sprint(bestMove)
	// return fmt.Sprint(bestMove.FromSq(), " ", bestMove.ToSq())
}

func (inter *UCIInterface) positionCommandResponse2(command string) {
	// Load in the fen string describing the position,
	// or load in the starting position.
	args := strings.TrimPrefix(command, "position ")
	fenString := ""

	if strings.HasPrefix(args, "startpos") {
		args = strings.TrimPrefix(args, "startpos ")
		fenString = FENStartPosition
	} else if strings.HasPrefix(args, "fen") {
		args = strings.TrimPrefix(args, "fen ")
		remaining_args := strings.Fields(args)
		fenString = strings.Join(remaining_args[0:6], " ")
		args = strings.Join(remaining_args[6:], " ")
	}

	// Set the board to the appropriate position and make
	// the moves that have occured if any to update the position.
	inter.Search.Setup(fenString)
	if strings.HasPrefix(args, "moves") {
		args = strings.TrimSuffix(strings.TrimPrefix(args, "moves"), " ")
		if args != "" {
			for _, moveAsString := range strings.Fields(args) {
				move := moveFromCoord(&inter.Search.Pos, moveAsString)
				inter.Search.Pos.DoMove(move)
				inter.Search.AddHistory(inter.Search.Pos.Hash)

				// Decrementing the history counter here makes
				// sure that no state is saved on the position's
				// history stack since this move will never be undone.
				inter.Search.Pos.StatePly--
			}
		}
	}
}

type BestMoveRequest struct {
	Fen       string `json:"fen"`
	ThinkTime int    `json:"time"`
}

type BestMoveResponse struct {
	OriginalFen string `json:"original_fen"`
	BestMove    string `json:"best_move"`
	Fen         string `json:"fen"`
	Error       string `json:"error,omitempty"`
}

func getBestMove(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	// Parse request body
	var request BestMoveRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(BestMoveResponse{
			Error: "Invalid request format",
		})
		return
	}

	// Validate FEN string
	if request.Fen == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(BestMoveResponse{
			Error: "FEN string is required",
		})
		return
	}

	// Initialize the UCI interface
	// uci := NewUCIInterface(request.ThinkTime)
	uci := NewUCIInterface(0)
	uci.Search.TT.Resize(DefaultTTSize, PerftEntrySize)
	// uci.Search.Setup(FENStartPosition)
	uci.Search.Setup(request.Fen)
	uci.OpeningBook = make(map[uint64][]PolyglotEntry)
	uci.OptionBookMoveDelay = DefaultBookMoveDelay

	// Set up the position
	positionCommand := "position fen " + request.Fen
	// uci.positionCommandResponse2(positionCommand)

	// Get the best move
	bestMove := uci.goCommandResponse2(fmt.Sprintf("go movetime %d000", request.ThinkTime))

	// Make the move to get the new position
	uci.positionCommandResponse2(positionCommand + " moves " + bestMove)
	newFen := uci.Search.Pos.GenFEN()
	bestMove = bestMove[:2] + " " + bestMove[2:]

	// Prepare and send response
	response := BestMoveResponse{
		OriginalFen: request.Fen,
		BestMove:    bestMove,
		Fen:         newFen,
	}

	json.NewEncoder(w).Encode(response)
}

func RunServer() {
	// Create a new ServeMux
	mux := http.NewServeMux()

	// Register routes
	mux.HandleFunc("/best-move", getBestMove)

	// Configure the server
	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	// Start server
	println("Server is running on port 8080...")
	if err := server.ListenAndServe(); err != nil {
		panic(err)
	}
}
