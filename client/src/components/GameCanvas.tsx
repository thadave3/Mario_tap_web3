import { useRef, useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import PixelButton from './PixelButton';
import PixelBorder from './PixelBorder';
import CryptoFusion from './CryptoFusion';

// Audio setup for game sounds
const createAudio = (src: string) => {
  const audio = new Audio();
  audio.src = `data:audio/mp3;base64,${src}`;
  return audio;
};

// Simple base64 encoded sound effects
const COIN_SOUND = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAFAAAKmgA4ODg4ODg4ODg4ODg4ODhVVVVVVVVVVVVVVVVVVVVqqqqqqqqqqqqqqqqqqqqq0NDQ0NDQ0NDQ0NDQ0NDQ0P////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYHAAAAAAAACpoWvJzZAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";
const BONUS_SOUND = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAFAAAKmgA4ODg4ODg4ODg4ODg4ODhVVVVVVVVVVVVVVVVVVVVqqqqqqqqqqqqqqqqqqqqq0NDQ0NDQ0NDQ0NDQ0NDQ0P////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAZEAAAAAAAACpp4R40QAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";
const START_SOUND = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAFAAAKmgA4ODg4ODg4ODg4ODg4ODhVVVVVVVVVVVVVVVVVVVVqqqqqqqqqqqqqqqqqqqqq0NDQ0NDQ0NDQ0NDQ0NDQ0P////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAZUAAAAAAAACpqmqY2ZAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";

// Preload sounds
const coinSound = createAudio(COIN_SOUND);
const bonusSound = createAudio(BONUS_SOUND);
const startSound = createAudio(START_SOUND);

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);
  const [coinJumping, setCoinJumping] = useState(false);
  const [popupRewards, setPopupRewards] = useState<{id: number, value: number, x: number, y: number, type: string}[]>([]);
  const [popupCounter, setPopupCounter] = useState(0);
  const [showFusion, setShowFusion] = useState(false);
  const [totalClicks, setTotalClicks] = useState(0);
  
  const { 
    gameActive,
    score,
    incrementScore,
    startGame,
    powerLevel,
    speedLevel,
    luckLevel
  } = useGame();
  
  // Start game with sound
  const handleStartGame = () => {
    startSound.play().catch(e => console.log("Sound play error:", e));
    startGame();
  };
  
  // Handle coin click with improved feedback
  // Function to handle fusion event completion
  const handleFusionComplete = () => {
    setShowFusion(false);
    
    // Give a special bonus for completing fusion
    const quantumBonus = 50 * powerLevel * luckLevel;
    incrementScore(quantumBonus);
    
    // Show a special popup for the quantum bonus
    setPopupCounter(prev => prev + 1);
    const quantumId = popupCounter + 1;
    setPopupRewards(prev => [
      ...prev, 
      { 
        id: quantumId, 
        value: quantumBonus, 
        x: 50, 
        y: 50, 
        type: 'quantum' 
      }
    ]);
    
    // Remove quantum popup after animation
    setTimeout(() => {
      setPopupRewards(prev => prev.filter(r => r.id !== quantumId));
    }, 2000);
  };

  // Check if we should trigger fusion event based on click count
  useEffect(() => {
    if (totalClicks >= 15 && gameActive && !showFusion) {
      setShowFusion(true);
      setTotalClicks(0);
    }
  }, [totalClicks, gameActive, showFusion]);
  
  // Reset fusion and click count when game starts/stops
  useEffect(() => {
    if (!gameActive) {
      setShowFusion(false);
      setTotalClicks(0);
    }
  }, [gameActive]);

  const handleCoinClick = () => {
    if (!gameActive) return;
    
    // Increment total clicks
    setTotalClicks(prev => prev + 1);
    
    // Play coin sound
    coinSound.play().catch(e => console.log("Sound play error:", e));
    
    // Add animation effect
    setCoinJumping(true);
    setTimeout(() => setCoinJumping(false), 300);
    
    // Get random position for popup reward
    const coinElement = coinRef.current;
    let x = 50;
    let y = 50;
    
    if (coinElement) {
      const rect = coinElement.getBoundingClientRect();
      x = Math.random() * rect.width;
      y = Math.random() * rect.height;
    }
    
    // Determine crypto type randomly
    const cryptoTypes = ['bitcoin', 'ethereum', 'dogecoin', 'bnb', 'coin'];
    const cryptoType = cryptoTypes[Math.floor(Math.random() * cryptoTypes.length)];
    
    // Show popup reward
    const baseValue = powerLevel;
    setPopupCounter(prev => prev + 1);
    setPopupRewards(prev => [
      ...prev, 
      { 
        id: popupCounter, 
        value: baseValue, 
        x, 
        y, 
        type: cryptoType 
      }
    ]);
    
    // Remove popup after animation
    setTimeout(() => {
      setPopupRewards(prev => prev.filter(r => r.id !== popupCounter));
    }, 1000);
    
    // Increment score based on power level
    incrementScore();
    
    // Random bonus based on luck
    if (Math.random() < (0.05 * luckLevel)) {
      // Play bonus sound for special rewards
      bonusSound.play().catch(e => console.log("Sound play error:", e));
      
      const bonusValue = 5 * luckLevel;
      incrementScore(bonusValue);
      
      // Show bonus popup
      setPopupCounter(prev => prev + 1);
      const bonusId = popupCounter + 1;
      setPopupRewards(prev => [
        ...prev, 
        { 
          id: bonusId, 
          value: bonusValue, 
          x: x + 20, 
          y: y - 20, 
          type: 'bonus' 
        }
      ]);
      
      // Remove bonus popup after animation
      setTimeout(() => {
        setPopupRewards(prev => prev.filter(r => r.id !== bonusId));
      }, 1500);
    }
  };

  // Special crypto coin symbols
  const getCryptoSymbol = (type: string) => {
    switch (type) {
      case 'bitcoin':
        return '₿';
      case 'ethereum':
        return 'Ξ';
      case 'dogecoin':
        return 'Ð';
      case 'bnb':
        return 'BNB';
      case 'bonus':
        return '+';
      case 'quantum':
        return 'Q+';
      default:
        return '$';
    }
  };

  return (
    <div className="text-center">
      {/* Crypto Fusion Animation - shows only when triggered */}
      <CryptoFusion 
        active={showFusion} 
        onComplete={handleFusionComplete} 
      />
      
      <p className="font-pixel text-xl text-[#E52521] mb-4">TAP TO MINE CRYPTO COINS</p>
      
      <div className="relative mb-8 mx-auto w-32 h-32">
        {/* Popup rewards */}
        {popupRewards.map((reward) => (
          <div 
            key={reward.id}
            className={`absolute font-pixel text-xl animate-float-up ${
              reward.type === 'bonus' ? 'text-[#FFD700] font-bold' : 
              reward.type === 'quantum' ? 'text-[#9C27B0] font-bold text-2xl' : 'text-[#FFFFFF]'
            }`}
            style={{ 
              left: `${reward.x}px`, 
              top: `${reward.y}px`,
              textShadow: '2px 2px 0px #000'
            }}
          >
            +{reward.value} {getCryptoSymbol(reward.type)}
          </div>
        ))}
      
        {/* Main coin that can be clicked */}
        <div 
          ref={coinRef}
          className={`absolute inset-0 ${!coinJumping ? 'animate-float-bob' : 'animate-jump'} cursor-pointer`}
          onClick={handleCoinClick}
        >
          <svg 
            className="w-full h-full"
            viewBox="0 0 128 128" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="64" cy="64" r="60" fill="#FFCF40" stroke="#000" strokeWidth="4" />
            <circle cx="64" cy="64" r="50" fill="#FFDF80" />
            <text x="64" y="75" textAnchor="middle" fill="#000" fontFamily="Press Start 2P" fontSize="24">{totalClicks >= 10 ? "Q+" : "$"}</text>
            <circle cx="44" cy="45" r="5" fill="#FFFFFF" fillOpacity="0.7" />
          </svg>
        </div>
      </div>
      
      <PixelButton 
        variant="yellow"
        onClick={handleStartGame}
        className="transition transform hover:scale-105 active:scale-95"
      >
        {gameActive ? "MINING..." : "START MINING"}
      </PixelButton>
      
      <div className="mt-8 flex justify-center space-x-4">
        <PixelBorder background="red" className="p-2 flex flex-col items-center transition transform hover:scale-105">
          <span className="font-retro text-white">POWER</span>
          <span className="font-pixel text-white text-sm">x{powerLevel}</span>
        </PixelBorder>
        <PixelBorder background="green" className="p-2 flex flex-col items-center transition transform hover:scale-105">
          <span className="font-retro text-white">SPEED</span>
          <span className="font-pixel text-white text-sm">x{speedLevel}</span>
        </PixelBorder>
        <PixelBorder background="yellow" className="p-2 flex flex-col items-center transition transform hover:scale-105">
          <span className="font-retro text-black">LUCK</span>
          <span className="font-pixel text-black text-sm">x{luckLevel}</span>
        </PixelBorder>
      </div>
      
      {/* Crypto currency fusion display */}
      {gameActive && (
        <div className="mt-8 bg-black bg-opacity-30 p-4 rounded-lg">
          <h3 className="font-pixel text-white text-sm mb-2">QUANTUM+ FUSION EVENT</h3>
          <div className="flex justify-center items-center space-x-2">
            <div className="bg-[#F7931A] p-2 rounded-full text-white font-bold">₿</div>
            <div className="bg-[#627EEA] p-2 rounded-full text-white font-bold">Ξ</div>
            <div className="bg-[#C2A633] p-2 rounded-full text-white font-bold">Ð</div>
            <div className="bg-[#F3BA2F] p-2 rounded-full text-white font-bold">BNB</div>
            <div className="w-24 h-6 bg-[#8D6E63] relative">
              <div className="absolute top-1 w-full h-4 bg-[#6D4C41]"></div>
            </div>
            <div className="bg-[#9C27B0] p-2 rounded-full text-white font-bold animate-pulse">Q+</div>
          </div>
          <p className="font-retro text-white text-xs mt-2">Coins enter the pipe and merge into Quantum+ super currency!</p>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
