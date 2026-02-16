
import React, { useState, useRef, useEffect } from 'react';
import { Card, SectionTitle } from './UIProvider';
import { askGemini } from './geminiService';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const AIChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: '你好！我是你的極光之旅 AI 小助手。有什麼關於加拿大行程或極光攝影的問題想問我嗎？',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await askGemini(input);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: aiResponseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] pb-4">
      <SectionTitle title="Aurora AI 助手" icon="fa-solid fa-wand-magic-sparkles" />
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar space-y-5 px-2 py-4"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-[28px] px-5 py-3.5 shadow-md ${
              msg.role === 'user' 
                ? 'bg-[#2D8A61] text-white rounded-tr-none' 
                : 'bg-white text-[#2C3E50] border border-[#E0E5D5] rounded-tl-none'
            }`}>
              <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
              <p className={`text-[9px] mt-1.5 font-black opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-[#E0E5D5] rounded-[24px] rounded-tl-none px-5 py-3 shadow-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#2D8A61] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[#2D8A61] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-[#2D8A61] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">AI Thinking...</span>
             </div>
          </div>
        )}
      </div>

      <div className="mt-4 px-2">
        <div className="bg-white rounded-[32px] p-2 soft-shadow flex items-center gap-2 border border-[#E0E5D5]">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="輸入問題或攝影技巧..."
            className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-black text-[#2C3E50]"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              input.trim() && !isLoading ? 'bg-[#2D8A61] text-white shadow-lg' : 'bg-gray-100 text-gray-300'
            }`}
          >
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatView;
