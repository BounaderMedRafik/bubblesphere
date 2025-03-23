import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function useCompletion() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const getCompletion = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await model.generateContent(prompt);
      setResult(response.response.text());
    } catch (error) {
      console.error("Error fetching completion:", error);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { result, isLoading, getCompletion };
}

export default useCompletion;
