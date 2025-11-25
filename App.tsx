import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import { LEVELS } from './data/levels';

function App() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');

  const handleDeath = () => {
    setDeaths(d => d + 1);
  };

  const handleLevelComplete = () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      setGameState('completed');
    }
  };

  const startGame = () => {
    setCurrentLevelIndex(0);
    setDeaths(0);
    setGameState('playing');
  };

  const goToMenu = () => {
    setGameState('menu');
  };

  return (
    <div className="flex flex-col items-center bg-[#2d2d2d] min-h-screen p-4 font-sans text-white select-none justify-center">
      {/* Top Bar */}
      <div className="w-[800px] flex justify-between items-center bg-black px-4 py-2 border-b-0 border-gray-600 text-xl font-bold tracking-wider mb-0">
        <button 
          onClick={goToMenu}
          className="text-white hover:text-gray-300 transition-colors focus:outline-none"
        >
          MENU
        </button>
        <div className="text-white">
          {gameState === 'menu' ? 'MAIN MENU' : 
           gameState === 'completed' ? 'COMPLETED!' : 
           `${currentLevelIndex + 1}/${LEVELS.length}`}
        </div>
        <div className="text-white">DEATHS: {deaths}</div>
      </div>

      {/* Game Area */}
      <div className="relative shadow-2xl">
        {gameState === 'menu' && (
          <div className="w-[800px] h-[450px] bg-[#b5b5ff] border-4 border-black flex flex-col items-center justify-center text-black relative overflow-hidden">
            {/* Simple decorative pattern for menu */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ 
                   backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)`,
                   backgroundSize: '40px 40px',
                   backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px' 
                 }} 
            />
            
            <h1 className="text-6xl font-black mb-2 text-center tracking-tighter drop-shadow-lg z-10">
              WORLD'S<br/>HARDEST GAME
            </h1>
            <p className="text-lg font-bold mb-8 z-10 opacity-75">You don't know what you're getting into.</p>
            
            <button 
              onClick={startGame}
              className="z-10 px-10 py-4 bg-blue-600 text-white text-2xl font-bold rounded border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-700 transition-all active:translate-y-2 active:shadow-none"
            >
              START GAME
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <GameCanvas 
            currentLevelIndex={currentLevelIndex} 
            deaths={deaths}
            onDeath={handleDeath}
            onLevelComplete={handleLevelComplete}
          />
        )}

        {gameState === 'completed' && (
          <div className="w-[800px] h-[450px] bg-[#b5b5ff] border-4 border-black flex flex-col items-center justify-center text-black">
             <h1 className="text-5xl font-black mb-4">YOU WIN!</h1>
             <p className="text-2xl mb-8 font-bold">Total Deaths: {deaths}</p>
             <button 
               onClick={startGame}
               className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-700 transition-all"
             >
               PLAY AGAIN
             </button>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="w-[800px] flex justify-between items-center bg-black px-4 py-2 mt-0 text-xl font-bold tracking-wider">
        <div className="text-white">PLAY MORE GAMES</div>
        <div className="text-white">SNUBBY LAND</div>
      </div>
      
      {/* Instructions */}
      {gameState === 'playing' && (
        <div className="mt-6 text-gray-400 text-center text-sm max-w-[600px] bg-black/20 p-4 rounded">
          <p className="mb-1 uppercase tracking-widest font-bold text-gray-500">How to Play</p>
          <div className="flex gap-8 justify-center">
            <p>Move: <span className="text-white font-bold">Arrow Keys</span></p>
            <p>Goal: <span className="text-green-400 font-bold">Green Zone</span></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;