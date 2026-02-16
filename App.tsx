
import React, { useState } from 'react';
import ScheduleView from './views/ScheduleView';
import BookingView from './views/BookingView';
import ExpenseView from './views/ExpenseView';
import ExchangeView from './views/ExchangeView';
import AIChatView from './views/AIChatView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('schedule');

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule': return <ScheduleView />;
      case 'booking': return <BookingView />;
      case 'expense': return <ExpenseView />;
      case 'exchange': return <ExchangeView />;
      case 'ai': return <AIChatView />;
      default: return <ScheduleView />;
    }
  };

  const navItems = [
    { id: 'schedule', icon: 'fa-calendar-days', label: '行程' },
    { id: 'booking', icon: 'fa-ticket', label: '預訂' },
    { id: 'expense', icon: 'fa-coins', label: '記帳' },
    { id: 'exchange', icon: 'fa-calculator', label: '匯率' },
    { id: 'ai', icon: 'fa-wand-magic-sparkles', label: 'AI' },
  ];

  return (
    <div className="min-h-screen max-w-md mx-auto relative px-4 pt-8">
      {/* Header - Designed with a concrete Canadian Flag emblem */}
      <header className="flex items-center gap-4 mb-10 px-2 group">
        <div className="relative">
          <div className="w-14 h-14 bg-white rounded-2xl flex soft-shadow transform -rotate-12 transition-transform group-hover:rotate-0 border border-[#E0E5D5] overflow-hidden">
             {/* Canadian Flag Design: Red-White-Red (1:2:1 ratio) */}
             <div className="w-1/4 h-full bg-[#E31837]"></div>
             <div className="w-1/2 h-full bg-white flex items-center justify-center">
                <i className="fa-brands fa-canadian-maple-leaf text-2xl text-[#E31837]"></i>
             </div>
             <div className="w-1/4 h-full bg-[#E31837]"></div>
          </div>
          {/* Status Dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#88D8B0] rounded-full border-2 border-[#F7F4EB] z-10"></div>
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-[#5D6D7E] tracking-tighter leading-none flex items-baseline gap-1">
            Canada <span className="text-[#88D8B0] italic">Aurora</span>
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="h-[2px] w-6 bg-gradient-to-r from-[#88D8B0] to-transparent rounded-full"></div>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">Feb 18 — Mar 02</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[#E0E5D5] pb-8 pt-3 px-6 safe-area-bottom z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === item.id ? 'text-[#88D8B0] -translate-y-1' : 'text-gray-300'}`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${activeTab === item.id ? 'bg-[#88D8B0]/10 ring-1 ring-[#88D8B0]/20' : ''}`}>
                <i className={`fa-solid ${item.icon} text-lg`}></i>
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
