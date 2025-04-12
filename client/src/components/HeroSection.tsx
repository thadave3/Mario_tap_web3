import { Link } from 'wouter';
import PixelButton from './PixelButton';
import QuestionBlock from './QuestionBlock';

const HeroSection = () => {
  return (
    <section className="relative py-12 md:py-20 px-6 overflow-hidden">
      <div 
        className="absolute top-0 left-0 right-0 h-32 bg-center bg-repeat-x opacity-70"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100' width='200' height='100'%3E%3Cpath d='M30,70 Q50,40 70,70 Q90,40 110,70 Q130,40 150,70 Q170,40 190,70' fill='white' stroke='white' stroke-width='20' stroke-linecap='round'/%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 z-10">
          <h2 className="font-pixel text-2xl md:text-4xl text-white leading-relaxed mb-6 text-shadow-lg">
            <span className="text-[#E52521]">WEB3</span> MEETS <span className="text-[#43B047]">MARIO</span> 
            <span className="block text-[#FBD000] mt-4">THE ULTIMATE PLAYGROUND</span>
          </h2>
          <p className="font-retro text-xl text-white mb-8">Jump into the Mushroom Kingdom of blockchain with our unique gaming experience. Collect NFTs, bid on domains, and play to earn!</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/play">
              <PixelButton variant="red">
                START PLAYING
              </PixelButton>
            </Link>
            <Link href="/domains">
              <PixelButton variant="green">
                EXPLORE DOMAINS
              </PixelButton>
            </Link>
          </div>
        </div>
        
        <div className="md:w-1/2 mt-10 md:mt-0">
          <div className="relative game-window bg-[#5C94FC] p-4 h-80">
            {/* Mock game interface */}
            <div className="absolute bottom-0 left-0 right-0 h-16 brick"></div>
            
            <div className="absolute" style={{ bottom: "50px", left: "40px" }}>
              <svg 
                className="w-12 h-14"
                viewBox="0 0 52 60" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="10" y="0" width="32" height="6" fill="#FF0000" />
                <rect x="4" y="6" width="44" height="12" fill="#FF0000" />
                <rect x="4" y="18" width="12" height="6" fill="#825027" />
                <rect x="16" y="18" width="12" height="6" fill="#FFB266" />
                <rect x="28" y="18" width="12" height="6" fill="#825027" />
                <rect x="16" y="24" width="24" height="6" fill="#FFB266" />
                <rect x="10" y="30" width="36" height="6" fill="#0066FF" />
                <rect x="4" y="36" width="12" height="6" fill="#FF0000" />
                <rect x="22" y="36" width="12" height="6" fill="#FF0000" />
                <rect x="40" y="36" width="12" height="6" fill="#FF0000" />
                <rect x="4" y="42" width="12" height="6" fill="#0066FF" />
                <rect x="22" y="42" width="12" height="6" fill="#0066FF" />
                <rect x="40" y="42" width="12" height="6" fill="#0066FF" />
                <rect x="4" y="48" width="12" height="6" fill="#825027" />
                <rect x="22" y="48" width="12" height="6" fill="#825027" />
                <rect x="40" y="48" width="12" height="6" fill="#825027" />
                <rect x="4" y="54" width="12" height="6" fill="#825027" />
                <rect x="22" y="54" width="12" height="6" fill="#825027" />
                <rect x="40" y="54" width="12" height="6" fill="#825027" />
              </svg>
            </div>
            
            <div className="absolute" style={{ bottom: "16px", left: "120px", width: "40px", height: "60px" }}>
              <div className="pipe"></div>
            </div>
            
            <div className="absolute flex space-x-4" style={{ top: "60px", left: "80px" }}>
              <QuestionBlock />
              <QuestionBlock />
              <QuestionBlock />
            </div>
            
            <div className="absolute" style={{ top: "30px", right: "40px" }}>
              <div className="flex items-center bg-black bg-opacity-70 p-2 rounded">
                <svg 
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 32 32" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="16" cy="16" r="12" fill="#FFCF40" />
                  <text x="16" y="21" textAnchor="middle" fill="#000" fontFamily="Press Start 2P" fontSize="10">$</text>
                </svg>
                <span className="font-pixel text-xs text-[#FFCF40]">x24</span>
              </div>
            </div>
          </div>
          <p className="font-retro text-center text-white mt-2">▲ Click to Play Demo ▲</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
