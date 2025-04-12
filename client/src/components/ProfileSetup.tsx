import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { apiRequest } from '@/lib/queryClient';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGame } from '@/context/GameContext';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import PixelButton from './PixelButton';
import PixelBorder from './PixelBorder';
import { Facebook, MessageCircle, Twitch } from 'lucide-react';

// Character selection options
const characters = [
  { id: 'mario', name: 'Mario', stats: { speed: 7, jump: 8, mining: 6 } },
  { id: 'luigi', name: 'Luigi', stats: { speed: 8, jump: 9, mining: 4 } },
  { id: 'princess', name: 'Princess', stats: { speed: 6, jump: 5, mining: 7 } },
  { id: 'toad', name: 'Toad', stats: { speed: 9, jump: 6, mining: 5 } },
  { id: 'yoshi', name: 'Yoshi', stats: { speed: 7, jump: 7, mining: 7 } }
];

// Form schema
const profileSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  wallet: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  discord: z.string().optional()
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileSetup = () => {
  const { userId, character, setCharacter } = useGame();
  const { toast } = useToast();
  const [selectedCharacter, setSelectedCharacter] = useState(character || 'mario');
  const [stats, setStats] = useState(characters.find(c => c.id === selectedCharacter)?.stats || characters[0].stats);
  
  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "CryptoJumper",
      wallet: userId ? `0x71C...4E3a` : "",
      facebook: "",
      tiktok: "",
      discord: ""
    }
  });
  
  // Update character stats when selection changes
  useEffect(() => {
    const charStats = characters.find(c => c.id === selectedCharacter)?.stats;
    if (charStats) setStats(charStats);
  }, [selectedCharacter]);
  
  // Handle character selection
  const handleCharacterSelect = (id: string) => {
    setSelectedCharacter(id);
    
    // Update character in game context and backend if logged in
    setCharacter(id);
    if (userId) {
      apiRequest('PATCH', `/api/users/${userId}/character`, { character: id })
        .then(() => {
          toast({
            title: "Character updated",
            description: `You're now playing as ${id}!`,
          });
        })
        .catch(error => {
          toast({
            title: "Error updating character",
            description: "Could not update your character. Please try again.",
            variant: "destructive"
          });
        });
    }
  };
  
  // Handle form submission
  const onSubmit = (data: ProfileFormValues) => {
    toast({
      title: "Profile saved",
      description: "Your profile has been updated successfully!",
    });
  };

  // Render character selection item
  const renderCharacter = (id: string, name: string) => {
    const isSelected = selectedCharacter === id;
    
    return (
      <div 
        className={`bg-${isSelected ? '[#E52521]' : 'black bg-opacity-10'} p-3 rounded-lg text-center cursor-pointer transition-transform hover:scale-105`}
        onClick={() => handleCharacterSelect(id)}
      >
        <svg 
          className="w-20 h-20 mx-auto mb-2"
          viewBox="0 0 80 80" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {id === 'mario' && (
            <g>
              <rect width="80" height="80" fill="#E52521" />
              <rect x="20" y="16" width="40" height="24" fill="#FFB266" />
              <rect x="20" y="40" width="40" height="8" fill="#000000" />
              <rect x="28" y="24" width="8" height="8" fill="#000000" />
              <rect x="44" y="24" width="8" height="8" fill="#000000" />
            </g>
          )}
          {id === 'luigi' && (
            <g>
              <rect width="80" height="80" fill="#43B047" />
              <rect x="20" y="16" width="40" height="24" fill="#FFB266" />
              <rect x="20" y="40" width="40" height="8" fill="#000000" />
              <rect x="28" y="24" width="8" height="8" fill="#000000" />
              <rect x="44" y="24" width="8" height="8" fill="#000000" />
            </g>
          )}
          {id === 'princess' && (
            <g>
              <rect width="80" height="80" fill="#FFC0CB" />
              <rect x="20" y="16" width="40" height="24" fill="#FFB266" />
              <rect x="20" y="40" width="40" height="8" fill="#000000" />
              <rect x="28" y="24" width="8" height="8" fill="#000000" />
              <rect x="44" y="24" width="8" height="8" fill="#000000" />
              <rect x="24" y="4" width="32" height="12" fill="#FFD700" />
            </g>
          )}
          {id === 'toad' && (
            <g>
              <rect width="80" height="80" fill="#FFFFFF" />
              <rect x="20" y="16" width="40" height="24" fill="#FFB266" />
              <rect x="20" y="40" width="40" height="8" fill="#000000" />
              <rect x="28" y="24" width="8" height="8" fill="#000000" />
              <rect x="44" y="24" width="8" height="8" fill="#000000" />
              <circle cx="40" cy="10" r="12" fill="#FF0000" />
              <circle cx="40" cy="10" r="8" fill="#FFFFFF" />
            </g>
          )}
          {id === 'yoshi' && (
            <g>
              <rect width="80" height="80" fill="#43B047" />
              <rect x="20" y="16" width="40" height="24" fill="#FFFFFF" />
              <rect x="20" y="40" width="40" height="8" fill="#FFC0CB" />
              <rect x="28" y="24" width="8" height="8" fill="#000000" />
              <rect x="44" y="24" width="8" height="8" fill="#000000" />
              <rect x="50" y="16" width="20" height="8" fill="#43B047" />
            </g>
          )}
        </svg>
        <p className="font-retro text-sm">{name}</p>
      </div>
    );
  };

  return (
    <section className="py-16 px-6 bg-[#5C94FC] relative">
      <div 
        className="clouds absolute" 
        style={{ 
          top: "20%",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100' width='200' height='100'%3E%3Cpath d='M30,70 Q50,40 70,70 Q90,40 110,70 Q130,40 150,70 Q170,40 190,70' fill='white' stroke='white' stroke-width='20' stroke-linecap='round'/%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="max-w-7xl mx-auto">
        <h2 className="font-pixel text-center text-2xl md:text-3xl text-black mb-12">CHOOSE YOUR CHARACTER</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PixelBorder background="white" className="p-6">
            <h3 className="font-pixel text-[#E52521] text-xl mb-6">PLAYER PROFILE</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="bg-black bg-opacity-10 p-4 rounded-lg text-center">
                      <svg 
                        className="w-40 h-40 mx-auto mb-4"
                        viewBox="0 0 160 160" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {selectedCharacter === 'mario' && (
                          <g>
                            <rect width="160" height="160" fill="#E52521" />
                            <rect x="40" y="32" width="80" height="48" fill="#FFB266" />
                            <rect x="40" y="80" width="80" height="16" fill="#000000" />
                            <rect x="56" y="48" width="16" height="16" fill="#000000" />
                            <rect x="88" y="48" width="16" height="16" fill="#000000" />
                          </g>
                        )}
                        {selectedCharacter === 'luigi' && (
                          <g>
                            <rect width="160" height="160" fill="#43B047" />
                            <rect x="40" y="32" width="80" height="48" fill="#FFB266" />
                            <rect x="40" y="80" width="80" height="16" fill="#000000" />
                            <rect x="56" y="48" width="16" height="16" fill="#000000" />
                            <rect x="88" y="48" width="16" height="16" fill="#000000" />
                          </g>
                        )}
                        {selectedCharacter === 'princess' && (
                          <g>
                            <rect width="160" height="160" fill="#FFC0CB" />
                            <rect x="40" y="32" width="80" height="48" fill="#FFB266" />
                            <rect x="40" y="80" width="80" height="16" fill="#000000" />
                            <rect x="56" y="48" width="16" height="16" fill="#000000" />
                            <rect x="88" y="48" width="16" height="16" fill="#000000" />
                            <rect x="48" y="8" width="64" height="24" fill="#FFD700" />
                          </g>
                        )}
                        {selectedCharacter === 'toad' && (
                          <g>
                            <rect width="160" height="160" fill="#FFFFFF" />
                            <rect x="40" y="32" width="80" height="48" fill="#FFB266" />
                            <rect x="40" y="80" width="80" height="16" fill="#000000" />
                            <rect x="56" y="48" width="16" height="16" fill="#000000" />
                            <rect x="88" y="48" width="16" height="16" fill="#000000" />
                            <circle cx="80" cy="20" r="24" fill="#FF0000" />
                            <circle cx="80" cy="20" r="16" fill="#FFFFFF" />
                          </g>
                        )}
                        {selectedCharacter === 'yoshi' && (
                          <g>
                            <rect width="160" height="160" fill="#43B047" />
                            <rect x="40" y="32" width="80" height="48" fill="#FFFFFF" />
                            <rect x="40" y="80" width="80" height="16" fill="#FFC0CB" />
                            <rect x="56" y="48" width="16" height="16" fill="#000000" />
                            <rect x="88" y="48" width="16" height="16" fill="#000000" />
                            <rect x="100" y="32" width="40" height="16" fill="#43B047" />
                          </g>
                        )}
                      </svg>
                      <p className="font-pixel text-sm text-black">LEVEL 5</p>
                      <div className="w-full bg-gray-200 h-4 mt-2">
                        <div className="bg-[#E52521] h-4" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="font-retro text-lg block mb-1">Username</FormLabel>
                          <FormControl>
                            <Input {...field} className="w-full font-pixel text-sm p-2 border-4 border-black" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="wallet"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="font-retro text-lg block mb-1">Wallet Address</FormLabel>
                          <FormControl>
                            <Input {...field} className="w-full font-pixel text-sm p-2 border-4 border-black" disabled />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="mb-4">
                      <label className="font-retro text-lg block mb-1">Social Links</label>
                      <div className="flex gap-2">
                        <button className="bg-blue-600 text-white p-2 rounded-lg">
                          <Facebook size={16} />
                        </button>
                        <button className="bg-pink-500 text-white p-2 rounded-lg">
                          <Twitch size={16} />
                        </button>
                        <button className="bg-purple-600 text-white p-2 rounded-lg">
                          <MessageCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <PixelButton 
                  variant="green" 
                  className="w-full"
                  type="submit"
                >
                  SAVE PROFILE
                </PixelButton>
              </form>
            </Form>
          </PixelBorder>
          
          <PixelBorder background="white" className="p-6">
            <h3 className="font-pixel text-[#FBD000] text-xl mb-6">CHARACTER SELECTION</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {characters.map((char) => (
                <div key={char.id}>
                  {renderCharacter(char.id, char.name)}
                </div>
              ))}
              
              <div className="bg-[#FBD000] p-3 rounded-lg text-center cursor-pointer transition-transform hover:scale-105 flex items-center justify-center">
                <span className="font-pixel text-2xl">+</span>
              </div>
            </div>
            
            <h4 className="font-pixel text-black text-lg mb-4">CHARACTER STATS</h4>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="font-retro">Speed</span>
                <span className="font-pixel text-sm">{stats.speed}/10</span>
              </div>
              <div className="w-full bg-gray-200 h-4">
                <div className="bg-[#43B047] h-4" style={{ width: `${stats.speed * 10}%` }}></div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="font-retro">Jump Power</span>
                <span className="font-pixel text-sm">{stats.jump}/10</span>
              </div>
              <div className="w-full bg-gray-200 h-4">
                <div className="bg-[#E52521] h-4" style={{ width: `${stats.jump * 10}%` }}></div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="font-retro">Mining Power</span>
                <span className="font-pixel text-sm">{stats.mining}/10</span>
              </div>
              <div className="w-full bg-gray-200 h-4">
                <div className="bg-[#FBD000] h-4" style={{ width: `${stats.mining * 10}%` }}></div>
              </div>
            </div>
          </PixelBorder>
        </div>
      </div>
    </section>
  );
};

export default ProfileSetup;
