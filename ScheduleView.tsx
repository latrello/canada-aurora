import React, { useState, useEffect } from 'react';
import { Card, SectionTitle, Button } from './UIProvider';
import { Category, ScheduleItem } from './types';
import { getAuroraPrediction } from './geminiService';

const categoryLang: Record<Category, { zh: string, en: string }> = {
  [Category.SCENERY]: { zh: '景點', en: 'Scenery' },
  [Category.FOOD]: { zh: '美食', en: 'Food' },
  [Category.TRANSPORT]: { zh: '交通', en: 'Transport' },
  [Category.STAY]: { zh: '住宿', en: 'Stay' }
};

const weatherDataMap: Record<string, { temp: string, condition: string, label: string, enLabel: string }> = {
  '2024-02-18': { temp: '-5°C', condition: 'fa-sun', label: '晴朗', enLabel: 'Sunny' },
  '2024-02-19': { temp: '-3°C', condition: 'fa-cloud-sun', label: '多雲時晴', enLabel: 'Partly Cloudy' },
  '2024-02-20': { temp: '2°C', condition: 'fa-cloud-rain', label: '短暫雨', enLabel: 'Light Rain' },
  '2024-02-21': { temp: '0°C', condition: 'fa-cloud', label: '陰天', enLabel: 'Cloudy' },
  '2024-02-22': { temp: '-2°C', condition: 'fa-snowflake', label: '小雪', enLabel: 'Light Snow' },
  '2024-02-23': { temp: '-8°C', condition: 'fa-sun', label: '晴朗', enLabel: 'Sunny' },
  '2024-02-24': { temp: '-15°C', condition: 'fa-snowflake', label: '下雪', enLabel: 'Snowy' },
  '2024-02-25': { temp: '-22°C', condition: 'fa-cloud', label: '多雲', enLabel: 'Cloudy' },
  '2024-02-26': { temp: '-18°C', condition: 'fa-sun', label: '極寒晴朗', enLabel: 'Very Cold & Sunny' },
  '2024-02-27': { temp: '-20°C', condition: 'fa-snowflake', label: '小雪', enLabel: 'Light Snow' },
  '2024-02-28': { temp: '-10°C', condition: 'fa-cloud-sun', label: '多雲時晴', enLabel: 'Partly Cloudy' },
  '2024-03-01': { temp: '4°C', condition: 'fa-cloud-rain', label: '有雨', enLabel: 'Rainy' },
  '2024-03-02': { temp: '2°C', condition: 'fa-sun', label: '晴朗', enLabel: 'Sunny' },
};

const initialScheduleData: Record<string, ScheduleItem[]> = {
  '2024-02-18': [
    { id: '18-1', time: '23:55', location: '桃園國際機場 Taoyuan Int. Airport (TPE)', category: Category.TRANSPORT, note: '搭乘長榮航空 BR10 前往溫哥華 \n Fly to Vancouver via EVA Air BR10' },
    { id: '18-2', time: '18:35', location: '溫哥華國際機場 Vancouver Int. Airport (YVR)', category: Category.TRANSPORT, note: '抵達並辦理民宿 Check-in \n Arrival and Airbnb Check-in' }
  ],
  '2024-02-19': [
    { id: '19-1', time: '13:00', location: '煤氣鎮 蒸汽鐘 Gastown Steam Clock', category: Category.SCENERY, note: '蒸汽鐘每15分鐘鳴笛 \n Steam clock whistles every 15 mins' },
    { id: '19-2', time: '14:30', location: '卡皮拉諾吊橋公園 Capilano Suspension Bridge', category: Category.SCENERY, note: '搭乘免費接駁車前往 \n Take the free shuttle bus' },
    { id: '19-3', time: '19:30', location: '加拿大廣場 Canada Place', category: Category.SCENERY, note: '欣賞夜景回民宿 \n Enjoy the night view' }
  ],
  '2024-02-20': [
    { id: '20-1', time: '07:00', location: '出門 (Lyft or 捷運)', category: Category.TRANSPORT, note: '預估車費 $40-50' },
    { id: '20-2', time: '09:00', location: 'BC Ferries 渡輪 (Tsawwassen to Victoria)', category: Category.TRANSPORT },
    { id: '20-3', time: '12:30', location: '維多利亞唐人街 & 番攤巷', category: Category.SCENERY },
    { id: '20-4', time: '16:00', location: '維多利亞漁人碼頭', category: Category.FOOD, note: '推薦炸魚薯條' }
  ],
  '2024-02-24': [
    { id: '24-1', time: '15:45', location: '溫哥華機場 (國內線)', category: Category.TRANSPORT, note: '飛往黃刀鎮 (YZF)' },
    { id: '24-3', time: '22:00', location: '追極光之旅 Yellowknife Aurora Hunting', category: Category.SCENERY }
  ]
};

