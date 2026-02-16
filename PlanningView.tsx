
import React, { useState } from 'react';
import { Card, SectionTitle } from './UIProvider';

const PlanningView: React.FC = () => {
  const [items, setItems] = useState([
    { id: '1', task: '辦理 eTA 加拿大簽證', completed: true, assignee: '所有人', category: 'TODO' },
    { id: '2', task: '購買防寒羽絨衣 (-20度等級)', completed: false, assignee: 'Kevin', category: 'PACKING' },
  ]);

  const toggle = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  return (
    <div className="pb-24 space-y-8">
      <SectionTitle title="準備清單" icon="fa-solid fa-list-check" />
      <Card className="space-y-1">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-2 group" onClick={() => toggle(item.id)}>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${item.completed ? 'bg-[#88D8B0] border-[#88D8B0] text-white' : 'border-[#E0E5D5]'}`}>
              {item.completed && <i className="fa-solid fa-check text-xs"></i>}
            </div>
            <span className={`flex-1 text-sm ${item.completed ? 'text-gray-300 line-through' : 'text-gray-600'}`}>{item.task}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default PlanningView;
