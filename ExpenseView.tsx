
import React, { useState, useEffect } from 'react';
import { Card, SectionTitle } from './UIProvider';

interface ExpenseItem {
  id: string;
  amount: number;
  currency: 'CAD' | 'TWD';
  category: string;
  enCategory: string;
  payer: string;
  date: string;
  itemName: string; // 消費項目名稱 (例如：牛排)
  note?: string;    // 明細備註 (例如：這家店不收小費)
}

const ExpenseView: React.FC = () => {
  const rate = 23.85;

  // 使用 Lazy Initialization 從 localStorage 讀取
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem('aurora_trip_expenses');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Storage Error:", e);
    }
    return [
      { id: '1', amount: 120, currency: 'CAD', category: '美食', enCategory: 'Food', payer: 'Kevin', date: '2024-03-14', itemName: 'Buffalo Steak', note: '推薦五分熟，不收服務費' },
      { id: '2', amount: 45, currency: 'CAD', category: '交通', enCategory: 'Transport', payer: 'Me', date: '2024-03-14', itemName: 'Lyft 機場接送', note: '從市區到 YVR 國內線' },
    ];
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);

  // 表單狀態
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'CAD' | 'TWD'>('CAD');
  const [category, setCategory] = useState('美食');
  const [payer, setPayer] = useState('Me');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [itemName, setItemName] = useState('');
  const [note, setNote] = useState('');

  // 狀態同步至 localStorage
  useEffect(() => {
    localStorage.setItem('aurora_trip_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const totalTwd = expenses.reduce((acc, curr) => acc + (curr.currency === 'CAD' ? Number(curr.amount) * rate : Number(curr.amount)), 0);
  const totalCad = totalTwd / rate;

  const resetForm = () => {
    setAmount('');
    setCurrency('CAD');
    setCategory('美食');
    setPayer('Me');
    setDate(new Date().toISOString().split('T')[0]);
    setItemName('');
    setNote('');
    setEditingItem(null);
    setIsFormOpen(false);
  };

  const handleSave = () => {
    if (!amount || !itemName) {
      alert('請輸入金額與項目名稱');
      return;
    }
    const newItem: ExpenseItem = {
      id: editingItem ? editingItem.id : Math.random().toString(36).substring(2, 11),
      amount: parseFloat(amount),
      currency,
      category,
      enCategory: category === '美食' ? 'Food' : category === '交通' ? 'Transport' : category === '住宿' ? 'Stay' : 'Shopping',
      payer,
      date,
      itemName,
      note
    };

    setExpenses(prev => editingItem 
      ? prev.map(exp => exp.id === editingItem.id ? newItem : exp)
      : [newItem, ...prev]
    );
    resetForm();
  };

  // 核心修復：阻斷事件冒泡並確保執行過濾
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation(); // 關鍵：防止點擊觸發父層卡片的 onClick (編輯視窗)
    
    if (window.confirm('確定要刪除這筆支出嗎？此動作無法還原。')) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    }
  };

  const openEdit = (exp: ExpenseItem) => {
    setEditingItem(exp);
    setAmount(exp.amount.toString());
    setCurrency(exp.currency);
    setCategory(exp.category);
    setPayer(exp.payer);
    setDate(exp.date);
    setItemName(exp.itemName);
    setNote(exp.note || '');
    setIsFormOpen(true);
  };

  const stats = expenses.reduce((acc, curr) => {
    const amt = curr.currency === 'CAD' ? Number(curr.amount) * rate : Number(curr.amount);
    acc[curr.category] = (acc[curr.category] || 0) + amt;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="pb-24 space-y-6">
      <Card className="bg-white border-b-4 border-[#2D8A61] shadow-md overflow-hidden relative">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Trip Expenses / 累計支出</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#2D8A61]">$</span>
          <h2 className="text-5xl font-black text-[#2D8A61] tracking-tighter">
            {Math.round(totalTwd).toLocaleString()}
          </h2>
          <span className="text-sm font-black text-[#2D8A61]/60 uppercase ml-1">TWD</span>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-500 font-bold">
           <span>CAD ${totalCad.toFixed(2)}</span>
           <span className="bg-gray-50 px-3 py-1 rounded-full border border-gray-100">匯率: 23.85</span>
        </div>
      </Card>

      <div className="flex justify-between items-center px-2">
        <SectionTitle title="消費清單" icon="fa-solid fa-receipt" />
        <button 
          onClick={() => setIsChartOpen(!isChartOpen)}
          className={`text-[11px] font-black px-5 py-2.5 rounded-2xl border transition-all ${isChartOpen ? 'bg-[#2D8A61] text-white border-[#2D8A61]' : 'text-[#2D8A61] border-[#2D8A61]/30 bg-white hover:bg-[#2D8A61]/5'}`}
        >
          {isChartOpen ? '隱藏分析' : '查看佔比'}
        </button>
      </div>

      {isChartOpen && (
        <Card className="animate-in zoom-in duration-300 border border-[#2D8A61]/10">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">支出佔比分析</h4>
          <div className="space-y-4">
            {(Object.entries(stats) as [string, number][]).map(([cat, val]) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-[11px] font-black text-[#2C3E50]">
                  <span>{cat}</span>
                  <span>{totalTwd > 0 ? Math.round((val / totalTwd) * 100) : 0}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2D8A61] shadow-inner transition-all duration-700" style={{ width: `${totalTwd > 0 ? (val / totalTwd) * 100 : 0}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {expenses.map(exp => (
          <Card key={exp.id} className="flex justify-between items-center py-5 px-5 border border-transparent hover:border-gray-100 shadow-sm transition-all group active:bg-gray-50/50" onClick={() => openEdit(exp)}>
            <div className="flex items-center gap-4 flex-1 min-w-0">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${exp.category === '美食' ? 'bg-orange-100 text-orange-800' : exp.category === '交通' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                 <i className={`fa-solid ${exp.category === '美食' ? 'fa-bowl-food' : exp.category === '交通' ? 'fa-van-shuttle' : 'fa-tag'} text-lg`}></i>
               </div>
               <div className="min-w-0">
                 <h5 className="text-[15px] font-black text-[#2C3E50] truncate">{exp.itemName}</h5>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter truncate mt-0.5">{exp.category} • {exp.date} • {exp.payer}</p>
                 {exp.note && <p className="text-[10px] text-[#2D8A61] italic mt-1.5 truncate border-t border-gray-50 pt-1 leading-relaxed">「 {exp.note} 」</p>}
               </div>
            </div>
            
            <div className="flex items-center gap-3 ml-4">
              <div className="text-right flex-shrink-0 mr-1">
                <p className="text-[15px] font-black text-[#2C3E50]">${exp.amount} <span className="text-[10px] opacity-30 font-bold">{exp.currency}</span></p>
                <p className="text-[10px] font-bold text-[#2D8A61]">≈ ${Math.round(exp.currency === 'CAD' ? Number(exp.amount) * rate : Number(exp.amount))} TWD</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <button 
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); // 阻斷冒泡
                    openEdit(exp); 
                  }} 
                  className="w-10 h-10 rounded-xl bg-gray-100/50 flex items-center justify-center text-gray-400 hover:text-[#2D8A61] hover:bg-[#2D8A61]/10 transition-all active:scale-90"
                >
                  <i className="fa-solid fa-pen text-[10px]"></i>
                </button>
                <button 
                  type="button"
                  onClick={(e) => handleDelete(e, exp.id)} 
                  className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-100 transition-all active:scale-90 shadow-sm border border-rose-100/50"
                  title="刪除"
                >
                  <i className="fa-solid fa-trash-can text-[10px]"></i>
                </button>
              </div>
            </div>
          </Card>
        ))}
        {expenses.length === 0 && (
          <div className="text-center py-24 opacity-20">
            <i className="fa-solid fa-wallet text-6xl mb-4 text-[#2C3E50]"></i>
            <p className="font-black uppercase tracking-widest text-sm text-[#2C3E50]">目前沒有任何記帳內容</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-32 right-6 z-40">
        <button 
          onClick={() => setIsFormOpen(true)} 
          className="w-16 h-16 rounded-full bg-[#2D8A61] text-white shadow-2xl flex items-center justify-center text-2xl active:scale-95 transition-all hover:brightness-110 ring-4 ring-white"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-in slide-in-from-bottom-full duration-300 shadow-2xl overflow-y-auto max-h-[95vh] no-scrollbar">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black text-[#2C3E50]">{editingItem ? '修改支出細節' : '新增支出項目'}</h3>
               <button onClick={resetForm} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                 <i className="fa-solid fa-xmark text-lg"></i>
               </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Item 消費項目</label>
                <input 
                  type="text" 
                  value={itemName} 
                  onChange={e => setItemName(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-black text-[#2C3E50] focus:ring-2 focus:ring-[#2D8A61] focus:bg-white outline-none transition-all" 
                  placeholder="例如：晚餐、機票、伴手禮" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Amount 金額</label>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xl font-black text-[#2D8A61] focus:ring-2 focus:ring-[#2D8A61] outline-none transition-all" 
                    placeholder="0.00" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Currency 幣別</label>
                  <select 
                    value={currency} 
                    onChange={e => setCurrency(e.target.value as 'CAD' | 'TWD')} 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-black text-[#2C3E50] focus:ring-2 focus:ring-[#2D8A61] outline-none appearance-none"
                  >
                    <option value="CAD">CAD (加幣)</option>
                    <option value="TWD">TWD (台幣)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Category 分類</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-black text-[#2C3E50] outline-none focus:ring-2 focus:ring-[#2D8A61]"
                  >
                    <option value="美食">美食</option>
                    <option value="交通">交通</option>
                    <option value="住宿">住宿</option>
                    <option value="購物">購物</option>
                    <option value="門票">門票</option>
                    <option value="雜項">雜項</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Payer 付款人</label>
                  <input 
                    type="text" 
                    value={payer} 
                    onChange={e => setPayer(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-black text-[#2C3E50] focus:ring-2 focus:ring-[#2D8A61] outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Details 明細備註 (選填)</label>
                <textarea 
                  value={note} 
                  onChange={e => setNote(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#2D8A61] h-24 resize-none transition-all outline-none" 
                  placeholder="補充消費紀錄..." 
                />
              </div>

              <div className="pt-2">
                <button 
                  type="button"
                  onClick={handleSave} 
                  className="w-full bg-[#2D8A61] text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all mb-3 hover:brightness-110"
                >
                  確認儲存 Save
                </button>
                <button 
                  type="button"
                  onClick={resetForm} 
                  className="w-full text-gray-400 py-2 font-black text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
                >
                  取消變更 Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseView;
