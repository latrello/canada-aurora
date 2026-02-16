
import React, { useState } from 'react';
import { Card, SectionTitle } from '../components/UIProvider';

const PlanningView: React.FC = () => {
  const [items, setItems] = useState([
    { id: '1', task: '辦理 eTA 加拿大簽證', completed: true, assignee: '所有人', category: 'TODO' },
    { id: '2', task: '購買防寒羽絨衣 (-20度等級)', completed: false, assignee: 'Kevin', category: 'PACKING' },
    { id: '3', task: '租借腳架', completed: false, assignee: 'Emily', category: 'PACKING' },
    { id: '4', task: '楓糖餅乾 (10盒)', completed: false, assignee: '所有人', category: 'SHOPPING' },
  ]);

  const toggle = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  return (
    <div className="pb-24 space-y-8">
      <div>
        <SectionTitle title="待辦清單" icon="fa-solid fa-clipboard-check" />
        <Card className="space-y-1">
          {items.filter(i => i.category === 'TODO').map(item => (
            <div key={item.id} className="flex items-center gap-3 p-2 group" onClick={() => toggle(item.id)}>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${item.completed ? 'bg-[#88D8B0] border-[#88D8B0] text-white' : 'border-[#E0E5D5]'}`}>
                {item.completed && <i className="fa-solid fa-check text-xs"></i>}
              </div>
              <span className={`flex-1 text-sm ${item.completed ? 'text-gray-300 line-through' : 'text-gray-600'}`}>{item.task}</span>
              <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-1 rounded-full">{item.assignee}</span>
            </div>
          ))}
        </Card>
      </div>

      <div>
        <SectionTitle title="行李清單" icon="fa-solid fa-suitcase" />
        <Card className="space-y-1">
          {items.filter(i => i.category === 'PACKING').map(item => (
            <div key={item.id} className="flex items-center gap-3 p-2" onClick={() => toggle(item.id)}>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${item.completed ? 'bg-[#88D8B0] border-[#88D8B0] text-white' : 'border-[#E0E5D5]'}`}>
                {item.completed && <i className="fa-solid fa-check text-xs"></i>}
              </div>
              <span className={`flex-1 text-sm ${item.completed ? 'text-gray-300 line-through' : 'text-gray-600'}`}>{item.task}</span>
              <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-1 rounded-full">{item.assignee}</span>
            </div>
          ))}
        </Card>
      </div>

      <button className="w-full p-4 rounded-3xl bg-white border-2 border-dashed border-[#E0E5D5] text-gray-400 font-bold text-sm">
        + 新增清單項目
      </button>
    </div>
  );
};

export default PlanningView;
