
// import { GameProvider } from "./context/GameContext";
// import Board from "./components/Board/Board";
// import Sidebar from "./components/Sidebar/Sidebar";
// import TimeoutModal from "./components/Modals/TimeoutModal";
// import { useGameContext } from "./context/GameContext";
// import { useChessTimer } from "./hooks/useChessTimer";

// const ChessApp = () => {
//   const { isDarkMode } = useGameContext();
  
//   // Initialize the timer
//   useChessTimer();

//   return (
//     <div className={`flex flex-col lg:flex-row h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
//       <div className="flex-1 p-4 flex items-center justify-center">
//         <Board />
//       </div>
//       <Sidebar />
//       <TimeoutModal />
//     </div>
//   );
// };

// const App = () => {
//   return (
//     <GameProvider>
//       <ChessApp />
//     </GameProvider>
//   );
// };

// export default App;
// // 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import DashboardPage from "./DashboardPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
