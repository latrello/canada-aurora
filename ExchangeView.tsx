
import React, { useState } from 'react';
import { Card, SectionTitle, Button } from '../components/UIProvider';

const ExchangeView: React.FC = () => {
  const [cad, setCad] = useState<string>('1');
  const [location, setLocation] = useState<'BC' | 'NWT'>('NWT');
  const rate = 23.85;
  const tax = location === 'BC' ? 1.12 : 1.05; // BC: 12%, NWT: 5%

  const resultTwd = (parseFloat(cad) || 0) * tax * rate;

  return (
    <div className="pb-24 space-y-6">
      <SectionTitle title="稅率與匯率換算" icon="fa-solid fa-calculator" />
      
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setLocation('BC')}
          className={`p-4 rounded-3xl transition-all font-bold ${location === 'BC' ? 'bg-[#88D8B0] text-white soft-shadow' : 'bg-white text-gray-400'}`}
        >
          卑詩省 (BC)
          <p className="text-[10px] font-normal mt-1">稅率 12%</p>
        </button>
        <button 
          onClick={() => setLocation('NWT')}
          className={`p-4 rounded-3xl transition-all font-bold ${location === 'NWT' ? 'bg-[#88D8B0] text-white soft-shadow' : 'bg-white text-gray-400'}`}
        >
          西北地區 (NWT)
          <p className="text-[10px] font-normal mt-1">稅率 5%</p>
        </button>
      </div>

      <Card className="p-8">
        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-2">CAD 原價 (未稅)</label>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
              <input 
                type="number" 
                inputMode="decimal"
                value={cad}
                onChange={(e) => setCad(e.target.value)}
                className="bg-transparent border-none outline-none text-2xl font-bold text-gray-700 w-full"
              />
              <span className="font-bold text-gray-400">CAD</span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-[#88D8B0] text-white flex items-center justify-center">
              <i className="fa-solid fa-arrow-down"></i>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 block mb-2">換算 TWD (含稅)</label>
            <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-2xl">
              <span className="text-3xl font-black text-[#88D8B0] w-full">
                ${Math.round(resultTwd).toLocaleString()}
              </span>
              <span className="font-bold text-gray-400">TWD</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="text-xs text-gray-400 leading-relaxed">
        <p>• 匯率參考: 台灣銀行即時牌告匯率 (估算 23.85)</p>
        <p>• BC 稅率包含 GST 5% + PST 7%</p>
        <p>• NWT 稅率僅包含 GST 5%</p>
      </Card>
    </div>
  );
};

export default ExchangeView;
