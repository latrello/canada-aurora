
import React, { useState } from 'react';
import { Card, SectionTitle } from '../components/UIProvider';

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

  // Form states
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'CAD' | 'TWD'>('CAD');
  const [category, setCategory] = useState('美食');
  const [payer, setPayer] = useState('Me');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const rate = 23.85;
  const totalTwd = expenses.reduce((acc, curr) => acc + (curr.currency === 'CAD' ? curr.amount * rate : curr.amount), 0);
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

  // Simple category stats
  const stats = expenses.reduce((acc, curr) => {
    const amt = curr.currency === 'CAD' ? curr.amount * rate : curr.amount;
    acc[curr.category] = (acc[curr.category] || 0) + amt;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="pb-24 space-y-6">
      {/* 總支出儀表板 */}
      <Card className="bg-white border-b-4 border-[#88D8B0] relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Total Expenditure</p>
            <h4 className="text-sm font-black text-[#5D6D7E]">總支出總額</h4>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#88D8B0]/10 flex items-center justify-center text-[#88D8B0]">
            <i className="fa-solid fa-wallet text-lg"></i>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#88D8B0]">$</span>
          <h2 className="text-5xl font-black text-[#88D8B0] tracking-tighter">
            {Math.round(totalTwd).toLocaleString()}
          </h2>
          <span className="text-sm font-black text-[#88D8B0]/40 uppercase">TWD</span>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-tighter">Approx.</span>
            <p className="text-sm font-black text-[#5D6D7E]">
              ${totalCad.toFixed(2)} <span className="text-[10px] opacity-60">CAD</span>
            </p>
          </div>
          <p className="text-[10px] font-bold text-gray-300">Rate: 1 CAD = {rate} TWD</p>
        </div>
      </Card>

      {/* 圖表/統計 Toggle */}
      {isChartOpen && (
        <Card className="bg-white border border-[#88D8B0]/20 animate-in zoom-in duration-300">
          <SectionTitle title="Category Analysis / 支出佔比" icon="fa-solid fa-chart-pie" />
          <div className="space-y-4">
            {Object.entries(stats).map(([cat, val]) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
                  <span>{cat}</span>
                  <span>{Math.round((val/totalTwd)*100)}% (${Math.round(val).toLocaleString()} TWD)</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#88D8B0] transition-all duration-1000" 
                    style={{ width: `${(val / totalTwd) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 支出明細 */}
      <div>
        <div className="flex justify-between items-center mb-4 px-2">
          <SectionTitle title="Expense Details / 明細" icon="fa-solid fa-receipt" />
          <button 
            onClick={() => setIsChartOpen(!isChartOpen)}
            className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all uppercase tracking-widest ${isChartOpen ? 'bg-[#88D8B0] text-white' : 'text-[#88D8B0] border border-[#88D8B0]/30'}`}
          >
            {isChartOpen ? 'Close Charts / 關閉圖表' : 'Charts / 查看分析'}
          </button>
        </div>
        <div className="space-y-4">
          {expenses.map(exp => (
            <Card key={exp.id} className="active:scale-[0.98] transition-all flex justify-between items-center py-4 px-5 border-0 bg-white relative group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${exp.category === '美食' ? 'bg-orange-50 text-orange-400' : exp.category === '交通' ? 'bg-blue-50 text-blue-400' : 'bg-purple-50 text-purple-400'}`}>
                  <i className={`fa-solid ${exp.category === '美食' ? 'fa-bowl-food' : exp.category === '交通' ? 'fa-van-shuttle' : 'fa-hotel'} text-lg`}></i>
                </div>
                <div>
                  <h5 className="text-sm font-black text-[#5D6D7E] leading-tight">
                    {exp.category} <span className="text-[10px] text-gray-300 ml-1 font-bold">/ {exp.enCategory}</span>
                  </h5>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                    {exp.payer} • {exp.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-black text-[#5D6D7E] leading-tight">${exp.amount} {exp.currency}</p>
                  <p className="text-[10px] font-bold text-[#88D8B0] mt-1 tracking-tighter">≈ ${Math.round(exp.currency === 'CAD' ? exp.amount * rate : exp.amount)} TWD</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => openEdit(exp)} className="text-gray-300 hover:text-[#88D8B0] transition-colors"><i className="fa-solid fa-pen text-[10px]"></i></button>
                  <button onClick={() => handleDelete(exp.id)} className="text-gray-300 hover:text-rose-400 transition-colors"><i className="fa-solid fa-trash text-[10px]"></i></button>
                </div>
              </div>
            </Card>
          ))}
          {expenses.length === 0 && (
            <div className="text-center py-10 opacity-20"><i className="fa-solid fa-receipt text-5xl mb-2"></i><p>尚無記帳紀錄</p></div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-14 h-14 rounded-full bg-[#88D8B0] text-white shadow-xl flex items-center justify-center text-xl active:scale-90 transition-all hover:rotate-90"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {/* Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#5D6D7E]">{editingItem ? '修改支出' : '新增支出'}</h3>
              <button onClick={resetForm} className="text-gray-400"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Amount 金額</label>
                  <input type="number" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xl font-black text-[#5D6D7E] focus:ring-2 focus:ring-[#88D8B0] outline-none" placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Currency 幣別</label>
                  <div className="flex p-1 bg-gray-50 rounded-2xl h-[58px]">
                    <button onClick={() => setCurrency('CAD')} className={`flex-1 rounded-xl font-black text-xs transition-all ${currency === 'CAD' ? 'bg-white shadow-sm text-[#88D8B0]' : 'text-gray-400'}`}>CAD</button>
                    <button onClick={() => setCurrency('TWD')} className={`flex-1 rounded-xl font-black text-xs transition-all ${currency === 'TWD' ? 'bg-white shadow-sm text-[#88D8B0]' : 'text-gray-400'}`}>TWD</button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Category 分類</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#88D8B0] outline-none">
                    <option value="美食">美食 Food</option>
                    <option value="交通">交通 Transport</option>
                    <option value="住宿">住宿 Stay</option>
                    <option value="購物">購物 Shopping</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Payer 付款人</label>
                  <input type="text" value={payer} onChange={e => setPayer(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#88D8B0] outline-none" />
                </div>
              </div>
              <button onClick={handleSave} className="w-full bg-[#88D8B0] text-white py-4 rounded-3xl font-black uppercase tracking-widest soft-shadow active:scale-95 transition-all mt-4">
                儲存紀錄 Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseView;
