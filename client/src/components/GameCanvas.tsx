import { useRef, useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import PixelButton from './PixelButton';
import PixelBorder from './PixelBorder';

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);
  const [coinJumping, setCoinJumping] = useState(false);
  
  const { 
    gameActive,
    score,
    incrementScore,
    startGame,
    powerLevel,
    speedLevel,
    luckLevel
  } = useGame();
  
  // Handle coin click
  const handleCoinClick = () => {
    if (!gameActive) return;
    
    // Add animation effect
    setCoinJumping(true);
    setTimeout(() => setCoinJumping(false), 500);
    
    // Increment score based on power level
    incrementScore();
    
    // Random bonus based on luck
    if (Math.random() < (0.05 * luckLevel)) {
      incrementScore(5 * luckLevel);
    }
  };

  return (
    <div className="text-center">
      <p className="font-pixel text-xl text-[#E52521] mb-4">TAP TO MINE BLOCKCHAIN COINS</p>
      
      <div className="relative mb-8 mx-auto w-32 h-32">
        <div 
          ref={coinRef}
          className={`absolute inset-0 ${!coinJumping ? 'animate-float-bob' : 'animate-jump'}`}
          onClick={handleCoinClick}
        >
          <svg 
            className="w-full h-full"
            viewBox="0 0 128 128" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="64" cy="64" r="60" fill="#FFCF40" stroke="#000" strokeWidth="4" />
            <circle cx="64" cy="64" r="50" fill="#FFDF80" />
            <text x="64" y="75" textAnchor="middle" fill="#000" fontFamily="Press Start 2P" fontSize="24">$</text>
            <circle cx="44" cy="45" r="5" fill="#FFFFFF" fillOpacity="0.7" />
          </svg>
        </div>
      </div>
      
      <PixelButton 
        variant="yellow"
        onClick={startGame}
      >
        {gameActive ? "MINING..." : "START MINING"}
      </PixelButton>
      
      <div className="mt-8 flex justify-center space-x-4">
        <PixelBorder background="red" className="p-2 flex flex-col items-center">
          <span className="font-retro text-white">POWER</span>
          <span className="font-pixel text-white text-sm">x{powerLevel}</span>
        </PixelBorder>
        <PixelBorder background="green" className="p-2 flex flex-col items-center">
          <span className="font-retro text-white">SPEED</span>
          <span className="font-pixel text-white text-sm">x{speedLevel}</span>
        </PixelBorder>
        <PixelBorder background="yellow" className="p-2 flex flex-col items-center">
          <span className="font-retro text-black">LUCK</span>
          <span className="font-pixel text-black text-sm">x{luckLevel}</span>
        </PixelBorder>
      </div>
    </div>
  );
};

export default GameCanvas;
