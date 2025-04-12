import { useState, useEffect } from 'react';
import PixelBorder from './PixelBorder';

interface CryptoFusionProps {
  active: boolean;
  onComplete?: () => void;
}

const CryptoFusion = ({ active, onComplete }: CryptoFusionProps) => {
  const [step, setStep] = useState(0);
  const [showQuantum, setShowQuantum] = useState(false);
  
  // Reset animation when inactive
  useEffect(() => {
    if (!active) {
      setStep(0);
      setShowQuantum(false);
      return;
    }
    
    // Animation sequence
    const timer1 = setTimeout(() => setStep(1), 500);
    const timer2 = setTimeout(() => setStep(2), 1500);
    const timer3 = setTimeout(() => setStep(3), 2500);
    const timer4 = setTimeout(() => {
      setShowQuantum(true);
      // Play fusion sound effect
      const fusionSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAFAAAKmgA4ODg4ODg4ODg4ODg4ODhVVVVVVVVVVVVVVVVVVVVqqqqqqqqqqqqqqqqqqqqq0NDQ0NDQ0NDQ0NDQ0NDQ0P////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAZUAAAAAAAACpqmqY2ZAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==');
      fusionSound.play().catch(e => console.log("Sound play error:", e));
    }, 3500);
    const timer5 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [active, onComplete]);
  
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
      <PixelBorder background="black" className="p-8 relative">
        <h2 className="font-pixel text-center text-2xl text-[#9C27B0] mb-6">QUANTUM+ FUSION EVENT</h2>
        
        <div className="relative h-48 w-96">
          {/* Mario pipe */}
          <div className="absolute left-0 top-16 w-20 h-16 bg-[#209B66] border-4 border-black rounded-t-lg"></div>
          <div className="absolute right-0 top-16 w-20 h-16 bg-[#209B66] border-4 border-black rounded-t-lg"></div>
          
          {/* Pipe connector */}
          <div className="absolute left-20 right-20 top-20 h-8 bg-[#8D6E63] border-t-4 border-b-4 border-black"></div>
          
          {/* Crypto coins */}
          <div 
            className={`absolute left-2 top-6 bg-[#F7931A] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-black transition-all duration-1000 ${
              step >= 1 ? 'animate-tunnel-travel opacity-0' : ''
            }`}
          >
            ₿
          </div>
          
          <div 
            className={`absolute left-2 top-26 bg-[#627EEA] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-black transition-all duration-1000 ${
              step >= 2 ? 'animate-tunnel-travel opacity-0' : ''
            }`}
            style={{ top: '26px', transitionDelay: '0.5s' }}
          >
            Ξ
          </div>
          
          <div 
            className={`absolute left-2 top-46 bg-[#C2A633] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-black transition-all duration-1000 ${
              step >= 3 ? 'animate-tunnel-travel opacity-0' : ''
            }`}
            style={{ top: '46px', transitionDelay: '1s' }}
          >
            Ð
          </div>
          
          <div 
            className={`absolute left-2 top-66 bg-[#F3BA2F] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-black transition-all duration-1000 ${
              step >= 3 ? 'animate-tunnel-travel opacity-0' : ''
            }`}
            style={{ top: '66px', transitionDelay: '1.5s' }}
          >
            BNB
          </div>
          
          {/* Quantum+ super currency */}
          {showQuantum && (
            <div className="absolute right-4 top-20 animate-float-bob">
              <div className="bg-[#9C27B0] w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-black shadow-lg animate-pulse">
                Q+
              </div>
              <div className="absolute inset-0 bg-white opacity-0 animate-flash rounded-full"></div>
            </div>
          )}
          
          {/* Light rays around Quantum+ */}
          {showQuantum && (
            <>
              <div className="absolute right-12 top-28 w-32 h-1 bg-[#9C27B0] rotate-45 animate-blink" style={{ animationDelay: '0.1s' }}></div>
              <div className="absolute right-12 top-28 w-32 h-1 bg-[#9C27B0] -rotate-45 animate-blink" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute right-12 top-28 w-32 h-1 bg-[#9C27B0] rotate-90 animate-blink" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute right-12 top-28 w-32 h-1 bg-[#9C27B0] rotate-0 animate-blink" style={{ animationDelay: '0.4s' }}></div>
            </>
          )}
        </div>
        
        <p className="font-pixel text-white text-center mt-6">
          {showQuantum ? 
            "QUANTUM+ SUPER CURRENCY CREATED!" : 
            "MERGING CRYPTOCURRENCIES..."
          }
        </p>
      </PixelBorder>
    </div>
  );
};

export default CryptoFusion;