import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import PixelBorder from './PixelBorder';
import { useToast } from '@/hooks/use-toast';

// Define form validation schema
const questionSchema = z.object({
  question: z.string().min(3, {
    message: "Your question must be at least 3 characters long",
  }).max(500, {
    message: "Your question is too long. Keep it under 500 characters."
  }),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

const Web3Expert = () => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: '',
    },
  });
  
  const onSubmit = async (values: QuestionFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/web3-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get advice');
      }
      
      const data = await response.json();
      setAdvice(data.advice);
    } catch (error) {
      console.error('Error getting Web3 advice:', error);
      toast({
        title: "Error",
        description: "Failed to get Web3 advice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <PixelBorder background="black" className="p-6 max-w-2xl mx-auto my-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-pixel text-[#F5B700] mb-2">WEB3 EXPERT ASSISTANT</h2>
        <p className="text-sm font-retro text-gray-300">Ask anything about cryptocurrency, NFTs, and blockchain gaming!</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-pixel">Your Question</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="E.g., How do NFTs work in blockchain games?" 
                    className="bg-[#111] text-white border-[#333] min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-[#F5B700] hover:bg-[#D4A000] text-black font-pixel"
            disabled={isLoading}
          >
            {isLoading ? "Consulting the Experts..." : "GET EXPERT ADVICE"}
          </Button>
        </form>
      </Form>
      
      {advice && (
        <div className="mt-8 p-4 bg-[#00205B] bg-opacity-50 rounded border border-[#3373F2]">
          <h3 className="text-xl font-pixel text-[#F5B700] mb-2">EXPERT ADVICE:</h3>
          <div className="text-white font-retro text-sm whitespace-pre-wrap">{advice}</div>
        </div>
      )}
      
      <div className="mt-8 grid grid-cols-4 gap-3">
        <div className="bg-[#111] rounded p-3 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#F7931A] mb-2 flex items-center justify-center">₿</div>
          <span className="text-xs text-center text-white font-retro">Bitcoin</span>
        </div>
        <div className="bg-[#111] rounded p-3 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#627EEA] mb-2 flex items-center justify-center">Ξ</div>
          <span className="text-xs text-center text-white font-retro">Ethereum</span>
        </div>
        <div className="bg-[#111] rounded p-3 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#C2A633] mb-2 flex items-center justify-center">Ð</div>
          <span className="text-xs text-center text-white font-retro">Dogecoin</span>
        </div>
        <div className="bg-[#111] rounded p-3 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#F0B90B] mb-2 flex items-center justify-center">B</div>
          <span className="text-xs text-center text-white font-retro">BNB</span>
        </div>
      </div>
    </PixelBorder>
  );
};

export default Web3Expert;