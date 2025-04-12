import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DomainBidding from '@/components/DomainBidding';
import PixelBorder from '@/components/PixelBorder';
import PixelButton from '@/components/PixelButton';
import { type Domain } from '@shared/schema';

const DomainsPage = () => {
  const [filter, setFilter] = useState('all');

  // Fetch domains
  const { data: domains, isLoading } = useQuery<Domain[]>({
    queryKey: ['/api/domains'],
    refetchInterval: 10000, // Refetch every 10 seconds to update time
  });

  // Filter domains
  const filteredDomains = domains
    ? filter === 'all'
      ? domains
      : filter === 'price-low'
      ? [...domains].sort((a, b) => a.price - b.price)
      : filter === 'price-high'
      ? [...domains].sort((a, b) => b.price - a.price)
      : filter === 'time-low'
      ? [...domains].sort((a, b) => a.timeLeft - b.timeLeft)
      : domains
    : [];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <section className="py-12 px-6 bg-[#8D4B2A]">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-pixel text-center text-3xl text-white mb-8">DOMAIN KINGDOM</h1>
            
            <PixelBorder background="white" className="p-6 mb-8">
              <h2 className="font-pixel text-[#E52521] text-xl mb-4">DOMAIN MARKETPLACE</h2>
              
              <div className="font-retro text-lg mb-6">
                <p>Welcome to the Domain Kingdom! Here you can bid on valuable blockchain domains and unlock unlimited subdomains. Each domain comes with its own unique benefits and features.</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Bid on premium blockchain domains</li>
                  <li>Create unlimited subdomains</li>
                  <li>Build your Web3 empire</li>
                  <li>Resell domains for profit</li>
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <PixelButton
                  variant={filter === 'all' ? 'red' : 'blue'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  ALL DOMAINS
                </PixelButton>
                <PixelButton
                  variant={filter === 'price-low' ? 'red' : 'blue'}
                  size="sm"
                  onClick={() => setFilter('price-low')}
                >
                  PRICE: LOW TO HIGH
                </PixelButton>
                <PixelButton
                  variant={filter === 'price-high' ? 'red' : 'blue'}
                  size="sm"
                  onClick={() => setFilter('price-high')}
                >
                  PRICE: HIGH TO LOW
                </PixelButton>
                <PixelButton
                  variant={filter === 'time-low' ? 'red' : 'blue'}
                  size="sm"
                  onClick={() => setFilter('time-low')}
                >
                  ENDING SOON
                </PixelButton>
              </div>
            </PixelBorder>
            
            <DomainBidding />
            
            <PixelBorder background="black" className="p-6 mt-8 text-white">
              <h2 className="font-pixel text-[#FBD000] text-xl mb-4">SUBDOMAIN MANAGEMENT</h2>
              
              <div className="text-center py-8">
                <svg 
                  className="w-24 h-24 mx-auto mb-4"
                  viewBox="0 0 100 100" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="100" height="100" fill="#333" />
                  <rect x="20" y="20" width="60" height="60" fill="#5C94FC" />
                  <rect x="30" y="30" width="40" height="10" fill="#FFF" />
                  <rect x="30" y="45" width="40" height="5" fill="#FFF" />
                  <rect x="30" y="55" width="40" height="5" fill="#FFF" />
                  <rect x="30" y="65" width="40" height="5" fill="#FFF" />
                </svg>
                
                <p className="font-retro text-lg mb-4">Connect your wallet to manage your subdomains</p>
                
                <PixelButton variant="yellow" className="mx-auto">
                  CONNECT WALLET
                </PixelButton>
              </div>
            </PixelBorder>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DomainsPage;
