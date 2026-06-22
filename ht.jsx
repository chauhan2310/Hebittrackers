/**
 * Habit Tracker - React Application
 * A simple, responsive habit tracking app with local storage persistence
 * 
 * Features:
 * - Add/remove habits
 * - Track daily completion with checkboxes
 * - Filter habits by name
 * - View monthly progress with charts
 * - Export data to CSV
 * - All data stored locally (localStorage)
 */

import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ============================================================================
// CONSTANTS & UTILITIES
// ============================================================================

const LS_KEY = 'habit-tracker-v1';
const today = new Date();

/**
 * Format date to YYYY-M format for month selection
 */
const getMonthKey = (date = new Date()) => 
  `${date.getFullYear()}-${date.getMonth() + 1}`;

/**
 * Format date to YYYY-MM-DD format for daily records
 */
const formatDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Get the number of days in a given month
 */
const daysInMonth = (date) => 
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

// ============================================================================
// LOCAL STORAGE FUNCTIONS
// ============================================================================

/**
 * Load habit data from localStorage
 * @returns {Object|null} Parsed habit data or null if not found
 */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to load data from storage:', error);
    return null;
  }
}

/**
 * Save habit data to localStorage
 * @param {Object} data - Habit data object to save
 */
function saveToStorage(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save data to storage:', error);
  }
}

/**
 * Generate a random hex color
 * @returns {string} Hex color code (e.g., #60A5FA)
 */
function generateRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

// ============================================================================
// DEFAULT DATA
// ============================================================================

