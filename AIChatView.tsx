
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
              <p className="text-sm font-medium">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && <div className="text-[10px] text-gray-400 px-4">AI 正在思考中...</div>}
      </div>

      <div className="mt-4 px-2">
        <div className="bg-white rounded-[32px] p-2 soft-shadow flex items-center gap-2 border border-[#E0E5D5]">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="輸入問題..."
            className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-bold text-[#5D6D7E]"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 rounded-full bg-[#88D8B0] text-white flex items-center justify-center transition-all active:scale-90"
          >
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatView;
