import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PixelBorder from './PixelBorder';
import { useGame } from '@/context/GameContext';

type HintType = 'general' | 'power' | 'speed' | 'luck' | 'quantum';

const AIHints = () => {
  const { character, score, powerLevel, speedLevel, luckLevel } = useGame();
  const [hintType, setHintType] = useState<HintType>('general');
  const [analysis, setAnalysis] = useState<{
    feedback: string;
    rating: number;
    improvement_tips: string[];
  } | null>(null);
  
  // Function to determine hint context based on game state
  const getHintContext = (): string => {
    switch(hintType) {
      case 'power':
        return `power level ${powerLevel}`;
      case 'speed':
        return `speed level ${speedLevel}`;
      case 'luck':
        return `luck level ${luckLevel}`;
      case 'quantum':
        return 'quantum fusion';
      default:
        return 'general gaming';
    }
  };
  
  // Fetch AI hint
  const { data: hintData, isLoading: hintLoading } = useQuery({
    queryKey: ['/api/ai/game-hint', hintType],
    queryFn: async () => {
      const context = getHintContext();
      const response = await fetch(`/api/ai/game-hint?context=${encodeURIComponent(context)}`);
      if (!response.ok) throw new Error('Failed to fetch hint');
      return response.json();
    },
    enabled: true,
    refetchInterval: 60000, // Refresh every minute
    refetchOnWindowFocus: false,
    retry: 1,
    throwOnError: false
  });
  
  // Request performance analysis when score changes significantly
  useEffect(() => {
    if (score > 100) {
      const fetchAnalysis = async () => {
        try {
          const response = await fetch('/api/ai/analyze-performance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score, character })
          });
          
          if (response.ok) {
            const data = await response.json();
            setAnalysis(data);
          }
        } catch (error) {
          console.error('Error fetching analysis:', error);
        }
      };
      
      fetchAnalysis();
    }
  }, [score, character]);
  
  // Rotate through hint types
  useEffect(() => {
    const types: HintType[] = ['general', 'power', 'speed', 'luck', 'quantum'];
    const interval = setInterval(() => {
      setHintType(prevType => {
        const currentIndex = types.indexOf(prevType);
        return types[(currentIndex + 1) % types.length];
      });
    }, 15000); // Change hint type every 15 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Generate star rating display
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-400'}`}>★</span>
    ));
  };
  
  return (
    <PixelBorder background="black" className="p-4 max-w-md mx-auto my-4">
      <h3 className="font-pixel text-[#9C27B0] text-xl mb-2">SUPER AI ASSISTANT</h3>
      
      <div className="bg-black bg-opacity-50 p-3 rounded mb-3">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 bg-[#9C27B0] rounded-full flex items-center justify-center mr-3">
            <span className="font-bold text-white">AI</span>
          </div>
          <div>
            <h4 className="font-retro text-[#9C27B0]">QUANTUM ADVICE</h4>
            <div className="flex">
              {['general', 'power', 'speed', 'luck', 'quantum'].map((type) => (
                <span 
                  key={type}
                  className={`w-2 h-2 rounded-full mx-1 ${hintType === type ? 'bg-[#9C27B0]' : 'bg-gray-500'}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {hintLoading ? (
          <p className="font-retro text-white text-sm animate-pulse">Generating quantum advice...</p>
        ) : (
          <p className="font-retro text-white text-sm">{hintData?.hint || "Connect with the AI for smart gaming tips!"}</p>
        )}
      </div>
      
      {analysis && (
        <div className="bg-[#4A148C] bg-opacity-30 p-3 rounded">
          <h4 className="font-pixel text-[#CE93D8] text-lg mb-2">PERFORMANCE ANALYSIS</h4>
          <div className="mb-2">
            {renderStars(analysis.rating)}
          </div>
          <p className="font-retro text-white text-sm mb-2">{analysis.feedback}</p>
          <ul className="list-disc list-inside">
            {analysis.improvement_tips.map((tip, index) => (
              <li key={index} className="font-retro text-[#CE93D8] text-xs mb-1">{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </PixelBorder>
  );
};

export default AIHints;