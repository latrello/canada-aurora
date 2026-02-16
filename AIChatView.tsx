
import React, { useState, useRef, useEffect } from 'react';
import { Card, SectionTitle } from '../components/UIProvider';
import { askGemini } from '../services/geminiService';

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
      text: '你好！我是你的極光之旅 AI 小助手。無論是行程規劃、天氣查詢還是極光攝影技巧，我都能為你解答。想問點什麼嗎？',
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
      
      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar space-y-4 px-2 py-4"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-[24px] px-5 py-3 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-[#88D8B0] text-white rounded-tr-none' 
                : 'bg-white text-[#5D6D7E] border border-[#E0E5D5] rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
              <p className={`text-[8px] mt-1 font-black opacity-40 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#E0E5D5] rounded-[24px] rounded-tl-none px-5 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-[#88D8B0] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[#88D8B0] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-[#88D8B0] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-4 px-2">
        <div className="bg-white rounded-[32px] p-2 soft-shadow flex items-center gap-2 border border-[#E0E5D5]">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="問問 AI 關於極光行程的問題..."
            className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-bold text-[#5D6D7E]"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              input.trim() && !isLoading ? 'bg-[#88D8B0] text-white' : 'bg-gray-100 text-gray-300'
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
