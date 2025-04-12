import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useGame } from '@/context/GameContext';
import { useToast } from '@/hooks/use-toast';
import PixelButton from './PixelButton';
import PixelBorder from './PixelBorder';
import Coin from './Coin';
import { type Reward } from '@shared/schema';

const Rewards = () => {
  const { coins, userId, setCoins } = useGame();
  const { toast } = useToast();
  
  // Fetch rewards
  const { data: rewards, isLoading, refetch } = useQuery<Reward[]>({
    queryKey: ['/api/rewards'],
    throwOnError: false,
    retry: 1
  });
  
  // Redeem reward mutation
  const redeemRewardMutation = useMutation({
    mutationFn: async (rewardId: number) => {
      if (!userId) throw new Error("Please connect your wallet first");
      
      const response = await apiRequest('POST', `/api/rewards/${rewardId}/redeem`, {
        userId
      });
      return response.json();
    },
    onSuccess: (data) => {
      refetch();
      toast({
        title: "Reward redeemed!",
        description: "Your reward has been redeemed successfully.",
      });
      // Update local coins state to reflect new balance
      if (userId) {
        fetch(`/api/users/${userId}`).then(res => res.json()).then(user => {
          setCoins(user.coins);
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error redeeming reward",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Group rewards by category
  const groupedRewards = rewards ? {
    entertainment: rewards.filter(r => r.category === 'entertainment'),
    social: rewards.filter(r => r.category === 'social'),
    nft: rewards.filter(r => r.category === 'nft')
  } : null;
  
  // Handle redeem
  const handleRedeem = (rewardId: number) => {
    redeemRewardMutation.mutate(rewardId);
  };

  // Render reward card
  const renderRewardCard = (rewards: Reward[], title: string, color: string, image: React.ReactNode) => {
    return (
      <PixelBorder background={color === 'red' ? 'red' : color === 'green' ? 'green' : 'blue'} className="p-4">
        <h3 className="font-pixel text-white text-lg mb-4">{title}</h3>
        {image}
        
        <p className="font-retro text-white text-lg mb-4">
          {color === 'red' ? 'Use your coins to get exclusive access to premium content and theater discounts!' : 
           color === 'green' ? 'Enhance your social presence with exclusive features on Facebook and TikTok!' :
           'Collect unique game character NFTs with special powers and abilities!'}
        </p>
        
        <div className="bg-black bg-opacity-30 p-3 mb-4 rounded">
          {rewards.map((reward) => (
            <div key={reward.id} className="flex justify-between items-center mb-2">
              <span className="font-retro text-white">{reward.name}</span>
              <div className="flex items-center">
                <Coin className="mr-2" />
                <span className="font-pixel text-xs text-white">{reward.cost}</span>
              </div>
            </div>
          ))}
        </div>
        
        <PixelButton 
          variant="yellow" 
          className="w-full"
          onClick={() => rewards.length > 0 && handleRedeem(rewards[0].id)}
          disabled={redeemRewardMutation.isPending || !userId}
        >
          {redeemRewardMutation.isPending ? "REDEEMING..." : "REDEEM REWARDS"}
        </PixelButton>
      </PixelBorder>
    );
  };

  // Custom SVG images for reward cards
  const movieTheaterImage = (
    <svg 
      className="w-full h-40 object-cover mb-4"
      viewBox="0 0 500 300" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="500" height="300" fill="#111111" />
      <rect x="50" y="50" width="400" height="200" fill="#333333" />
      <rect x="75" y="75" width="350" height="150" fill="#FFFFFF" />
      <rect x="200" y="250" width="100" height="50" fill="#FF0000" />
      <rect x="225" y="275" width="50" height="25" fill="#FFFFFF" />
    </svg>
  );
  
  const socialMediaImage = (
    <svg 
      className="w-full h-40 object-cover mb-4"
      viewBox="0 0 500 300" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="500" height="300" fill="#3B5998" />
      <circle cx="150" cy="150" r="75" fill="#FFFFFF" />
      <circle cx="350" cy="150" r="75" fill="#FF0000" />
      <path d="M150,100 L150,200 L250,150 Z" fill="#FFFFFF" />
      <rect x="300" y="120" width="100" height="60" fill="#FFFFFF" />
    </svg>
  );
  
  const nftCollectibleImage = (
    <svg 
      className="w-full h-40 object-cover mb-4"
      viewBox="0 0 500 300" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="500" height="300" fill="#673AB7" />
      <rect x="75" y="75" width="150" height="150" fill="#FFC107" />
      <rect x="275" y="75" width="150" height="150" fill="#FF5722" />
      <text x="150" y="150" textAnchor="middle" fontSize="24" fontFamily="Press Start 2P" fill="#000000">NFT</text>
      <text x="350" y="150" textAnchor="middle" fontSize="24" fontFamily="Press Start 2P" fill="#000000">NFT</text>
    </svg>
  );

  return (
    <section className="py-16 px-6 bg-black relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-pixel text-center text-2xl md:text-3xl text-[#FFCF40] mb-12">ENTERTAINMENT REWARDS</h2>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="font-pixel text-white text-xl animate-pulse">Loading rewards...</p>
          </div>
        ) : !groupedRewards ? (
          <div className="text-center py-12">
            <p className="font-pixel text-white text-xl">No rewards available!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderRewardCard(groupedRewards.entertainment, 'MOVIE THEATER', 'red', movieTheaterImage)}
            {renderRewardCard(groupedRewards.social, 'SOCIAL BOOSTS', 'green', socialMediaImage)}
            {renderRewardCard(groupedRewards.nft, 'NFT COLLECTIBLES', 'blue', nftCollectibleImage)}
          </div>
        )}
      </div>
    </section>
  );
};

export default Rewards;
