
import React, { useState } from 'react';
import { Card, SectionTitle } from './UIProvider';

const ExchangeView: React.FC = () => {
  const [cad, setCad] = useState<string>('1');
  const [location, setLocation] = useState<'BC' | 'NWT'>('NWT');
  const rate = 23.85;
  const tax = location === 'BC' ? 1.12 : 1.05; 

  const resultTwd = (parseFloat(cad) || 0) * tax * rate;

  return (
    <div className="pb-24 space-y-6">
      <SectionTitle title="匯率與稅率換算" icon="fa-solid fa-calculator" />
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setLocation('BC')} className={`p-4 rounded-3xl font-black transition-all ${location === 'BC' ? 'bg-[#2D8A61] text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100'}`}>卑詩省 (BC 12%)</button>
        <button onClick={() => setLocation('NWT')} className={`p-4 rounded-3xl font-black transition-all ${location === 'NWT' ? 'bg-[#2D8A61] text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100'}`}>西北地區 (NWT 5%)</button>
      </div>
      <Card className="p-8 shadow-md">
        <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-3">CAD 原價 (未稅)</label>
        <div className="relative">
          <input 
            type="number" 
            value={cad} 
            onChange={(e) => setCad(e.target.value)} 
            className="w-full bg-gray-50 p-5 rounded-2xl text-2xl font-black mb-6 text-[#2D8A61] outline-none border border-gray-100 focus:ring-4 focus:ring-[#2D8A61]/10 transition-all" 
          />
          <span className="absolute right-5 top-5 font-black text-gray-300 text-sm">CAD</span>
        </div>
        <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-3">換算 TWD (含稅)</label>
        <div className="bg-gray-100 p-5 rounded-2xl text-3xl font-black text-[#2D8A61] flex justify-between items-center shadow-inner">
           <span>${Math.round(resultTwd).toLocaleString()}</span>
           <span className="text-xs font-black opacity-30">TWD</span>
        </div>
      </Card>
      <Card className="text-[11px] text-gray-600 leading-relaxed bg-white/50 border border-dashed border-[#D5DBCB] p-5">
        <p className="font-bold flex items-center gap-2 mb-1"><i className="fa-solid fa-info-circle text-[#2D8A61] text-sm"></i> 換算資訊 Reference</p>
        <p>• 匯率參考: 台灣銀行概估匯率 (1 CAD ≈ {rate} TWD)</p>
        <p>• BC 稅率: GST (5%) + PST (7%) = 12%</p>
        <p>• NWT 稅率: GST (5%) = 5%</p>
      </Card>
    </div>
  );
};

export default ExchangeView;
