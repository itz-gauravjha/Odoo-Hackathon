import React from 'react';

export default function LeaveForm({ 
  leaveType, 
  setLeaveType, 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate, 
  remarks, 
  setRemarks, 
  onSubmit 
}) {
  return (
    <div className="glass-panel h-fit">
      <h3 className="font-display font-bold text-white text-base border-b border-white/5 pb-3">Request Time-Off</h3>
      
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Leave Type</label>
          <select 
            value={leaveType} 
            onChange={e => setLeaveType(e.target.value)} 
            className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500/50"
          >
            <option value="Paid">Paid Leave</option>
            <option value="Sick">Sick Leave</option>
            <option value="Unpaid">Unpaid Leave</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Start Date</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)} 
            className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2.5 px-3 text-xs text-white focus:outline-none" 
            required 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">End Date</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={e => setEndDate(e.target.value)} 
            className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2.5 px-3 text-xs text-white focus:outline-none" 
            required 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Remarks / Description</label>
          <textarea 
            value={remarks} 
            onChange={e => setRemarks(e.target.value)} 
            rows="3" 
            placeholder="Reason for request..." 
            className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2.5 px-3 text-xs text-white focus:outline-none" 
            required 
          />
        </div>

        <p className="text-[10px] text-slate-500 leading-relaxed">
          💡 Hint: You can also choose dates by clicking directly on the calendar cells in the attendance tracker!
        </p>

        <button type="submit" className="w-full rounded-xl bg-indigo-500 py-3 text-xs font-bold text-white shadow hover:bg-indigo-600 transition-all">
          Submit Application
        </button>
      </form>
    </div>
  );
}
