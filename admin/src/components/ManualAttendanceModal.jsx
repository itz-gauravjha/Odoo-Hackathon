import React from 'react';

export default function ManualAttendanceModal({
  employees,
  employeeId, setEmployeeId,
  date, setDate,
  status, setStatus,
  remarks, setRemarks,
  onSubmit, onClose
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="glass-panel w-full max-w-md space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="font-display font-bold text-white text-base">Manual Attendance Override</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-xl">&times;</button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Select Employee</label>
          <select 
            value={employeeId} 
            onChange={e => setEmployeeId(e.target.value)} 
            className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 px-3 text-xs text-white focus:outline-none" 
            required
          >
            <option value="">-- Choose Employee --</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>{emp.name} ({emp.employeeId})</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 px-3 text-xs text-white focus:outline-none" required />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Attendance Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 px-3 text-xs text-white focus:outline-none" required>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Half-day">Half-Day</option>
            <option value="Leave">On Leave</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Remarks</label>
          <input type="text" value={remarks} onChange={e => setRemarks(e.target.value)} className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 px-3 text-xs text-white focus:outline-none" placeholder="e.g. Manually marked by HR" />
        </div>

        <button type="submit" className="w-full rounded-xl bg-indigo-500 py-3 text-xs font-bold text-white hover:bg-indigo-600 transition-all">
          Mark Attendance Record
        </button>
      </form>
    </div>
  );
}
