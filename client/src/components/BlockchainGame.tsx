import { useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import PixelButton from './PixelButton';
import PixelBorder from './PixelBorder';
import Coin from './Coin';
import GameCanvas from './GameCanvas';

const BlockchainGame = () => {
  const { 
    score, 
    timeLeft, 
    powerLevel, 
    speedLevel, 
    luckLevel,
    gameActive,
    startGame,
    decrementTime
  } = useGame();
  
  // Setup timer for game
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameActive) {
      timer = setInterval(() => {
        decrementTime();
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameActive, decrementTime]);

  // Demo leaderboard
  const leaderboard = [
    { name: 'CryptoMario', coins: 9850, avatar: 'mario' },
    { name: 'LuigiMiner', coins: 8210, avatar: 'luigi' },
    { name: 'PrincessChain', coins: 7540, avatar: 'princess' }
  ];

  const getAvatarSvg = (avatar: string) => {
    switch (avatar) {
      case 'mario':
        return (
          <svg className="w-10 h-10 rounded mr-3" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" fill="#E52521" />
            <rect x="10" y="8" width="20" height="12" fill="#FFB266" />
            <rect x="10" y="20" width="20" height="4" fill="#000000" />
            <rect x="14" y="12" width="4" height="4" fill="#000000" />
            <rect x="22" y="12" width="4" height="4" fill="#000000" />
          </svg>
        );
      case 'luigi':
        return (
          <svg className="w-10 h-10 rounded mr-3" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" fill="#43B047" />
            <rect x="10" y="8" width="20" height="12" fill="#FFB266" />
            <rect x="10" y="20" width="20" height="4" fill="#000000" />
            <rect x="14" y="12" width="4" height="4" fill="#000000" />
            <rect x="22" y="12" width="4" height="4" fill="#000000" />
          </svg>
        );
      default:
        return (
          <svg className="w-10 h-10 rounded mr-3" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" fill="#FBD000" />
            <rect x="10" y="8" width="20" height="12" fill="#FFB266" />
            <rect x="10" y="20" width="20" height="4" fill="#000000" />
            <rect x="14" y="12" width="4" height="4" fill="#000000" />
            <rect x="22" y="12" width="4" height="4" fill="#000000" />
          </svg>
        );
    }
  };

  return (
    <section className="py-16 px-6 relative" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23000'/%3E%3Crect width='50' height='50' fill='%23333'/%3E%3Crect x='50' y='50' width='50' height='50' fill='%23333'/%3E%3C/svg%3E")`,
      backgroundSize: '100px 100px'
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-black bg-opacity-70 p-8 rounded-lg">
          <h2 className="font-pixel text-center text-2xl md:text-3xl text-[#FFCF40] mb-8">BLOCKCHAIN MINI-GAME</h2>
          
          <div className="game-window mx-auto max-w-2xl bg-[#5C94FC] p-4 relative h-96">
            {/* Game UI elements */}
            <div className="absolute top-4 left-4 flex items-center bg-black bg-opacity-50 p-2 rounded">
              <Coin className="mr-2" />
              <span className="font-pixel text-xs text-white">{score}</span>
            </div>
            
            <div className="absolute top-4 right-4 flex items-center bg-black bg-opacity-50 p-2 rounded">
              <span className="font-pixel text-xs text-white mr-2">TIME:</span>
              <span className="font-pixel text-xs text-white">{timeLeft}</span>
            </div>
            
            {/* Game canvas */}
            <div className="absolute inset-0 flex items-center justify-center">
              <GameCanvas />
            </div>
            
            {/* Game floor */}
            <div className="absolute bottom-0 left-0 right-0 h-16 brick"></div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-pixel text-white text-lg mb-4">BLOCKCHAIN LEADERBOARD</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {leaderboard.map((player, index) => (
                <div key={index} className="flex items-center bg-[#5C94FC] bg-opacity-20 p-3 rounded">
                  {getAvatarSvg(player.avatar)}
                  <div>
                    <p className="font-retro text-white text-lg">{player.name}</p>
                    <p className="font-pixel text-[#FFCF40] text-xs">{player.coins.toLocaleString()} coins</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainGame;
