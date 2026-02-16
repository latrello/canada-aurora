
import React, { useState } from 'react';
import { Card, SectionTitle } from './UIProvider';

interface ExpenseItem {
  id: string;
  amount: number;
  currency: 'CAD' | 'TWD';
  category: string;
  enCategory: string;
  payer: string;
  date: string;
  note?: string;
}

const ExpenseView: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: '1', amount: 120, currency: 'CAD', category: '美食', enCategory: 'Food', payer: 'Kevin', date: '2024-03-14', note: 'Buffalo Steak' },
    { id: '2', amount: 45, currency: 'CAD', category: '交通', enCategory: 'Transport', payer: 'Me', date: '2024-03-14' },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'CAD' | 'TWD'>('CAD');
  const [category, setCategory] = useState('美食');
  const [payer, setPayer] = useState('Me');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const rate = 23.85;
  // Use explicit types for reduce and number operations
  const totalTwd = expenses.reduce((acc: number, curr: ExpenseItem) => acc + (curr.currency === 'CAD' ? Number(curr.amount) * rate : Number(curr.amount)), 0);
  const totalCad = totalTwd / rate;

  const resetForm = () => {
    setAmount('');
    setCurrency('CAD');
    setCategory('美食');
    setPayer('Me');
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
    setEditingItem(null);
    setIsFormOpen(false);
  };

  const handleSave = () => {
    if (!amount) return;
    const newItem: ExpenseItem = {
      id: editingItem ? editingItem.id : Math.random().toString(36).substr(2, 9),
      amount: parseFloat(amount),
      currency,
      category,
      enCategory: category === '美食' ? 'Food' : category === '交通' ? 'Transport' : 'Stay',
      payer,
      date,
      note
    };

    if (editingItem) {
      setExpenses(expenses.map(exp => exp.id === editingItem.id ? newItem : exp));
    } else {
      setExpenses([newItem, ...expenses]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('確定要刪除此筆支出嗎？')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  const openEdit = (exp: ExpenseItem) => {
    setEditingItem(exp);
    setAmount(exp.amount.toString());
    setCurrency(exp.currency);
    setCategory(exp.category);
    setPayer(exp.payer);
    setDate(exp.date);
    setNote(exp.note || '');
    setIsFormOpen(true);
  };

  // Simple category stats - ensuring amt calculation uses numbers
  const stats = expenses.reduce((acc, curr) => {
    const amt = curr.currency === 'CAD' ? Number(curr.amount) * rate : Number(curr.amount);
    acc[curr.category] = (acc[curr.category] || 0) + amt;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="pb-24 space-y-6">
      <Card className="bg-white border-b-4 border-[#2D8A61] relative overflow-hidden shadow-md">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Total Expenditure</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#2D8A61]">$</span>
          <h2 className="text-5xl font-black text-[#2D8A61] tracking-tighter">
            {Math.round(totalTwd).toLocaleString()}
          </h2>
          <span className="text-sm font-black text-[#2D8A61]/60 uppercase">TWD</span>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-500 font-bold">
           <span>Approx. ${totalCad.toFixed(2)} CAD</span>
           <span>Rate: 1 CAD = {rate} TWD</span>
        </div>
      </Card>

      <div className="flex justify-between items-center px-2">
        <SectionTitle title="Expense Details" icon="fa-solid fa-receipt" />
        <button 
          onClick={() => setIsChartOpen(!isChartOpen)}
          className={`text-[11px] font-black px-5 py-2.5 rounded-2xl border transition-all shadow-sm ${isChartOpen ? 'bg-[#2D8A61] text-white border-[#2D8A61]' : 'text-[#2D8A61] border-[#2D8A61]/30 hover:bg-[#2D8A61]/5'}`}
        >
          {isChartOpen ? 'Close Charts' : 'Charts / 分析'}
        </button>
      </div>

      {isChartOpen && (
        <Card className="animate-in zoom-in duration-300 border border-[#2D8A61]/10">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Category Analysis</h4>
          <div className="space-y-4">
            {/* Cast Object.entries to ensure 'val' is treated as a number during arithmetic operations */}
            {(Object.entries(stats) as [string, number][]).map(([cat, val]) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-[11px] font-black">
                  <span className="text-[#2C3E50]">{cat}</span>
                  <span className="text-gray-500 font-bold">{totalTwd > 0 ? Math.round((val / totalTwd) * 100) : 0}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2D8A61] shadow-inner" style={{ width: `${totalTwd > 0 ? (val / totalTwd) * 100 : 0}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {expenses.map(exp => (
          <Card key={exp.id} className="flex justify-between items-center py-5 px-5 active:scale-[0.98] transition-all border border-transparent hover:border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
               <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${exp.category === '美食' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                 <i className={`fa-solid ${exp.category === '美食' ? 'fa-bowl-food' : 'fa-van-shuttle'} text-lg`}></i>
               </div>
               <div>
                 <h5 className="text-sm font-black text-[#2C3E50]">{exp.category}</h5>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{exp.date} • {exp.payer}</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-black text-[#2C3E50]">${exp.amount} {exp.currency}</p>
                {/* Explicit Number conversion to avoid arithmetic errors */}
                <p className="text-[10px] font-bold text-[#2D8A61]">≈ ${Math.round(exp.currency === 'CAD' ? Number(exp.amount) * rate : Number(exp.amount))} TWD</p>
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => openEdit(exp)} className="text-gray-400 hover:text-[#2D8A61] transition-colors"><i className="fa-solid fa-pen text-[10px]"></i></button>
                <button onClick={() => handleDelete(exp.id)} className="text-gray-400 hover:text-rose-600 transition-colors"><i className="fa-solid fa-trash text-[10px]"></i></button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-32 right-6 z-40">
        <button onClick={() => setIsFormOpen(true)} className="w-16 h-16 rounded-full bg-[#2D8A61] text-white shadow-2xl flex items-center justify-center text-2xl active:scale-90 transition-all">
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
            <h3 className="text-xl font-black text-[#2C3E50] mb-6">{editingItem ? '修改支出' : '新增支出'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Amount 金額</label>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xl font-black text-[#2C3E50] focus:ring-2 focus:ring-[#2D8A61] outline-none" placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Currency 幣別</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value as 'CAD' | 'TWD')} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-[#2D8A61] outline-none">
                    <option value="CAD">CAD</option>
                    <option value="TWD">TWD</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Category 分類</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-[#2D8A61] outline-none">
                    <option value="美食">美食</option>
                    <option value="交通">交通</option>
                    <option value="住宿">住宿</option>
                    <option value="購物">購物</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Payer 付款人</label>
                  <input type="text" value={payer} onChange={e => setPayer(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-[#2D8A61] outline-none" />
                </div>
              </div>
              <button onClick={handleSave} className="w-full bg-[#2D8A61] text-white py-4 rounded-3xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all mt-4">
                儲存紀錄 Save
              </button>
              <button onClick={resetForm} className="w-full text-gray-500 py-2 font-black text-xs uppercase tracking-widest">取消 Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseView;
