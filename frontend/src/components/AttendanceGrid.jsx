import React from 'react';

export default function AttendanceGrid({ 
  records, 
  filterDate, 
  setFilterDate, 
  onManualMarkTrigger, 
  formatDate, 
  formatTime 
}) {
  return (
    <div className="glass-panel">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
        <h3 className="font-display font-bold text-white text-base">Attendance Tracker</h3>
        
        <div className="flex gap-3 items-center">
          <input 
            type="date" 
            value={filterDate} 
            onChange={e => setFilterDate(e.target.value)} 
            className="rounded-lg border border-white/5 bg-slate-900/60 py-2 px-3 text-xs text-white focus:outline-none" 
          />
          <button 
            onClick={onManualMarkTrigger} 
            className="rounded-lg bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-600 transition-all"
          >
            ✏️ Manual Override
          </button>
        </div>
      </div>

      <div className="table-container mt-6">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-2">
              <th className="pb-3">Employee</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Check In</th>
              <th className="pb-3">Check Out</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-slate-500">No attendance logged for {formatDate(filterDate)}.</td>
              </tr>
            ) : (
              records.map(rec => {
                const emp = rec.employee || { name: 'Unknown', employeeId: '-' };
                return (
                  <tr key={rec._id} className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                    <td className="py-4">
                      <div className="font-semibold text-slate-300">{emp.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{emp.employeeId}</div>
                    </td>
                    <td className="py-4 text-slate-300">{formatDate(rec.date)}</td>
                    <td className="py-4 font-mono text-indigo-400">{formatTime(rec.checkIn)}</td>
                    <td className="py-4 font-mono text-purple-400">{formatTime(rec.checkOut)}</td>
                    <td className="py-4">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                        rec.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                        rec.status === 'Absent' ? 'bg-red-500/10 text-red-400 border border-red-500/25' :
                        rec.status === 'Half-day' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                        'bg-purple-500/10 text-purple-400 border border-purple-500/25'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-400 max-w-[150px] truncate" title={rec.remarks}>{rec.remarks || '-'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