const DEFAULT_STATE = {
  habits: [
    { id: 'h1', name: 'Drink 2L water', color: '#60A5FA' },
    { id: 'h2', name: 'Walk 20 minutes', color: '#34D399' },
  ],
  // Structure: { "2025-12-01": { "h1": true, "h2": false }, ... }
  records: {},
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function HabitTracker() {
  // State management
  const [state, setState] = useState(() => loadFromStorage() || DEFAULT_STATE);
  const [selectedMonth, setSelectedMonth] = useState(getMonthKey(today));
  const [newHabitName, setNewHabitName] = useState('');
  const [filterText, setFilterText] = useState('');

  // Persist state changes to localStorage
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  // ========================================================================
  // DERIVED DATA
  // ========================================================================

  // Parse selected month
  const [year, month] = selectedMonth.split('-').map(Number);
  const monthDate = useMemo(() => new Date(year, month - 1, 1), [year, month]);
  const daysCount = daysInMonth(monthDate);
  
  // Generate array of date keys for the current month
  const dayKeys = useMemo(() => {
    return Array.from({ length: daysCount }, (_, i) => 
      formatDateKey(new Date(year, month - 1, i + 1))
    );
  }, [year, month, daysCount]);

  // Filter habits based on search text
  const filteredHabits = useMemo(() => {
    return state.habits.filter(h =>
      h.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [state.habits, filterText]);

  // ========================================================================
  // HANDLERS
  // ========================================================================

  /**
   * Toggle habit completion for a specific date
   */
  const handleToggleRecord = (dateKey, habitId) => {
    setState(prevState => {
      const newRecords = { ...prevState.records };
      newRecords[dateKey] = { ...newRecords[dateKey] || {} };
      newRecords[dateKey][habitId] = !newRecords[dateKey][habitId];
      return { ...prevState, records: newRecords };
    });
  };

  /**
   * Add a new habit
   */
  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;

    const newHabit = {
      id: `h${Date.now()}`,
      name: newHabitName.trim(),
      color: generateRandomColor(),
    };

    setState(prevState => ({
      ...prevState,
      habits: [...prevState.habits, newHabit],
    }));

    setNewHabitName('');
  };

  /**
   * Remove a habit and all its records
   */
  const handleRemoveHabit = (habitId) => {
    if (!confirm('Delete this habit?')) return;

    setState(prevState => {
      const newHabits = prevState.habits.filter(h => h.id !== habitId);
      const newRecords = {};

      // Remove habit records from all dates
      Object.entries(prevState.records || {}).forEach(([date, record]) => {
        const filtered = { ...record };
        delete filtered[habitId];
        newRecords[date] = filtered;
      });

      return { ...prevState, habits: newHabits, records: newRecords };
    });
  };

  /**
   * Calculate completion percentage for a habit in the current month
   */
  const computeProgressForHabit = (habitId) => {
    let completed = 0;
    let total = dayKeys.length;

    dayKeys.forEach(dateKey => {
      if (state.records[dateKey]?.[habitId]) {
        completed += 1;
      }
    });

    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  /**
   * Export habit data to CSV file
   */
  const handleExportCSV = () => {
    const headers = ['date', ...state.habits.map(h => h.name)];
    const rows = dayKeys.map(dateKey => {
      const dateRecord = state.records[dateKey] || {};
      return [dateKey, ...state.habits.map(h => (dateRecord[h.id] ? '1' : '0'))];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `habits-${selectedMonth}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Navigate to previous month
   */
  const handlePreviousMonth = () => {
    const prevDate = new Date(year, month - 2, 1);
    setSelectedMonth(getMonthKey(prevDate));
  };

  /**
   * Navigate to next month
   */
  const handleNextMonth = () => {
    const nextDate = new Date(year, month, 1);
    setSelectedMonth(getMonthKey(nextDate));
  };

  /**
   * Handle Enter key in habit input
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddHabit();
    }
  };

  // ========================================================================
  // DATA FOR VISUALIZATION
  // ========================================================================

  const monthSummary = filteredHabits.map(h => ({
    name: h.name,
    percent: computeProgressForHabit(h.id),
  }));

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">📊 Habit Tracker</h1>
          <div className="text-sm text-gray-600">
            Month: <strong className="text-lg">{monthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</strong>
          </div>
        </header>

        {/* Controls */}
        <section className="mb-6 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <button
            onClick={handlePreviousMonth}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            title="Previous month"
            aria-label="Previous month"
          >
            ◀
          </button>
          <button
            onClick={handleNextMonth}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            title="Next month"
            aria-label="Next month"
          >
            ▶
          </button>
          <input
            type="text"
            placeholder="Filter habits..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Filter habits"
          />
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors font-medium"
            aria-label="Export data to CSV"
          >
            📥 Export CSV
          </button>
        </section>

        {/* Main Content */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Habit Tracker Table */}
          <div className="lg:col-span-2 bg-slate-50 p-4 rounded-lg overflow-x-auto">
            <table className="table-auto border-collapse w-full text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-gray-300 p-2 text-left font-semibold">Habit</th>
                  {dayKeys.map(dateKey => (
                    <th
                      key={dateKey}
                      className="border border-gray-300 p-1 text-xs font-semibold text-center w-8"
                      title={dateKey}
                    >
                      {new Date(dateKey).getDate()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredHabits.length === 0 ? (
                  <tr>
                    <td colSpan={dayKeys.length + 1} className="border border-gray-300 p-4 text-center text-gray-500">
                      {state.habits.length === 0 ? 'No habits yet. Add one to get started!' : 'No habits match your filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredHabits.map(habit => (
                    <tr key={habit.id} className="hover:bg-slate-100">
                      <td className="border border-gray-300 p-2 align-middle min-w-max">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: habit.color }}
                              title="Habit color"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{habit.name}</div>
                              <div className="text-xs text-gray-500">
                                {computeProgressForHabit(habit.id)}% this month
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveHabit(habit.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Delete habit"
                            aria-label={`Delete ${habit.name}`}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                      {dayKeys.map(dateKey => (
                        <td key={dateKey} className="border border-gray-300 p-1 text-center">
                          <input
                            type="checkbox"
                            checked={!!(state.records[dateKey]?.[habit.id])}
                            onChange={() => handleToggleRecord(dateKey, habit.id)}
                            className="w-4 h-4 cursor-pointer"
                            title={`${habit.name} on ${dateKey}`}
                            aria-label={`${habit.name} on ${dateKey}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Sidebar */}
          <aside className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            {/* Add Habit Form */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">➕ Add New Habit</h3>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newHabitName}
                  onChange={e => setNewHabitName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., Exercise, Read, Meditate"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="New habit name"
                />
                <button
                  onClick={handleAddHabit}
                  className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors font-medium"
                  aria-label="Add habit"
                >
                  Add Habit
                </button>
              </div>
            </div>

            <hr className="my-4" />

            {/* Monthly Summary Chart */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">📈 Monthly Summary</h4>
              {monthSummary.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No habits to display</p>
              ) : (
                <div style={{ width: '100%', height: 240 }}>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={monthSummary}
                      layout="vertical"
                      margin={{ left: 0, right: 10, top: 5, bottom: 5 }}
                    >
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={120}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip formatter={value => `${value}%`} />
                      <Bar dataKey="percent" fill="#60A5FA" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <hr className="my-4" />

            {/* Stats */}
            <div className="text-sm text-gray-600">
              <div className="mb-2">
                <span>Total habits: </span>
                <strong className="text-lg">{state.habits.length}</strong>
              </div>
              <div>
                <span>Tracked days: </span>
                <strong className="text-lg">{daysCount}</strong>
              </div>
            </div>
          </aside>
        </section>

        {/* Footer */}
        <footer className="text-xs text-gray-500 border-t border-gray-200 pt-4">
          <p className="mb-2">💾 Data stored locally in your browser (localStorage). Use Export CSV to backup your data.</p>
          <p>🚀 All features work offline. No backend server required!</p>
        </footer>
      </div>
    </div>
  );
}
