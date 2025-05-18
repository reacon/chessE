/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  React.useEffect(() => {
    // Set initial dark mode
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`py-4 px-6 flex justify-between items-center ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-md`}
      >
        <div className="flex items-center">
          <span className="text-3xl mr-2">♞</span>
          <h1 className="text-2xl font-bold">Out Of Stock Fish</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              isDarkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-blue-100 text-gray-800"
            }`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>
          <nav className="hidden md:flex space-x-6">
            <a
              href="#features"
              className="hover:text-blue-500 transition-colors"
            >
              Features
            </a>
            <a href="#about" className="hover:text-blue-500 transition-colors">
              About
            </a>
            <a href="#modes" className="hover:text-blue-500 transition-colors">
              Game Modes
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="chess-pattern w-full h-full"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Master the Game of Kings
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-90">
            Challenge our advanced chess engine, improve your skills, and become
            a better player
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              to="/play"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-colors shadow-lg"
            >
              Play Now
            </Link>
            <button className="px-8 py-4 bg-transparent border-2 border-gray-400 hover:border-white rounded-lg text-lg font-semibold transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className={`py-16 px-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Engine Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="♟️"
              title="Multiple Difficulty Levels"
              description="From beginner to grandmaster, our engine adapts to your skill level."
              isDarkMode={isDarkMode}
            />
            <FeatureCard
              icon="🔄"
              title="FEN Position Import"
              description="Study specific positions by importing FEN strings directly."
              isDarkMode={isDarkMode}
            />
            <FeatureCard
              icon="⏱️"
              title="Customizable Time Controls"
              description="Play with various time settings from bullet to classical."
              isDarkMode={isDarkMode}
            />
            <FeatureCard
              icon="📊"
              title="Move Analysis"
              description="Review your games with detailed move-by-move analysis."
              isDarkMode={isDarkMode}
            />
            <FeatureCard
              icon="🎨"
              title="Customizable Themes"
              description="Choose from multiple board and piece themes."
              isDarkMode={isDarkMode}
            />
            <FeatureCard
              icon="📱"
              title="Responsive Design"
              description="Play seamlessly on any device, from desktop to mobile."
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className={`py-16 px-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            About Our Engine
          </h2>
          <div
            className={`p-8 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <p className="text-lg mb-6">
              Out Of Stock Fish is built with modern web technologies to provide
              a smooth and engaging chess experience. Our engine combines
              powerful analysis capabilities with an intuitive interface.
            </p>
            <p className="text-lg mb-6">
              Whether you're a beginner learning the basics or an experienced
              player looking to sharpen your skills, our engine offers the
              features you need to improve your game.
            </p>
            <p className="text-lg">
              The engine evaluates millions of positions to find the best moves,
              providing a challenging opponent that adapts to your skill level.
              With multiple difficulty settings, you can gradually increase the
              challenge as your skills improve.
            </p>
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section
        id="modes"
        className={`py-16 px-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Game Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GameModeCard
              title="Standard Game"
              description="Play a complete game against our engine with standard chess rules."
              buttonText="Play Standard"
              link="/play"
              isDarkMode={isDarkMode}
            />
            <GameModeCard
              title="Position Analysis"
              description="Import a position using FEN notation and analyze or play from there."
              buttonText="Analyze Position"
              link="/play?mode=analysis"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className={`py-16 px-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Challenge Your Mind?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Start playing now and see how you measure up against our chess
            engine
          </p>
          <Link
            to="/play"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-colors shadow-lg inline-block"
          >
            Play Chess Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-8 px-6 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="max-w-6xl mx-auto flex justify-center items-center">
          <div className="flex items-center">
            <span className="text-3xl mr-2">♞</span>
            <h2 className="text-xl font-bold">Out Of Stock Fish</h2>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, isDarkMode }) => (
  <div
    className={`p-6 rounded-lg ${
      isDarkMode
        ? "bg-gray-700 hover:bg-gray-600"
        : "bg-gray-100 hover:bg-gray-200"
    } transition-colors`}
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
      {description}
    </p>
  </div>
);

const GameModeCard = ({ title, description, buttonText, link, isDarkMode }) => (
  <div
    className={`p-8 rounded-lg ${
      isDarkMode ? "bg-gray-700" : "bg-gray-100"
    } flex flex-col h-full`}
  >
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <p
      className={`${
        isDarkMode ? "text-gray-300" : "text-gray-600"
      } mb-6 flex-grow`}
    >
      {description}
    </p>
    <Link
      to={link}
      className={`px-6 py-3 ${
        isDarkMode
          ? "bg-blue-600 hover:bg-blue-700"
          : "bg-blue-500 hover:bg-blue-600"
      } text-white rounded-lg text-center font-medium transition-colors`}
    >
      {buttonText}
    </Link>
  </div>
);

export default HomePage;
