import { Link } from 'wouter';
import { MessageCircleCode, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#E52521] border-t-8 border-black py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="font-pixel text-white text-xl">SUPER<span className="text-[#FBD000]">CHAIN</span>BROS</h2>
            <p className="font-retro text-white mt-2">The ultimate Web3 gaming experience!</p>

            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white hover:text-[#FBD000]">
                <span className="font-retro text-lg flex items-center">
                  <MessageCircleCode className="mr-1" size={16} /> MessageCircleCode
                </span>
              </a>
              <a href="#" className="text-white hover:text-[#FBD000]">
                <span className="font-retro text-lg flex items-center">
                  <Twitter className="mr-1" size={16} /> Twitter
                </span>
              </a>
              <a href="#" className="text-white hover:text-[#FBD000]">
                <span className="font-retro text-lg">OpenSea</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <h3 className="font-pixel text-[#FBD000] text-sm mb-3">PLAY</h3>
              <ul className="font-retro text-white space-y-2">
                <li><Link href="/play"><span className="hover:text-[#FBD000] cursor-pointer">Games</span></Link></li>
                <li><span className="hover:text-[#FBD000] cursor-pointer">Leaderboard</span></li>
                <li><span className="hover:text-[#FBD000] cursor-pointer">Tournaments</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-pixel text-[#FBD000] text-sm mb-3">DOMAINS</h3>
              <ul className="font-retro text-white space-y-2">
                <li><Link href="/domains"><span className="hover:text-[#FBD000] cursor-pointer">Marketplace</span></Link></li>
                <li><span className="hover:text-[#FBD000] cursor-pointer">My Domains</span></li>
                <li><span className="hover:text-[#FBD000] cursor-pointer">Subdomains</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-pixel text-[#FBD000] text-sm mb-3">REWARDS</h3>
              <ul className="font-retro text-white space-y-2">
                <li><Link href="/rewards"><span className="hover:text-[#FBD000] cursor-pointer">Entertainment</span></Link></li>
                <li><span className="hover:text-[#FBD000] cursor-pointer">Social Media</span></li>
                <li><span className="hover:text-[#FBD000] cursor-pointer">NFT Collection</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white border-opacity-20 mt-8 pt-8 text-center">
          <p className="font-retro text-white">&copy; 2023 SUPERCHAINBROS | All Rights Reserved</p>
          <p className="font-retro text-white text-sm mt-2">Not affiliated with Nintendo or Mario Bros.</p>
          <p className="font-retro text-white text-xs mt-2">Created by David Sanders</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;