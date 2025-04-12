import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useGame } from '@/context/GameContext';
import Coin from './Coin';
import PixelButton from './PixelButton';
import PixelBorder from './PixelBorder';
import Web3Expert from './Web3Expert';
import { type Domain } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

const DomainBidding = () => {
  const { coins, userId, setCoins } = useGame();
  const { toast } = useToast();
  
  // Fetch domains
  const { data: domains, isLoading, refetch } = useQuery<Domain[]>({
    queryKey: ['/api/domains'],
    refetchInterval: 10000, // Refetch every 10 seconds to update time
    retry: 1,
    throwOnError: false
  });
  
  // Place bid mutation
  const placeBidMutation = useMutation({
    mutationFn: async ({ domainId, bidAmount }: { domainId: number, bidAmount: number }) => {
      if (!userId) throw new Error("Please connect your wallet first");
      if (coins < bidAmount) throw new Error("Not enough coins");
      
      const response = await apiRequest('POST', '/api/bids', {
        domainId,
        userId,
        bidAmount
      });
      return response.json();
    },
    onSuccess: (data) => {
      refetch();
      toast({
        title: "Bid placed successfully!",
        description: `You bid ${data.bidAmount} coins.`,
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
        title: "Error placing bid",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Function to format time left
  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle bid
  const handleBid = (domain: Domain) => {
    const bidAmount = domain.currentBid ? domain.currentBid + 10 : domain.price / 2;
    placeBidMutation.mutate({ domainId: domain.id, bidAmount });
  };

  return (
    <section className="py-16 px-6 bg-[#8D4B2A]">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-pixel text-center text-2xl md:text-3xl text-white mb-8">DOMAIN KINGDOM</h2>
        <p className="font-retro text-xl text-center text-white mb-12">Bid on domains that were pushed to the side and unlock unlimited subdomains!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3 text-center py-12">
              <p className="font-pixel text-white text-xl animate-pulse">Loading domains...</p>
            </div>
          ) : domains && domains.length > 0 ? (
            domains.map((domain) => (
              <div 
                key={domain.id}
                className="bg-[#5C94FC] pixel-border p-4 transition-transform hover:translate-y-[-5px]"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-pixel text-black">{domain.name}</h3>
                  <div className="flex items-center">
                    <Coin className="mr-2" />
                    <span className="font-pixel text-xs">{domain.price}</span>
                  </div>
                </div>
                
                <div className="bg-black bg-opacity-10 p-3 mb-4 rounded">
                  <p className="font-retro text-lg">{domain.description}</p>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-retro text-black">Current Bid:</span>
                    <span className="font-pixel text-[#E52521]">
                      {domain.currentBid ? `${domain.currentBid} COINS` : "NO BIDS YET"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-retro text-black">Time Left:</span>
                    <span className="font-pixel text-[#43B047]">{formatTimeLeft(domain.timeLeft)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-retro text-black">Bidders:</span>
                    <span className="font-pixel text-black">{domain.bidCount}</span>
                  </div>
                  
                  <PixelButton 
                    variant="red"
                    className="w-full"
                    onClick={() => handleBid(domain)}
                    disabled={placeBidMutation.isPending}
                  >
                    {placeBidMutation.isPending ? "PLACING BID..." : "PLACE BID"}
                  </PixelButton>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="font-pixel text-white text-xl">No domains available right now!</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <PixelButton variant="yellow" size="lg">
            VIEW ALL DOMAINS
          </PixelButton>
        </div>
        
        <div className="mt-16">
          <Web3Expert />
        </div>
      </div>
    </section>
  );
};

export default DomainBidding;