const ScheduleView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('2024-02-18');
  const [scheduleData, setScheduleData] = useState<Record<string, ScheduleItem[]>>(() => {
    const saved = localStorage.getItem('aurora_trip_schedule');
    return saved ? JSON.parse(saved) : initialScheduleData;
  });
  
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<Category>(Category.SCENERY);
  const [note, setNote] = useState('');

  const sortedDates = Object.keys(weatherDataMap).sort();
  const currentItems = (scheduleData[selectedDate] || []);
  const isYellowknife = ['2024-02-24', '2024-02-25', '2024-02-26', '2024-02-27'].includes(selectedDate);

  useEffect(() => {
    localStorage.setItem('aurora_trip_schedule', JSON.stringify(scheduleData));
  }, [scheduleData]);

  useEffect(() => {
    if (isYellowknife) {
      const fetchPrediction = async () => {
        setLoading(true);
        const res = await getAuroraPrediction(selectedDate, 'Yellowknife');
        setPrediction(res);
        setLoading(false);
      };
      fetchPrediction();
    } else {
      setPrediction(null);
    }
  }, [selectedDate, isYellowknife]);

  const resetForm = () => {
    setTime('');
    setLocation('');
    setCategory(Category.SCENERY);
    setNote('');
    setEditingItem(null);
    setIsFormOpen(false);
  };

  // Added openEditForm to fix the error in ScheduleView.tsx
  const openEditForm = (item: ScheduleItem) => {
    setEditingItem(item);
    setTime(item.time);
    setLocation(item.location);
    setCategory(item.category);
    setNote(item.note || '');
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!time || !location) return;

    const newItem: ScheduleItem = {
      id: editingItem ? editingItem.id : Math.random().toString(36).substr(2, 9),
      time,
      location,
      category,
      note
    };

    setScheduleData(prev => {
      const updated = { ...prev };
      if (!updated[selectedDate]) updated[selectedDate] = [];
      if (editingItem) {
        updated[selectedDate] = updated[selectedDate].map(item => item.id === editingItem.id ? newItem : item);
      } else {
        updated[selectedDate] = [...updated[selectedDate], newItem];
      }
      return updated;
    });
    resetForm();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation(); // 防止觸發父層點擊
    if (window.confirm('確定要刪除此行程嗎？')) {
      setScheduleData(prev => ({
        ...prev,
        [selectedDate]: (prev[selectedDate] || []).filter(item => item.id !== id)
      }));
    }
  };

  const moveItem = (e: React.MouseEvent, index: number, direction: 'up' | 'down') => {
    e.stopPropagation();
    const newItems = [...currentItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setScheduleData(prev => ({ ...prev, [selectedDate]: newItems }));
  };

  const shiftDay = (direction: 'left' | 'right') => {
    const currentIndex = sortedDates.indexOf(selectedDate);
    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sortedDates.length) return;
    
    const targetDate = sortedDates[targetIndex];
    const currentDayContent = scheduleData[selectedDate] || [];
    const targetDayContent = scheduleData[targetDate] || [];
    
    setScheduleData(prev => ({
      ...prev,
      [selectedDate]: targetDayContent,
      [targetDate]: currentDayContent
    }));
    setSelectedDate(targetDate);
  };

  const handleOpenMap = (e: React.MouseEvent, loc: string) => {
    e.stopPropagation();
    const query = loc.includes('(') ? loc.split('(')[0] : loc;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  };

  const getCategoryTheme = (cat: Category) => {
    switch(cat) {
      case Category.SCENERY: return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case Category.FOOD: return 'bg-orange-50 text-orange-800 border-orange-200';
      case Category.TRANSPORT: return 'bg-blue-50 text-blue-800 border-blue-200';
      case Category.STAY: return 'bg-purple-50 text-purple-800 border-purple-200';
    }
  };

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-4 px-1">
        <SectionTitle title="行程規劃" icon="fa-solid fa-calendar-check" />
        <div className="flex gap-2">
          <button onClick={() => shiftDay('left')} disabled={sortedDates.indexOf(selectedDate) === 0} className="w-9 h-9 rounded-full bg-white border border-[#D5DBCB] text-[#34495E] flex items-center justify-center disabled:opacity-30 active:scale-90 transition-all soft-shadow">
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <button onClick={() => shiftDay('right')} disabled={sortedDates.indexOf(selectedDate) === sortedDates.length - 1} className="w-9 h-9 rounded-full bg-white border border-[#D5DBCB] text-[#34495E] flex items-center justify-center disabled:opacity-30 active:scale-90 transition-all soft-shadow">
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-3 mb-6 py-2 px-1">
        {sortedDates.map((date, idx) => {
          const isSelected = selectedDate === date;
          const weather = weatherDataMap[date];
          return (
            <button key={date} onClick={() => setSelectedDate(date)} className={`flex-shrink-0 w-16 h-24 rounded-3xl flex flex-col items-center justify-center transition-all ${isSelected ? 'bg-[#2D8A61] text-white shadow-lg scale-105' : 'bg-white text-gray-500 border border-[#E0E5D5]'}`}>
              <span className={`text-[10px] ${isSelected ? 'opacity-90' : 'opacity-60'} mb-1 font-bold`}>{date.split('-')[1]}/{date.split('-')[2]}</span>
              <span className="text-lg font-black">D{idx + 1}</span>
              {weather && (
                <div className="mt-2 flex flex-col items-center">
                  <i className={`fa-solid ${weather.condition} text-[10px]`}></i>
                  <span className="text-[9px] font-bold mt-0.5">{weather.temp}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isYellowknife && prediction && (
        <Card className="mb-6 bg-gradient-to-br from-[#1a2a6c] to-[#b21f1f] text-white border-0 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] opacity-80 uppercase tracking-widest font-black">Aurora Forecast / 極光預測</p>
              <h3 className="text-2xl font-black mt-1">機率 {prediction.chance}%</h3>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black">KP Index: {prediction.kpIndex}</div>
          </div>
          <p className="mt-3 text-sm italic opacity-90 leading-relaxed font-medium">"{prediction.description}"</p>
        </Card>
      )}

      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2">
           <i className="fa-solid fa-clock-rotate-left text-[#2D8A61] text-xl"></i>
           <h2 className="text-xl font-black text-[#2C3E50]">{selectedDate.split('-')[1]}月{selectedDate.split('-')[2]}日行程</h2>
        </div>
        <button onClick={() => setIsFormOpen(true)} className="w-11 h-11 rounded-full bg-[#2D8A61] text-white flex items-center justify-center soft-shadow active:scale-90 shadow-md">
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <div className="relative ml-4 pl-8 border-l-2 border-dashed border-[#D5DBCB] space-y-6">
        {currentItems.length > 0 ? currentItems.map((item, index) => (
          <div key={item.id} className="relative group">
            <div className="absolute -left-[41px] top-4 w-4 h-4 rounded-full bg-[#2D8A61] border-4 border-[#F7F4EB] z-10"></div>
            <Card className="p-5 border-0 bg-white relative shadow-md transition-all active:bg-gray-50" onClick={() => openEditForm(item)}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 pr-4">
                  <span className="text-[10px] font-black text-[#2D8A61] uppercase tracking-widest">{item.time}</span>
                  <h4 className="text-lg font-black text-[#2C3E50] leading-snug mt-1">{item.location}</h4>
                </div>
                
                <div className="flex flex-col gap-1 mr-2">
                   <button onClick={(e) => moveItem(e, index, 'up')} disabled={index === 0} className="w-6 h-6 rounded-lg bg-gray-50 text-[#34495E] flex items-center justify-center text-[10px] disabled:opacity-20 active:scale-90 border border-gray-100">
                     <i className="fa-solid fa-chevron-up"></i>
                   </button>
                   <button onClick={(e) => moveItem(e, index, 'down')} disabled={index === currentItems.length - 1} className="w-6 h-6 rounded-lg bg-gray-50 text-[#34495E] flex items-center justify-center text-[10px] disabled:opacity-20 active:scale-90 border border-gray-100">
                     <i className="fa-solid fa-chevron-down"></i>
                   </button>
                </div>

                <div className={`flex-shrink-0 flex flex-col items-center px-3 py-1.5 rounded-2xl border ${getCategoryTheme(item.category)}`}>
                  <span className="text-[10px] font-black leading-none">{categoryLang[item.category].zh}</span>
                  <span className="text-[8px] font-bold uppercase mt-0.5 opacity-60 leading-none">{categoryLang[item.category].en}</span>
                </div>
              </div>

              {item.note && (
                <div className="mt-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/80">
                  <p className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-wrap font-bold italic">
                    <i className="fa-solid fa-quote-left mr-2 opacity-30 text-[#2D8A61]"></i>{item.note}
                  </p>
                </div>
              )}

              <div className="flex gap-2 mt-5">
                <button onClick={(e) => handleOpenMap(e, item.location)} className="w-14 h-11 rounded-2xl bg-white border border-[#D5DBCB] text-[#34495E] hover:text-[#2D8A61] flex flex-col items-center justify-center font-bold">
                  <i className="fa-solid fa-location-arrow text-sm"></i>
                  <span className="text-[7px] font-black uppercase mt-0.5">Map</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); openEditForm(item); }} className="flex-1 h-11 rounded-2xl bg-white border border-[#D5DBCB] text-[#34495E] text-[10px] font-black uppercase tracking-widest hover:text-[#2D8A61] flex items-center justify-center gap-2">
                  <i className="fa-solid fa-pen text-[10px]"></i> 修改 Edit
                </button>
                <button type="button" onClick={(e) => handleDelete(e, item.id)} className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center hover:bg-rose-100 transition-colors shadow-sm active:scale-90">
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </Card>
          </div>
        )) : (
          <div className="text-center py-12 opacity-30">
            <i className="fa-solid fa-moon text-5xl mb-3 text-[#2C3E50]"></i>
            <p className="font-black text-sm uppercase tracking-widest text-[#2C3E50]">No Itinerary Planned<br/>今日無排定行程</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#2C3E50]">{editingItem ? '修改行程' : '新增行程'}</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Time 時間</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#2D8A61] outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Category 類別</label>
                  <select value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#2D8A61] outline-none">
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Location 地點</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="例如：溫哥華機場" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#2D8A61] outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Note 備註</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="輸入行程細節..." className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#2D8A61] outline-none h-24 resize-none" />
              </div>
              <button onClick={handleSave} className="w-full bg-[#2D8A61] text-white py-4 rounded-3xl font-black uppercase tracking-widest active:scale-95 transition-all mt-4 shadow-lg hover:brightness-110">
                儲存行程 Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;