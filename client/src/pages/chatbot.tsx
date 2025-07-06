import React from 'react';
import ChatWindow from '@/components/chatbot/chat-window';

const Chatbot: React.FC = () => {
  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Lucas Assistant</h2>
        <p className="text-gray-600 mt-1">Ask questions about your finances and get personalized advice</p>
      </div>
      
      <ChatWindow />
    </div>
  );
};

export default Chatbot;
