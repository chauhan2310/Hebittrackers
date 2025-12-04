// Habit Tracker - Single File React App (App.jsx)
// Usage: create a Vite + React project or Create React App, install Tailwind CSS, recharts, and lucide-react if desired.
// Packages required: react, react-dom, recharts
// Tailwind is used for styling; if you don't want Tailwind, convert classes to your CSS.

// Quick setup (Vite):
// npm create vite@latest habit-tracker --template react
// cd habit-tracker
// npm install
// npm install recharts
// add Tailwind per their docs, or remove Tailwind classes
// Replace src/App.jsx with this file, then run `npm run dev` (Vite) or `npm start` (CRA)

import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Utility helpers
const today = new Date();
const getMonthKey = (date = new Date()) => `${date.getFullYear()}-${date.getMonth() + 1}`;
const formatDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const daysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

// Local storage keys
const LS_KEY = 'habit-tracker-v1';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed load', e);
    return null;
  }
}
function saveToStorage(obj) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(obj));
  } catch (e) {
    console.warn('Failed save', e);
  }
}

// Default sample habit
const SAMPLE = {
  habits: [
    { id: 'h1', name: 'Drink 2L water', color: '#60A5FA' },
    { id: 'h2', name: 'Walk 20 minutes', color: '#34D399' },
  ],
  // records: {"2025-12-01":{"h1": true, "h2": false}, ...}
  records: {}
};

export default function App() {
  const [state, setState] = useState(() => loadFromStorage() || SAMPLE);
  const [selectedMonth, setSelectedMonth] = useState(getMonthKey(today));
  const [newHabitName, setNewHabitName] = useState('');
  const [filterText, setFilterText] = useState('');

  useEffect(() => saveToStorage(state), [state]);

  // derived data
  const [year, month] = selectedMonth.split('-').map(Number);
  const monthDate = useMemo(() => new Date(year, month - 1, 1), [year, month]);
  const dim = daysInMonth(monthDate);
  const dayKeys = Array.from({ length: dim }, (_, i) => formatDateKey(new Date(year, month - 1, i + 1)));

  const habits = state.habits.filter(h => h.name.toLowerCase().includes(filterText.toLowerCase()));

  const toggleRecord = (dateKey, habitId) => {
    setState(prev => {
      const records = { ...(prev.records || {}) };
      records[dateKey] = { ...(records[dateKey] || {}) };
      records[dateKey][habitId] = !records[dateKey][habitId];
      return { ...prev, records };
    });
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    const id = `h${Date.now()}`;
    const color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
    setState(prev => ({ ...prev, habits: [...prev.habits, { id, name: newHabitName.trim(), color }] }));
    setNewHabitName('');
  };

  const removeHabit = (id) => {
    if (!confirm('Delete this habit?')) return;
    setState(prev => {
      const habits = prev.habits.filter(h => h.id !== id);
      const records = {};
      for (const [date, rec] of Object.entries(prev.records || {})) {
        const filtered = { ...rec };
        delete filtered[id];
        records[date] = filtered;
      }
      return { ...prev, habits, records };
    });
  };

  const computeProgressForHabit = (habitId) => {
    let completed = 0, total = 0;
    for (const key of dayKeys) {
      total += 1;
      if (state.records[key] && state.records[key][habitId]) completed += 1;
    }
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const monthSummary = habits.map(h => ({ name: h.name, percent: computeProgressForHabit(h.id) }));

  const exportCSV = () => {
    const header = ['date', ...state.habits.map(h => h.name)];
    const rows = dayKeys.map(d => {
      const rec = state.records[d] || {};
      return [d, ...state.habits.map(h => (rec[h.id] ? '1' : '0'))];
    });
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habits-${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const prevMonth = () => {
    const d = new Date(year, month - 2, 1);
    setSelectedMonth(getMonthKey(d));
  };
  const nextMonth = () => {
    const d = new Date(year, month, 1);
    setSelectedMonth(getMonthKey(d));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Habit Tracker</h1>
          <div className="text-sm text-gray-600">Month: <strong>{monthDate.toLocaleString(undefined,{ month: 'long', year: 'numeric' })}</strong></div>
        </header>

        <section className="mb-4 flex gap-2 items-center">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={prevMonth}>◀</button>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={nextMonth}>▶</button>
          <input placeholder="Filter habits..." value={filterText} onChange={e=>setFilterText(e.target.value)} className="ml-4 p-2 border rounded flex-1" />
          <button onClick={exportCSV} className="px-4 py-2 bg-indigo-600 text-white rounded">Export CSV</button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 bg-slate-50 p-3 rounded">
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full text-sm">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Habit</th>
                    {dayKeys.map(d => <th key={d} className="border p-1 text-xs">{new Date(d).getDate()}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {habits.map(h => (
                    <tr key={h.id}>
                      <td className="border p-2 align-top">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{h.name}</div>
                            <div className="text-xs text-gray-500">{computeProgressForHabit(h.id)}% this month</div>
                          </div>
                          <div className="ml-2 flex gap-1">
                            <button title="Delete" onClick={()=>removeHabit(h.id)} className="text-red-500">🗑</button>
                          </div>
                        </div>
                      </td>
                      {dayKeys.map(dk => (
                        <td key={dk} className="border p-1 text-center">
                          <input type="checkbox" checked={!!(state.records[dk] && state.records[dk][h.id])} onChange={()=>toggleRecord(dk, h.id)} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold mb-2">Add Habit</h3>
            <div className="flex gap-2">
              <input value={newHabitName} onChange={e=>setNewHabitName(e.target.value)} placeholder="New habit name" className="flex-1 p-2 border rounded" />
              <button onClick={addHabit} className="px-3 py-2 bg-green-500 text-white rounded">Add</button>
            </div>

            <hr className="my-3" />

            <h4 className="font-semibold">Monthly Summary</h4>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthSummary} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="percent" fill="#60A5FA" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              Total habits: <strong>{state.habits.length}</strong>
            </div>
          </aside>
        </section>

        <footer className="text-xs text-gray-500">
          <div>Data stored locally in your browser (localStorage). Use Export to save a CSV backup.</div>
          <div className="mt-2">Want Google Sheets sync, authentication, or cloud backup? I can add a Node/Express + Firebase or Supabase backend for login & sync.</div>
        </footer>
      </div>
    </div>
  );
}