import React, { useState, useRef, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
}

const quickQuestions = [
  'How much did I spend this week?',
  'Where can I cut my spending?',
  'How much should I save each month?',
  'Help me create a budget'
];

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      content: "Hi there! I'm Lucas, your personal finance assistant. I can help answer questions about your spending, saving habits, and offer financial advice. What would you like to know about your finances today?",
      sender: 'bot'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await apiRequest('GET', `/api/chatbot-query?question=${encodeURIComponent(inputValue)}`, undefined);
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
      toast({
        title: 'Error',
        description: 'Failed to get a response from the chatbot. Please try again.',
        variant: 'destructive',
      });

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

  const handleQuickQuestion = async (question: string) => {
    if (isLoading) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: question,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await apiRequest('GET', `/api/chatbot-query?question=${encodeURIComponent(question)}`, undefined);
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
      toast({
        title: 'Error',
        description: 'Failed to get a response from the chatbot. Please try again.',
        variant: 'destructive',
      });

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

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Chat with Lucas</h3>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto" 
        style={{ minHeight: '300px', maxHeight: '60vh' }}
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex items-start mb-4 ${message.sender === 'user' ? 'justify-end' : ''}`}
          >
            {message.sender === 'bot' && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <i className="fas fa-robot"></i>
              </div>
            )}
            
            <div 
              className={`chat-message ${
                message.sender === 'bot' 
                  ? 'ml-3 bg-gray-100 text-gray-800' 
                  : 'mr-3 bg-blue-500 text-white'
              } rounded-lg p-3`}
            >
              {message.content.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
              ))}
            </div>
            
            {message.sender === 'user' && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <i className="fas fa-robot"></i>
            </div>
            <div className="ml-3 chat-message bg-gray-100 rounded-lg p-3">
              <p className="text-gray-800">Thinking...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex">
          <input 
            type="text" 
            id="chatInput"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 rounded-l-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ask Lucas about your finances..."
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white rounded-r-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {quickQuestions.map((question) => (
            <button 
              key={question}
              onClick={() => handleQuickQuestion(question)}
              disabled={isLoading}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 disabled:opacity-50"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
