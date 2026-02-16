
import React, { useState, useEffect } from 'react';
import { Card, SectionTitle } from './UIProvider';

interface PlanningItem {
  id: string;
  task: string;
  completed: boolean;
  assignee: string;
  category: string;
}

const PlanningView: React.FC = () => {
  const [items, setItems] = useState<PlanningItem[]>(() => {
    const saved = localStorage.getItem('aurora_trip_planning');
    return saved ? JSON.parse(saved) : [
      { id: '1', task: '辦理 eTA 加拿大簽證', completed: true, assignee: '所有人', category: 'TODO' },
      { id: '2', task: '購買防寒羽絨衣 (-20度等級)', completed: false, assignee: 'Kevin', category: 'PACKING' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('aurora_trip_planning', JSON.stringify(items));
  }, [items]);

  const toggle = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  return (
    <div className="pb-24 space-y-8">
      <SectionTitle title="準備清單" icon="fa-solid fa-list-check" />
      <Card className="space-y-1">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-2 group cursor-pointer" onClick={() => toggle(item.id)}>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${item.completed ? 'bg-[#88D8B0] border-[#88D8B0] text-white' : 'border-[#E0E5D5]'}`}>
              {item.completed && <i className="fa-solid fa-check text-xs"></i>}
            </div>
            <span className={`flex-1 text-sm font-bold ${item.completed ? 'text-gray-300 line-through' : 'text-[#2C3E50]'}`}>{item.task}</span>
          </div>
        ))}
      </Card>
      <div className="text-center opacity-40 text-[10px] font-black uppercase tracking-widest">
        Auto-saved to your device
      </div>
    </div>
  );
};

export default PlanningView;
