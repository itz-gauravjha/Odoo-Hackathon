import React, { useState, useEffect } from 'react';
import { Clock, Plus, Check } from 'lucide-react';

export default function ClockPanel({ todayRecord, onCheckIn, onCheckOut }) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString());
      setDateStr(now.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
      <div className="flex flex-col">
        <span className="font-display text-3xl font-extrabold text-white tracking-tight leading-none">
          {timeStr || '00:00:00 AM'}
        </span>
        <span className="text-xs text-slate-400 mt-2 font-medium">
          {dateStr || 'Loading local date...'}
        </span>
      </div>
      <div className="flex gap-4">
        <button 
          onClick={onCheckIn} 
          disabled={!!todayRecord?.checkIn}
          className="flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/10 transition-all hover:bg-indigo-600 disabled:opacity-50 disabled:pointer-events-none"
        >
          <Plus className="h-4 w-4" />
          {todayRecord?.checkIn ? 'Checked In' : 'Check In'}
        </button>
        <button 
          onClick={onCheckOut} 
          disabled={!todayRecord?.checkIn || !!todayRecord?.checkOut}
          className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-6 py-3.5 text-xs font-bold text-slate-300 transition-all hover:bg-white/10 disabled:opacity-50 disabled:pointer-events-none"
        >
          <Check className="h-4 w-4" />
          {todayRecord?.checkOut ? 'Checked Out' : 'Check Out'}
        </button>
      </div>
    </div>
  );
}
