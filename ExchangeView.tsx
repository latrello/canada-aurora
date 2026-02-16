
import React, { useState } from 'react';
import { Card, SectionTitle, Button } from './UIProvider';

const ExchangeView: React.FC = () => {
  const [cad, setCad] = useState<string>('1');
  const [location, setLocation] = useState<'BC' | 'NWT'>('NWT');
  const rate = 23.85;
  const tax = location === 'BC' ? 1.12 : 1.05; 

  const resultTwd = (parseFloat(cad) || 0) * tax * rate;

  return (
    <div className="pb-24 space-y-6">
      <SectionTitle title="稅率與匯率換算" icon="fa-solid fa-calculator" />
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setLocation('BC')} className={`p-4 rounded-3xl font-bold ${location === 'BC' ? 'bg-[#88D8B0] text-white' : 'bg-white text-gray-400'}`}>卑詩省 (BC)</button>
        <button onClick={() => setLocation('NWT')} className={`p-4 rounded-3xl font-bold ${location === 'NWT' ? 'bg-[#88D8B0] text-white' : 'bg-white text-gray-400'}`}>西北地區 (NWT)</button>
      </div>
      <Card className="p-8">
        <label className="text-xs font-bold text-gray-400 block mb-2">CAD 原價 (未稅)</label>
        <input type="number" value={cad} onChange={(e) => setCad(e.target.value)} className="w-full bg-gray-50 p-4 rounded-2xl text-2xl font-bold mb-6" />
        <label className="text-xs font-bold text-gray-400 block mb-2">換算 TWD (含稅)</label>
        <div className="bg-gray-100 p-4 rounded-2xl text-3xl font-black text-[#88D8B0]">${Math.round(resultTwd).toLocaleString()}</div>
      </Card>
    </div>
  );
};

export default ExchangeView;
