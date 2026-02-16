
import React, { useState } from 'react';
import ScheduleView from './ScheduleView';
import BookingView from './BookingView';
import ExpenseView from './ExpenseView';
import ExchangeView from './ExchangeView';
import AIChatView from './AIChatView';

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
      {/* Header */}
      <header className="flex items-center gap-4 mb-8 px-2 group">
        <div className="relative">
          <div className="w-12 h-12 bg-white rounded-2xl flex soft-shadow border border-[#D5DBCB] overflow-hidden">
             <div className="w-1/4 h-full bg-[#E31837]"></div>
             <div className="w-1/2 h-full bg-white flex items-center justify-center">
                <i className="fa-brands fa-canadian-maple-leaf text-xl text-[#E31837]"></i>
             </div>
             <div className="w-1/4 h-full bg-[#E31837]"></div>
          </div>
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#2D8A61] rounded-full border-2 border-[#F7F4EB] shadow-sm"></div>
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-[#2C3E50] tracking-tighter leading-none">
            Canada <span className="text-[#2D8A61]">Aurora</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1.5">Feb 18 — Mar 02</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#D5DBCB] pb-8 pt-3 px-2 safe-area-bottom z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto flex justify-around items-center">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === item.id ? 'text-[#2D8A61] scale-110' : 'text-gray-400'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === item.id ? 'bg-[#2D8A61]/10 ring-1 ring-[#2D8A61]/30 shadow-inner' : ''}`}>
                <i className={`fa-solid ${item.icon} text-xl`}></i>
              </div>
              <span className={`text-[11px] font-black uppercase tracking-tight ${activeTab === item.id ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
