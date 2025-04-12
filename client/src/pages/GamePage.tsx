import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PixelBorder from '@/components/PixelBorder';
import PixelButton from '@/components/PixelButton';
import { useGame } from '@/context/GameContext';
import GameCanvas from '@/components/GameCanvas';

const GamePage = () => {
  const { 
    score, 
    timeLeft, 
    gameActive, 
    powerLevel, 
    speedLevel, 
    luckLevel,
    coins,
    resetGame,
    upgradePower,
    upgradeSpeed,
    upgradeLuck
  } = useGame();
  
  // Reset game when component unmounts
  useEffect(() => {
    return () => {
      resetGame();
    };
  }, [resetGame]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-12 px-6 relative" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23000'/%3E%3Crect width='50' height='50' fill='%23333'/%3E%3Crect x='50' y='50' width='50' height='50' fill='%23333'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px'
      }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="font-pixel text-center text-3xl text-[#FBD000] mb-8">BLOCKCHAIN MINI-GAME</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <PixelBorder background="black" className="p-4 bg-opacity-80 relative">
                <div className="game-window mx-auto bg-[#5C94FC] p-4 relative h-96">
                  {/* Game UI elements */}
                  <div className="absolute top-4 left-4 flex items-center bg-black bg-opacity-50 p-2 rounded">
                    <svg 
                      className="w-6 h-6 mr-2 animate-coin-spin"
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" fill="#FFCF40" />
                      <text x="12" y="15" textAnchor="middle" fill="#000" fontFamily="Press Start 2P" fontSize="8">$</text>
                    </svg>
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
                
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <PixelButton 
                    variant="red" 
                    className="w-full"
                    onClick={upgradePower}
                    disabled={coins < powerLevel * 10}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-retro">POWER UP</span>
                      <span className="font-pixel text-xs mt-1">{powerLevel * 10} COINS</span>
                    </div>
                  </PixelButton>
                  
                  <PixelButton 
                    variant="green" 
                    className="w-full"
                    onClick={upgradeSpeed}
                    disabled={coins < speedLevel * 10}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-retro">SPEED UP</span>
                      <span className="font-pixel text-xs mt-1">{speedLevel * 10} COINS</span>
                    </div>
                  </PixelButton>
                  
                  <PixelButton 
                    variant="yellow" 
                    className="w-full"
                    onClick={upgradeLuck}
                    disabled={coins < luckLevel * 10}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-retro">LUCK UP</span>
                      <span className="font-pixel text-xs mt-1">{luckLevel * 10} COINS</span>
                    </div>
                  </PixelButton>
                </div>
              </PixelBorder>
            </div>
            
            <div>
              <PixelBorder background="black" className="p-4 bg-opacity-80 text-white">
                <h2 className="font-pixel text-[#FBD000] text-xl mb-4">HOW TO PLAY</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-retro text-lg text-[#E52521]">1. START MINING</h3>
                    <p className="font-retro">Click the Start Mining button to begin the game. You have 60 seconds to mine as many coins as possible!</p>
                  </div>
                  
                  <div>
                    <h3 className="font-retro text-lg text-[#43B047]">2. TAP THE COIN</h3>
                    <p className="font-retro">Click on the floating coin to mine blockchain coins. Each tap earns you coins based on your Power level.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-retro text-lg text-[#FBD000]">3. UPGRADE ABILITIES</h3>
                    <p className="font-retro">Use your earned coins to upgrade your mining abilities:</p>
                    <ul className="list-disc list-inside font-retro ml-4">
                      <li>Power: More coins per tap</li>
                      <li>Speed: Faster tapping</li>
                      <li>Luck: Chance for bonus coins</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-retro text-lg text-[#5C94FC]">4. COMPETE</h3>
                    <p className="font-retro">Get on the leaderboard with the highest score to earn special rewards and NFTs!</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h2 className="font-pixel text-[#FBD000] text-xl mb-4">YOUR STATS</h2>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between">
                        <span className="font-retro">Power Level:</span>
                        <span className="font-pixel text-[#E52521]">x{powerLevel}</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 mt-1">
                        <div className="bg-[#E52521] h-2" style={{ width: `${powerLevel * 10}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <span className="font-retro">Speed Level:</span>
                        <span className="font-pixel text-[#43B047]">x{speedLevel}</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 mt-1">
                        <div className="bg-[#43B047] h-2" style={{ width: `${speedLevel * 10}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <span className="font-retro">Luck Level:</span>
                        <span className="font-pixel text-[#FBD000]">x{luckLevel}</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 mt-1">
                        <div className="bg-[#FBD000] h-2" style={{ width: `${luckLevel * 10}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </PixelBorder>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GamePage;
