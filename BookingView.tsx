
import React, { useState } from 'react';
import { Card, SectionTitle, Button } from './UIProvider';

const FlightCard: React.FC<{
  flightNo: string;
  fromCode: string;
  fromName: string;
  toCode: string;
  toName: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  boarding: string;
  gate: string;
  type: 'intl' | 'return' | 'domestic';
}> = ({ flightNo, fromCode, fromName, toCode, toName, date, departureTime, arrivalTime, duration, boarding, gate, type }) => {
  const themes = {
    intl: 'bg-gradient-to-br from-[#1a2a6c] via-[#203a43] to-[#2c5364] text-white',
    return: 'bg-gradient-to-br from-[#5D6D7E] via-[#4a5a6a] to-[#34495e] text-white',
    domestic: 'bg-white text-[#5D6D7E] border border-gray-100'
  };

  const isDark = type !== 'domestic';

  return (
    <div className="relative group perspective-1000">
      <div className={`relative rounded-[32px] p-6 soft-shadow transition-all duration-500 hover:-translate-y-1 hover:rotate-1 active:scale-95 cursor-pointer overflow-hidden ${themes[type]}`}>
        {isDark && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
        )}
        <div className={`flex justify-between items-center border-b pb-4 mb-4 ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-[#88D8B0]/10'}`}>
              <i className={`fa-solid fa-plane text-lg ${isDark ? 'text-white' : 'text-[#88D8B0]'} ${type === 'return' ? 'rotate-[225deg]' : 'rotate-45'}`}></i>
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'opacity-60' : 'text-gray-400'}`}>Flight No.</p>
              <h3 className="text-lg font-black">{flightNo}</h3>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isDark ? 'bg-white/20' : 'bg-gray-100 text-gray-400'}`}>
              {type === 'intl' ? 'First Leg' : type === 'return' ? 'Final Leg' : 'Domestic'}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-end mb-6 px-1">
          <div className="text-left w-24">
            <h4 className={`text-xl font-black mb-1 ${isDark ? 'text-white' : 'text-[#88D8B0]'}`}>{departureTime}</h4>
            <h2 className="text-4xl font-black tracking-tighter">{fromCode}</h2>
            <p className={`text-[10px] font-bold uppercase truncate ${isDark ? 'opacity-60' : 'text-gray-400'}`}>{fromName}</p>
          </div>
          <div className="flex-1 flex flex-col items-center px-4 mb-4">
            <div className={`relative w-full h-[2px] ${isDark ? 'bg-white/20' : 'bg-gray-100'}`}>
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 ${isDark ? 'bg-[#1a2a6c]' : 'bg-white'}`}>
                <i className={`fa-solid fa-plane-up text-[12px] ${isDark ? 'text-white/40' : 'text-gray-300'}`}></i>
              </div>
            </div>
            <p className={`text-[9px] font-black mt-2 uppercase tracking-tighter ${isDark ? 'opacity-40' : 'text-gray-300'}`}>{duration}</p>
          </div>
          <div className="text-right w-24">
            <h4 className={`text-xl font-black mb-1 ${isDark ? 'text-white' : 'text-[#88D8B0]'}`}>{arrivalTime}</h4>
            <h2 className="text-4xl font-black tracking-tighter">{toCode}</h2>
            <p className={`text-[10px] font-bold uppercase truncate ${isDark ? 'opacity-60' : 'text-gray-400'}`}>{toName}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className={`p-2 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-[8px] font-black uppercase mb-1 ${isDark ? 'opacity-40' : 'text-gray-300'}`}>Boarding</p>
            <p className="text-xs font-black tracking-wider">{boarding}</p>
          </div>
          <div className={`p-2 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-[8px] font-black uppercase mb-1 ${isDark ? 'opacity-40' : 'text-gray-300'}`}>Gate</p>
            <p className="text-xs font-black tracking-wider">{gate}</p>
          </div>
          <div className={`p-2 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-[8px] font-black uppercase mb-1 ${isDark ? 'opacity-40' : 'text-gray-300'}`}>Date</p>
            <p className="text-xs font-black tracking-wider">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StayCard: React.FC<{
  name: string;
  subName?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  address: string;
  price: string;
  bookingId: string;
  stars?: number;
  checkInTime: string;
  checkOutTime: string;
  theme: 'van' | 'yk-nova' | 'yk-explorer';
}> = ({ name, subName, checkIn, checkOut, nights, address, price, bookingId, stars, checkInTime, checkOutTime, theme }) => {
  const themes = {
    van: 'bg-[#FDFCF0] border-[#E0E5D5]',
    'yk-nova': 'bg-[#F0F7FD] border-[#D5E1E5]',
    'yk-explorer': 'bg-[#FCF5FD] border-[#E5D5E1]'
  };
  const accentColors = {
    van: 'text-amber-500',
    'yk-nova': 'text-blue-500',
    'yk-explorer': 'text-purple-500'
  };

  return (
    <div className="group active:scale-[0.98] transition-all">
      <Card className={`${themes[theme]} border-2 border-dashed p-6 relative overflow-hidden mb-4`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-1 mb-1">
              {stars && Array.from({ length: stars }).map((_, i) => (
                <i key={i} className={`fa-solid fa-star text-[10px] text-amber-400`}></i>
              ))}
            </div>
            <h3 className="text-xl font-black text-[#5D6D7E] leading-tight">{name}</h3>
            {subName && <p className="text-xs text-gray-400 font-bold">{subName}</p>}
          </div>
          <span className="bg-[#88D8B0] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
            已確認
          </span>
        </div>
        <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-white">
          <div className="text-center">
            <p className="text-[10px] text-gray-400 font-black uppercase mb-1">入住</p>
            <p className="text-sm font-black text-[#5D6D7E]">{checkIn}</p>
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black text-gray-400">
            {nights} 晚
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 font-black uppercase mb-1">退房</p>
            <p className="text-sm font-black text-[#5D6D7E]">{checkOut}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <i className={`fa-solid fa-location-dot mt-1 ${accentColors[theme]}`}></i>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">{address}</p>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <p className="text-xs font-mono font-bold text-gray-500">{bookingId}</p>
            <p className={`text-lg font-black ${accentColors[theme]}`}>{price}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

const BookingView: React.FC = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');

  const handleUnlock = () => {
    if (pin === '007') {
      setIsLocked(false);
    } else {
      alert('PIN 碼錯誤！(提示：007)');
      setPin('');
    }
  };

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-3xl bg-white soft-shadow flex items-center justify-center mb-6">
          <i className="fa-solid fa-lock text-3xl text-[#88D8B0]"></i>
        </div>
        <h2 className="text-xl font-black text-[#5D6D7E] mb-2">隱私保護</h2>
        <p className="text-xs text-gray-400 font-bold mb-8">請輸入 PIN 碼查看預訂細節</p>
        <div className="flex gap-4 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full border-2 border-[#88D8B0] ${pin.length >= i ? 'bg-[#88D8B0]' : ''}`}></div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map(n => (
            <button key={n.toString()} onClick={() => {
              if (n === 'C') setPin('');
              else if (n === '✓') handleUnlock();
              else if (pin.length < 3) setPin(p => p + n);
            }} className="w-16 h-16 rounded-2xl bg-white soft-shadow font-black text-lg text-[#5D6D7E] active:scale-90 transition-all">
              {n}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 space-y-8">
      <div>
        <SectionTitle title="國際航段 (去程)" icon="fa-solid fa-plane-departure" />
        <FlightCard type="intl" flightNo="BR 10" fromCode="TPE" fromName="Taipei Taoyuan" toCode="YVR" toName="Vancouver Int." date="FEB 18" departureTime="23:55" arrivalTime="18:35" duration="12h 45m" boarding="23:15" gate="D3" />
      </div>
      <div>
        <SectionTitle title="住宿預訂" icon="fa-solid fa-hotel" />
        <StayCard theme="van" name="溫哥華市中心三房公寓" subName="LXY Condo" stars={3} checkIn="2026/02/18" checkOut="2026/02/24" nights={6} address="179 Keefer Place, Vancouver" bookingId="16163234" price="$31,139" checkInTime="14:00" checkOutTime="10:00" />
      </div>
    </div>
  );
};

export default BookingView;
