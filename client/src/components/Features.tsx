import QuestionBlock from './QuestionBlock';

const features = [
  {
    title: "BLOCKCHAIN TAP GAME",
    description: "Tap to mine coins and collect unique power-ups that boost your blockchain experience!",
    color: "text-[#E52521]"
  },
  {
    title: "BID ON DOMAINS",
    description: "Jump into auctions and claim valuable domain names with unlimited subdomains!",
    color: "text-[#43B047]"
  },
  {
    title: "AI PLAYGROUND",
    description: "Create custom game levels and characters with our AI-powered design tools!",
    color: "text-[#FBD000]"
  }
];

const Features = () => {
  return (
    <section className="bg-black py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-pixel text-center text-2xl md:text-3xl text-[#FBD000] mb-12">POWER-UP YOUR EXPERIENCE</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="pixel-border p-6 bg-[#5C94FC] transition-transform hover:translate-y-[-5px]"
            >
              <div className="w-16 h-16 mx-auto mb-4">
                <QuestionBlock size="lg" />
              </div>
              <h3 className={`font-pixel ${feature.color} text-center text-lg mb-3`}>{feature.title}</h3>
              <p className="font-retro text-black text-center text-xl">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
