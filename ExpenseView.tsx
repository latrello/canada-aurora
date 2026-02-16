
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

  const stats = expenses.reduce((acc, curr) => {
    const amt = curr.currency === 'CAD' ? curr.amount * rate : curr.amount;
    acc[curr.category] = (acc[curr.category] || 0) + amt;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="pb-24 space-y-6">
      <Card className="bg-white border-b-4 border-[#88D8B0] relative overflow-hidden">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Total Expenditure</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#88D8B0]">$</span>
          <h2 className="text-5xl font-black text-[#88D8B0] tracking-tighter">
            {Math.round(totalTwd).toLocaleString()}
          </h2>
          <span className="text-sm font-black text-[#88D8B0]/40 uppercase">TWD</span>
        </div>
      </Card>
      <div>
        <SectionTitle title="Expense Details / 明細" icon="fa-solid fa-receipt" />
        <div className="space-y-4">
          {expenses.map(exp => (
            <Card key={exp.id} className="flex justify-between items-center py-4 px-5">
              <div>
                <h5 className="text-sm font-black text-[#5D6D7E]">{exp.category}</h5>
                <p className="text-[10px] text-gray-400">{exp.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-[#5D6D7E]">${exp.amount} {exp.currency}</p>
                <p className="text-[10px] text-[#88D8B0]">≈ ${Math.round(exp.currency === 'CAD' ? exp.amount * rate : exp.amount)} TWD</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="fixed bottom-24 right-6 z-40">
        <button onClick={() => setIsFormOpen(true)} className="w-14 h-14 rounded-full bg-[#88D8B0] text-white shadow-xl flex items-center justify-center text-xl">
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8">
            <h3 className="text-xl font-black mb-6">新增支出</h3>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xl font-black mb-4" placeholder="0" />
            <button onClick={handleSave} className="w-full bg-[#88D8B0] text-white py-4 rounded-3xl font-black">儲存 Save</button>
            <button onClick={resetForm} className="w-full text-gray-400 py-4 font-bold">取消</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseView;
