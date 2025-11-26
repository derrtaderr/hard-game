
import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import { LEVELS } from './data/levels';
import { AudioController } from './utils/audio';

function App() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [isMuted, setIsMuted] = useState(false);

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
    AudioController.startMusic();
    setCurrentLevelIndex(0);
    setDeaths(0);
    setGameState('playing');
  };

  const goToMenu = () => {
    // We can keep music playing or stop it. Original game keeps it.
    // Ensure audio context is ready if they clicked menu first
    AudioController.startMusic();
    setGameState('menu');
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    AudioController.setMuted(nextMute);
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
        <div className="flex items-center gap-6">
          <div className="text-white">DEATHS: {deaths}</div>
          <button onClick={toggleMute} className="text-white hover:text-gray-300 focus:outline-none" aria-label={isMuted ? "Unmute" : "Mute"}>
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            )}
          </button>
        </div>
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
