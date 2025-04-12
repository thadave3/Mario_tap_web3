import OpenAI from "openai";

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Web3 expert assistant ID for advanced Web3 functionality
const WEB3_EXPERT_ASSISTANT_ID = "asst_b1BcCL2OfO4vUyvHXAq1sYHd";

// Function to generate an AI-powered game hint or tip
export async function generateGameHint(context: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an AI game assistant for a Mario Brothers themed blockchain game. Provide helpful, fun, and concise gaming tips."
        },
        {
          role: "user",
          content: `Context: ${context}. Please provide a helpful gaming tip.`
        }
      ],
      max_tokens: 150
    });

    const messageContent = response.choices[0].message.content;
    return messageContent !== null ? messageContent : "No hint available at the moment.";
  } catch (error) {
    console.error("Error generating game hint:", error);
    return "Unable to generate a hint right now. Try again later!";
  }
}

// Function to analyze a game score and provide personalized feedback
export async function analyzeGamePerformance(score: number, character: string): Promise<{
  feedback: string;
  rating: number;
  improvement_tips: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an AI game coach that analyzes player performance in a Mario Brothers themed blockchain game. Provide meaningful feedback and improvement tips."
        },
        {
          role: "user",
          content: `Player used character: ${character} and achieved a score of ${score}. Please analyze this performance.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const messageContent = response.choices[0].message.content;
    if (messageContent === null) {
      return {
        feedback: "Performance analysis unavailable.",
        rating: 3,
        improvement_tips: ["Keep practicing!"]
      };
    }
    
    const result = JSON.parse(messageContent);
    return {
      feedback: result.feedback || "Performance analysis unavailable.",
      rating: result.rating || 3,
      improvement_tips: result.improvement_tips || ["Keep practicing!"]
    };
  } catch (error) {
    console.error("Error analyzing game performance:", error);
    return {
      feedback: "Unable to analyze your performance right now.",
      rating: 3,
      improvement_tips: ["Keep playing and having fun!"]
    };
  }
}

// Function to generate creative domain descriptions
export async function generateDomainDescription(domainName: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a creative Web3 domain marketing expert. Generate engaging, concise descriptions for blockchain domains."
        },
        {
          role: "user",
          content: `Please create a catchy and appealing description for this domain name: ${domainName}`
        }
      ],
      max_tokens: 100
    });

    return response.choices[0].message.content || "A valuable digital asset in the blockchain space.";
  } catch (error) {
    console.error("Error generating domain description:", error);
    return "A unique Web3 domain with unlimited potential.";
  }
}

// Function to get Web3 expert advice for cryptocurrency and blockchain questions
export async function getWeb3ExpertAdvice(
  question: string,
  websiteUrl: string = "https://marioblockchain.app"
): Promise<{
  advice: string;
  resources?: string[];
}> {
  try {
    // Create a thread to interact with the assistant
    const thread = await openai.beta.threads.create();

    // Add user message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: question
    });

    // Run the assistant on the thread with specific parameters aligned with the assistant's configuration
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: WEB3_EXPERT_ASSISTANT_ID,
      instructions: "You are addressing a user of a Mario-themed Web3 gaming platform. Keep your advice relevant to cryptocurrency, NFTs, and blockchain gaming. Explain concepts in simple terms.",
    });

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== "completed") {
      if (runStatus.status === "failed" || runStatus.status === "cancelled") {
        throw new Error(`Run ${runStatus.status}: ${runStatus.last_error}`);
      }
      
      // Add a small delay before checking again
      await new Promise(resolve => setTimeout(resolve, 500));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Get the messages from the thread
    const messages = await openai.beta.threads.messages.list(thread.id);
    
    // Find the assistant's response
    const assistantMessages = Array.from(messages.data)
      .filter(message => message.role === "assistant")
      .sort((a, b) => {
        const aTime = new Date(a.created_at * 1000).getTime();
        const bTime = new Date(b.created_at * 1000).getTime();
        return bTime - aTime; // Sort descending (newest first)
      });

    if (assistantMessages.length === 0) {
      throw new Error("No response from Web3 expert assistant");
    }

    const latestMessage = assistantMessages[0];
    
    // Process message content
    let advice = "";
    let resources: string[] = [];
    
    if (latestMessage.content && latestMessage.content.length > 0) {
      for (const contentPart of latestMessage.content) {
        if (contentPart.type === "text") {
          advice += contentPart.text.value;
        }
      }
    }
    
    return {
      advice: advice || "I couldn't analyze your Web3 question at this time.",
      resources
    };
  } catch (error) {
    console.error("Error getting Web3 expert advice:", error);
    return {
      advice: "Unable to provide Web3 expert advice at this moment. Please try again later."
    };
  }
}