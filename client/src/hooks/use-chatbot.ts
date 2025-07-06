import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
}

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      content: "Hi there! I'm Lucas, your personal finance assistant. I can help answer questions about your spending, saving habits, and offer financial advice. What would you like to know about your finances today?",
      sender: 'bot'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await apiRequest('GET', `/api/chatbot-query?question=${encodeURIComponent(message)}`, undefined);
      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: 'bot'
        }
      ]);
    } catch (error) {
      console.error('Error querying chatbot:', error);
      
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "I'm sorry, I couldn't process your request at the moment. Please try again later.",
          sender: 'bot'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
}
