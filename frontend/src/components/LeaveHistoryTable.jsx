import React from 'react';

export default function LeaveHistoryTable({ requests, formatDate }) {
  return (
    <div className="glass-panel">
      <h3 className="font-display font-bold text-white text-base border-b border-white/5 pb-3">Leave History</h3>
      
      <div className="table-container mt-6">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-2">
              <th className="pb-3">Type</th>
              <th className="pb-3">Duration</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Remarks</th>
              <th className="pb-3">Admin Notes</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-slate-500">No time-off requests submitted.</td>
              </tr>
            ) : (
              requests.map(req => {
                const diff = Math.ceil((new Date(req.endDate) - new Date(req.startDate)) / (1000 * 60 * 60 * 24)) + 1;
                return (
                  <tr key={req._id} className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                    <td className="py-4"><strong>{req.leaveType} Leave</strong></td>
                    <td className="py-4">
                      <div className="font-semibold text-slate-300">{formatDate(req.startDate)} to {formatDate(req.endDate)}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{diff} Day(s)</div>
                    </td>
                    <td className="py-4">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                        req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                        req.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/25' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-400 max-w-[120px] truncate" title={req.remarks}>{req.remarks || '-'}</td>
                    <td className="py-4 text-slate-400 max-w-[120px] truncate" title={req.adminComments}>{req.adminComments || '-'}</td>
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
