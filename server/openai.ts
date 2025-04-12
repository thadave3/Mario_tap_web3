import OpenAI from "openai";

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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