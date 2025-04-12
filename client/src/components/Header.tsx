import { Link, useLocation } from 'wouter';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Coin from './Coin';
import PixelButton from './PixelButton';
import { useGame } from '@/context/GameContext';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const { coins, userId } = useGame();

  return (
    <header className="relative z-10 px-6 py-4 bg-[#E52521] border-b-8 border-black">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link href="/">
            <span className="font-pixel text-white text-lg md:text-2xl tracking-wide cursor-pointer">
              SUPER<span className="text-[#FBD000]">CHAIN</span>BROS
            </span>
          </Link>
          <svg 
            className="w-8 h-8 ml-4 animate-float-bob" 
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="35" fill="#E52521" />
            <circle cx="50" cy="40" r="30" fill="#FFFFFF" />
            <circle cx="50" cy="60" r="7" fill="#000000" />
          </svg>
        </div>
        
        <nav className={`${menuOpen ? 'fixed inset-0 bg-[#E52521] z-40 flex flex-col items-center justify-center' : 'hidden'} md:relative md:flex md:space-x-6`}>
          <Link href="/play">
            <span className={`font-pixel text-white text-xs hover:text-[#FBD000] transition-colors cursor-pointer ${location === '/play' ? 'text-[#FBD000]' : ''}`}>
              PLAY
            </span>
          </Link>
          <Link href="/domains">
            <span className={`font-pixel text-white text-xs hover:text-[#FBD000] transition-colors cursor-pointer ${location === '/domains' ? 'text-[#FBD000]' : ''}`}>
              DOMAINS
            </span>
          </Link>
          <Link href="/profile">
            <span className={`font-pixel text-white text-xs hover:text-[#FBD000] transition-colors cursor-pointer ${location === '/profile' ? 'text-[#FBD000]' : ''}`}>
              PROFILE
            </span>
          </Link>
          <Link href="/rewards">
            <span className={`font-pixel text-white text-xs hover:text-[#FBD000] transition-colors cursor-pointer ${location === '/rewards' ? 'text-[#FBD000]' : ''}`}>
              REWARDS
            </span>
          </Link>
        </nav>
        
        <div className="flex items-center">
          <div className="flex items-center mr-4 bg-black bg-opacity-30 p-2 rounded-lg">
            <Coin className="mr-2" />
            <span className="font-pixel text-xs text-[#FFCF40]">{coins}</span>
          </div>
          
          <PixelButton variant="yellow" size="sm" className="hidden md:block">
            {userId ? 'MY WALLET' : 'CONNECT WALLET'}
          </PixelButton>
          
          <button 
            className="md:hidden ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
