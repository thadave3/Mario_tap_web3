import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useGame } from '@/context/GameContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Rewards from '@/components/Rewards';
import PixelBorder from '@/components/PixelBorder';
import PixelButton from '@/components/PixelButton';
import Coin from '@/components/Coin';
import QuestionBlock from '@/components/QuestionBlock';
import { type Reward } from '@shared/schema';

const RewardsPage = () => {
  const { coins, userId } = useGame();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('entertainment');
  
  // Fetch rewards
  const { data: rewards, isLoading } = useQuery<Reward[]>({
    queryKey: ['/api/rewards'],
  });
  
  // Group rewards by category
  const groupedRewards = rewards ? {
    entertainment: rewards.filter(r => r.category === 'entertainment'),
    social: rewards.filter(r => r.category === 'social'),
    nft: rewards.filter(r => r.category === 'nft')
  } : null;
  
  // Handle redeem
  const handleRedeem = (rewardId: number, cost: number) => {
    if (!userId) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to redeem rewards.",
        variant: "destructive"
      });
      return;
    }
    
    if (coins < cost) {
      toast({
        title: "Not enough coins",
        description: `You need ${cost} coins to redeem this reward.`,
        variant: "destructive"
      });
      return;
    }
    
    apiRequest('POST', `/api/rewards/${rewardId}/redeem`, { userId })
      .then(() => {
        toast({
          title: "Reward redeemed!",
          description: "Your reward has been redeemed successfully.",
        });
      })
      .catch(error => {
        toast({
          title: "Error redeeming reward",
          description: error.message,
          variant: "destructive"
        });
      });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <section className="py-12 px-6 bg-black">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-pixel text-center text-3xl text-[#FFCF40] mb-12">ENTERTAINMENT REWARDS</h1>
            
            <PixelBorder background="black" className="bg-opacity-70 p-6 mb-12">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h2 className="font-pixel text-[#FFCF40] text-xl mb-2">COIN BALANCE</h2>
                  <div className="flex items-center">
                    <Coin size="lg" className="mr-2" />
                    <span className="font-pixel text-white text-xl">{coins}</span>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <h2 className="font-pixel text-[#FFCF40] text-xl mb-2">HOW IT WORKS</h2>
                  <p className="font-retro text-white">
                    Play games to earn coins, then redeem them for exciting rewards!
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <PixelButton variant="red">
                    PLAY GAMES
                  </PixelButton>
                </div>
              </div>
            </PixelBorder>
            
            <div className="flex justify-center mb-8">
              <PixelBorder background="black" className="inline-flex bg-opacity-70 p-1">
                <PixelButton 
                  variant={activeTab === 'entertainment' ? 'red' : 'blue'} 
                  size="sm"
                  onClick={() => setActiveTab('entertainment')}
                >
                  ENTERTAINMENT
                </PixelButton>
                <PixelButton 
                  variant={activeTab === 'social' ? 'green' : 'blue'} 
                  size="sm"
                  onClick={() => setActiveTab('social')}
                >
                  SOCIAL MEDIA
                </PixelButton>
                <PixelButton 
                  variant={activeTab === 'nft' ? 'yellow' : 'blue'} 
                  size="sm"
                  onClick={() => setActiveTab('nft')}
                >
                  NFT COLLECTIBLES
                </PixelButton>
              </PixelBorder>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <p className="font-pixel text-white text-xl animate-pulse">Loading rewards...</p>
              </div>
            ) : !groupedRewards ? (
              <div className="text-center py-12">
                <p className="font-pixel text-white text-xl">No rewards available!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Entertainment Rewards Tab */}
                {activeTab === 'entertainment' && (
                  groupedRewards.entertainment.map(reward => (
                    <PixelBorder 
                      key={reward.id} 
                      background="red" 
                      className="p-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-pixel text-white">{reward.name}</h3>
                        <div className="flex items-center">
                          <Coin className="mr-2" />
                          <span className="font-pixel text-xs text-white">{reward.cost}</span>
                        </div>
                      </div>
                      
                      <div className="bg-black bg-opacity-30 p-3 mb-4 rounded">
                        <p className="font-retro text-white">{reward.description}</p>
                      </div>
                      
                      <div className="text-center">
                        <QuestionBlock className="w-16 h-16 mx-auto mb-4">
                          <svg 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="w-8 h-8"
                          >
                            <rect width="24" height="24" rx="4" fill="#E52521" />
                            <path d="M6 12L10 16L18 8" stroke="white" strokeWidth="2" />
                          </svg>
                        </QuestionBlock>
                        
                        <PixelButton 
                          variant="yellow" 
                          className="w-full"
                          onClick={() => handleRedeem(reward.id, reward.cost)}
                          disabled={!userId || coins < reward.cost}
                        >
                          {coins < reward.cost ? "NOT ENOUGH COINS" : "REDEEM REWARD"}
                        </PixelButton>
                      </div>
                    </PixelBorder>
                  ))
                )}
                
                {/* Social Media Rewards Tab */}
                {activeTab === 'social' && (
                  groupedRewards.social.map(reward => (
                    <PixelBorder 
                      key={reward.id} 
                      background="green" 
                      className="p-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-pixel text-white">{reward.name}</h3>
                        <div className="flex items-center">
                          <Coin className="mr-2" />
                          <span className="font-pixel text-xs text-white">{reward.cost}</span>
                        </div>
                      </div>
                      
                      <div className="bg-black bg-opacity-30 p-3 mb-4 rounded">
                        <p className="font-retro text-white">{reward.description}</p>
                      </div>
                      
                      <div className="text-center">
                        <QuestionBlock className="w-16 h-16 mx-auto mb-4">
                          <svg 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="w-8 h-8"
                          >
                            <rect width="24" height="24" rx="4" fill="#43B047" />
                            <circle cx="12" cy="12" r="6" fill="white" />
                            <circle cx="12" cy="12" r="3" fill="#43B047" />
                          </svg>
                        </QuestionBlock>
                        
                        <PixelButton 
                          variant="yellow" 
                          className="w-full"
                          onClick={() => handleRedeem(reward.id, reward.cost)}
                          disabled={!userId || coins < reward.cost}
                        >
                          {coins < reward.cost ? "NOT ENOUGH COINS" : "REDEEM REWARD"}
                        </PixelButton>
                      </div>
                    </PixelBorder>
                  ))
                )}
                
                {/* NFT Collectibles Tab */}
                {activeTab === 'nft' && (
                  groupedRewards.nft.map(reward => (
                    <PixelBorder 
                      key={reward.id} 
                      background="blue" 
                      className="p-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-pixel text-white">{reward.name}</h3>
                        <div className="flex items-center">
                          <Coin className="mr-2" />
                          <span className="font-pixel text-xs text-white">{reward.cost}</span>
                        </div>
                      </div>
                      
                      <div className="bg-black bg-opacity-30 p-3 mb-4 rounded">
                        <p className="font-retro text-white">{reward.description}</p>
                      </div>
                      
                      <div className="text-center">
                        <QuestionBlock className="w-16 h-16 mx-auto mb-4">
                          <svg 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="w-8 h-8"
                          >
                            <rect width="24" height="24" rx="4" fill="#5B6EE1" />
                            <path d="M12 4L16 8L12 12L8 8L12 4Z" fill="white" />
                            <path d="M12 12L16 16L12 20L8 16L12 12Z" fill="white" />
                          </svg>
                        </QuestionBlock>
                        
                        <PixelButton 
                          variant="yellow" 
                          className="w-full"
                          onClick={() => handleRedeem(reward.id, reward.cost)}
                          disabled={!userId || coins < reward.cost}
                        >
                          {coins < reward.cost ? "NOT ENOUGH COINS" : "REDEEM REWARD"}
                        </PixelButton>
                      </div>
                    </PixelBorder>
                  ))
                )}
              </div>
            )}
            
            <div className="mt-12">
              <h2 className="font-pixel text-center text-2xl text-[#FFCF40] mb-8">REDEEMED REWARDS</h2>
              
              {userId ? (
                <PixelBorder background="black" className="bg-opacity-70 p-6 text-center">
                  <svg 
                    className="w-24 h-24 mx-auto mb-4"
                    viewBox="0 0 100 100" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="100" height="100" rx="50" fill="#333" />
                    <path d="M30 50L45 65L70 35" stroke="#FFCF40" strokeWidth="8" />
                  </svg>
                  
                  <p className="font-retro text-white text-lg mb-6">
                    You haven't redeemed any rewards yet. Play games to earn coins and unlock exciting rewards!
                  </p>
                  
                  <PixelButton variant="red" size="lg">
                    PLAY GAMES NOW
                  </PixelButton>
                </PixelBorder>
              ) : (
                <PixelBorder background="black" className="bg-opacity-70 p-6 text-center">
                  <p className="font-retro text-white text-lg mb-6">
                    Connect your wallet to see your redeemed rewards
                  </p>
                  
                  <PixelButton variant="yellow">
                    CONNECT WALLET
                  </PixelButton>
                </PixelBorder>
              )}
            </div>
          </div>
        </section>
        
        <Rewards />
      </main>
      
      <Footer />
    </div>
  );
};

export default RewardsPage;
