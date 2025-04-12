import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Features from '@/components/Features';
import BlockchainGame from '@/components/BlockchainGame';
import DomainBidding from '@/components/DomainBidding';
import ProfileSetup from '@/components/ProfileSetup';
import Rewards from '@/components/Rewards';
import Footer from '@/components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <Features />
      <BlockchainGame />
      <DomainBidding />
      <ProfileSetup />
      <Rewards />
      <Footer />
    </div>
  );
};

export default Home;