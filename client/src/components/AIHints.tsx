import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useGame } from '@/context/GameContext';
import PixelBorder from './PixelBorder';

type HintType = 'general' | 'power' | 'speed' | 'luck' | 'quantum';

const AIHints = () => {
  const { score, powerLevel, speedLevel, luckLevel } = useGame();
  const [hintType, setHintType] = useState<HintType>('general');
  const [analysis, setAnalysis] = useState<{
    feedback: string;
    rating: number;
    improvement_tips: string[];
  } | null>(null);

  // Rotate through different hint types
  useEffect(() => {
    const types: HintType[] = ['general', 'power', 'speed', 'luck', 'quantum'];
    const interval = setInterval(() => {
      const currentIndex = types.indexOf(hintType);
      const nextIndex = (currentIndex + 1) % types.length;
      setHintType(types[nextIndex]);
    }, 15000); // Change hint type every 15 seconds

    return () => clearInterval(interval);
  }, [hintType]);

  // Function to determine hint context based on game state
  const getHintContext = (): string => {
    switch(hintType) {
      case 'power':
        return `power level ${powerLevel}, maximize mining efficiency`;
      case 'speed':
        return `speed level ${speedLevel}, optimize coin collection speed`;
      case 'luck':
        return `luck level ${luckLevel}, increase bonus chances`;
      case 'quantum':
        return 'quantum fusion mechanics, special power-ups';
      default:
        return 'blockchain mining strategy tips';
    }
  };

  // Fetch AI hint
  const { data: hintData, isLoading: hintLoading } = useQuery({
    queryKey: ['/api/ai/game-hint', hintType, powerLevel, speedLevel, luckLevel],
    queryFn: async () => {
      const context = getHintContext();
      const response = await fetch(`/api/ai/game-hint?context=${encodeURIComponent(context)}`);
      if (!response.ok) throw new Error('Failed to fetch hint');
      return response.json();
    },
    enabled: true,
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: false,
    staleTime: 20000
  });

  // Get color for hint type
  const getHintColor = (): string => {
    switch(hintType) {
      case 'power': return 'bg-[#E52521]';
      case 'speed': return 'bg-[#43B047]';
      case 'luck': return 'bg-[#FBD000]';
      case 'quantum': return 'bg-[#9C27B0]';
      default: return 'bg-[#5C94FC]';
    }
  };

  // Get icon for hint type
  const getHintIcon = (): string => {
    switch(hintType) {
      case 'power': return '💪';
      case 'speed': return '⚡';
      case 'luck': return '🍀';
      case 'quantum': return '✨';
      default: return '💡';
    }
  };

  return (
    <PixelBorder className={`p-3 ${getHintColor()} bg-opacity-90 transition-all duration-500`}>
      <div className="flex items-start">
        <div className="font-pixel text-2xl mr-3">{getHintIcon()}</div>
        <div>
          <h3 className="font-pixel text-white text-sm mb-1">
            AI CRYPTO ADVISOR: {hintType.toUpperCase()}
          </h3>
          <div className="text-white font-retro">
            {hintLoading ? (
              <div className="flex space-x-2 animate-pulse">
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
            ) : (
              <p>{hintData?.hint || "Gathering blockchain intelligence..."}</p>
            )}
          </div>
        </div>
      </div>
    </PixelBorder>
  );
};

export default AIHints;