import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface GameContextType {
  coins: number;
  score: number;
  timeLeft: number;
  character: string;
  level: number;
  experience: number;
  powerLevel: number;
  speedLevel: number;
  luckLevel: number;
  gameActive: boolean;
  userId: number | null;
  
  // Game actions
  incrementScore: (amount?: number) => void;
  decrementTime: () => void;
  resetGame: () => void;
  startGame: () => void;
  endGame: () => void;
  
  // User actions
  setCoins: (coins: number) => void;
  setCharacter: (character: string) => void;
  setUserId: (id: number | null) => void;
  
  // Upgrades
  upgradePower: () => void;
  upgradeSpeed: () => void;
  upgradeLuck: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<number | null>(null);
  const [coins, setCoins] = useState(100);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [character, setCharacter] = useState('mario');
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [powerLevel, setPowerLevel] = useState(1);
  const [speedLevel, setSpeedLevel] = useState(1);
  const [luckLevel, setLuckLevel] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  
  const incrementScore = useCallback((amount = 1) => {
    setScore(prev => prev + (amount * powerLevel));
    setExperience(prev => prev + (amount * powerLevel));
    
    // Level up if experience is enough
    if (experience >= level * 100) {
      setLevel(prev => prev + 1);
      setExperience(0);
    }
  }, [powerLevel, experience, level]);
  
  const decrementTime = useCallback(() => {
    setTimeLeft(prev => Math.max(0, prev - 1));
    
    if (timeLeft <= 1) {
      endGame();
    }
  }, [timeLeft]);
  
  const resetGame = useCallback(() => {
    setScore(0);
    setTimeLeft(60);
    setGameActive(false);
  }, []);
  
  const startGame = useCallback(() => {
    resetGame();
    setGameActive(true);
  }, [resetGame]);
  
  const endGame = useCallback(() => {
    setGameActive(false);
    // Submit score to backend if user is logged in
    if (userId) {
      const finalScore = score * (powerLevel + speedLevel + luckLevel);
      fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          score: finalScore
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.coinsEarned) {
          setCoins(prev => prev + data.coinsEarned);
        }
      })
      .catch(error => console.error('Error saving score:', error));
    }
  }, [score, userId, powerLevel, speedLevel, luckLevel]);
  
  const upgradePower = useCallback(() => {
    if (coins >= powerLevel * 10) {
      setCoins(prev => prev - (powerLevel * 10));
      setPowerLevel(prev => prev + 1);
    }
  }, [coins, powerLevel]);
  
  const upgradeSpeed = useCallback(() => {
    if (coins >= speedLevel * 10) {
      setCoins(prev => prev - (speedLevel * 10));
      setSpeedLevel(prev => prev + 1);
    }
  }, [coins, speedLevel]);
  
  const upgradeLuck = useCallback(() => {
    if (coins >= luckLevel * 10) {
      setCoins(prev => prev - (luckLevel * 10));
      setLuckLevel(prev => prev + 1);
    }
  }, [coins, luckLevel]);
  
  return (
    <GameContext.Provider value={{
      coins,
      score,
      timeLeft,
      character,
      level,
      experience,
      powerLevel,
      speedLevel,
      luckLevel,
      gameActive,
      userId,
      
      incrementScore,
      decrementTime,
      resetGame,
      startGame,
      endGame,
      
      setCoins,
      setCharacter,
      setUserId,
      
      upgradePower,
      upgradeSpeed,
      upgradeLuck,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
