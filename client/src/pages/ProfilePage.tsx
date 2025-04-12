import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useGame } from '@/context/GameContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileSetup from '@/components/ProfileSetup';
import PixelBorder from '@/components/PixelBorder';
import PixelButton from '@/components/PixelButton';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import QuestionBlock from '@/components/QuestionBlock';
import { Facebook, MessageCircle, Twitch } from 'lucide-react';

const profileSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  walletAddress: z.string().optional(),
  email: z.string().email().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { toast } = useToast();
  const { userId, coins, level, experience } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "CryptoJumper",
      walletAddress: userId ? `0x71C...4E3a` : "",
      email: "",
    }
  });
  
  // Handle form submission
  const onSubmit = (data: ProfileFormValues) => {
    // If we had a real user ID, we would update the user's profile
    if (userId) {
      // Simulating profile update
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } else {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to save your profile.",
        variant: "destructive"
      });
    }
    
    setIsEditing(false);
  };

  // Calculate progress percentage for level
  const progressPercentage = Math.min(100, (experience / (level * 100)) * 100);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <section className="py-12 px-6 bg-[#5C94FC] relative">
          <div 
            className="clouds absolute" 
            style={{ 
              top: "20%",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100' width='200' height='100'%3E%3Cpath d='M30,70 Q50,40 70,70 Q90,40 110,70 Q130,40 150,70 Q170,40 190,70' fill='white' stroke='white' stroke-width='20' stroke-linecap='round'/%3E%3C/svg%3E")`,
            }}
          />
          
          <div className="max-w-7xl mx-auto">
            <h1 className="font-pixel text-center text-3xl text-black mb-12">YOUR PLAYER PROFILE</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <PixelBorder background="white" className="p-6">
                  <h2 className="font-pixel text-[#E52521] text-xl mb-6">PLAYER CARD</h2>
                  
                  <div className="bg-black bg-opacity-10 p-4 rounded-lg text-center">
                    <svg 
                      className="w-40 h-40 mx-auto mb-4"
                      viewBox="0 0 160 160" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <rect width="160" height="160" fill="#E52521" />
                        <rect x="40" y="32" width="80" height="48" fill="#FFB266" />
                        <rect x="40" y="80" width="80" height="16" fill="#000000" />
                        <rect x="56" y="48" width="16" height="16" fill="#000000" />
                        <rect x="88" y="48" width="16" height="16" fill="#000000" />
                      </g>
                    </svg>
                    
                    <div className="font-pixel text-center text-xl mb-2">
                      {form.getValues("username")}
                    </div>
                    
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-retro">LEVEL {level}</span>
                      <span className="font-pixel text-sm">{experience}/{level * 100} XP</span>
                    </div>
                    <div className="w-full bg-gray-200 h-4 mb-4">
                      <div 
                        className="bg-[#E52521] h-4" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="bg-black bg-opacity-20 p-3 rounded-lg mb-4">
                      <div className="flex justify-between items-center">
                        <span className="font-retro">COINS:</span>
                        <span className="font-pixel text-[#FFCF40]">{coins}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="font-retro">DOMAINS:</span>
                        <span className="font-pixel">0</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="font-retro">NFTS:</span>
                        <span className="font-pixel">0</span>
                      </div>
                    </div>
                    
                    <PixelButton
                      variant="yellow"
                      className="w-full"
                      onClick={() => setIsEditing(true)}
                    >
                      EDIT PROFILE
                    </PixelButton>
                  </div>
                </PixelBorder>

                <PixelBorder background="white" className="p-6 mt-6">
                  <h2 className="font-pixel text-[#43B047] text-xl mb-6">ACHIEVEMENTS</h2>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <QuestionBlock className="w-12 h-12 mx-auto" />
                    <QuestionBlock className="w-12 h-12 mx-auto" />
                    <QuestionBlock className="w-12 h-12 mx-auto" />
                    <QuestionBlock className="w-12 h-12 mx-auto" />
                    <QuestionBlock className="w-12 h-12 mx-auto" />
                    <QuestionBlock className="w-12 h-12 mx-auto" />
                  </div>
                  
                  <p className="font-retro text-center mt-4">
                    Play games to unlock achievements!
                  </p>
                </PixelBorder>
              </div>
              
              <div className="md:col-span-2">
                <PixelBorder background="white" className="p-6">
                  {isEditing ? (
                    <>
                      <h2 className="font-pixel text-[#FBD000] text-xl mb-6">EDIT PROFILE</h2>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            name="walletAddress"
                            render={({ field }) => (
                              <FormItem className="mb-4">
                                <FormLabel className="font-retro text-lg block mb-1">Wallet Address</FormLabel>
                                <FormControl>
                                  <Input {...field} className="w-full font-pixel text-sm p-2 border-4 border-black" disabled />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="mb-4">
                                <FormLabel className="font-retro text-lg block mb-1">Email (optional)</FormLabel>
                                <FormControl>
                                  <Input {...field} className="w-full font-pixel text-sm p-2 border-4 border-black" />
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
                          
                          <div className="flex gap-4">
                            <PixelButton 
                              variant="green" 
                              className="flex-1"
                              type="submit"
                            >
                              SAVE CHANGES
                            </PixelButton>
                            
                            <PixelButton 
                              variant="red" 
                              className="flex-1"
                              type="button"
                              onClick={() => setIsEditing(false)}
                            >
                              CANCEL
                            </PixelButton>
                          </div>
                        </form>
                      </Form>
                    </>
                  ) : (
                    <>
                      <h2 className="font-pixel text-[#5B6EE1] text-xl mb-6">GAME HISTORY</h2>
                      
                      <div className="mb-6">
                        <h3 className="font-pixel text-black text-lg mb-3">RECENT SCORES</h3>
                        
                        <div className="space-y-2">
                          {userId ? (
                            <>
                              <div className="flex justify-between items-center bg-black bg-opacity-10 p-3 rounded">
                                <span className="font-retro">Blockchain Tap Game</span>
                                <span className="font-pixel text-[#E52521]">4,250</span>
                                <span className="font-retro text-sm">2 days ago</span>
                              </div>
                              <div className="flex justify-between items-center bg-black bg-opacity-10 p-3 rounded">
                                <span className="font-retro">Blockchain Tap Game</span>
                                <span className="font-pixel text-[#E52521]">3,120</span>
                                <span className="font-retro text-sm">5 days ago</span>
                              </div>
                              <div className="flex justify-between items-center bg-black bg-opacity-10 p-3 rounded">
                                <span className="font-retro">Blockchain Tap Game</span>
                                <span className="font-pixel text-[#E52521]">2,890</span>
                                <span className="font-retro text-sm">1 week ago</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-6">
                              <p className="font-retro text-lg mb-4">Connect your wallet to see your game history</p>
                              <PixelButton variant="yellow">CONNECT WALLET</PixelButton>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-pixel text-black text-lg mb-3">YOUR DOMAINS</h3>
                        
                        {userId ? (
                          <div className="text-center py-6 bg-black bg-opacity-10 rounded">
                            <p className="font-retro text-lg mb-4">You don't own any domains yet</p>
                            <PixelButton variant="green">EXPLORE DOMAINS</PixelButton>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <p className="font-retro text-lg mb-4">Connect your wallet to see your domains</p>
                            <PixelButton variant="yellow">CONNECT WALLET</PixelButton>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-pixel text-black text-lg mb-3">YOUR REWARDS</h3>
                        
                        {userId ? (
                          <div className="text-center py-6 bg-black bg-opacity-10 rounded">
                            <p className="font-retro text-lg mb-4">You haven't redeemed any rewards yet</p>
                            <PixelButton variant="red">EXPLORE REWARDS</PixelButton>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <p className="font-retro text-lg mb-4">Connect your wallet to see your rewards</p>
                            <PixelButton variant="yellow">CONNECT WALLET</PixelButton>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </PixelBorder>
              </div>
            </div>
          </div>
        </section>
        
        <ProfileSetup />
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
