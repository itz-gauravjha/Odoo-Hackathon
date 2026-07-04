import React from 'react';

export default function LeaveReviewTable({ 
  requests, 
  formatDate, 
  leaveComments, 
  setLeaveComments, 
  onReview 
}) {
  return (
    <div className="glass-panel">
      <h3 className="font-display font-bold text-white text-base border-b border-white/5 pb-4">Leave Request Approvals</h3>

      <div className="table-container mt-6">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-2">
              <th className="pb-3">Employee</th>
              <th className="pb-3">Leave Details</th>
              <th className="pb-3">Reason</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Action comments</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-slate-500">No time-off requests registered.</td>
              </tr>
            ) : (
              requests.map(req => {
                const emp = req.employee || { name: 'Unknown', employeeId: '-', department: '-' };
                const diff = Math.ceil((new Date(req.endDate) - new Date(req.startDate)) / (1000 * 60 * 60 * 24)) + 1;
                const isPending = req.status === 'Pending';

                return (
                  <tr key={req._id} className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                    <td className="py-4">
                      <div className="font-semibold text-slate-300">{emp.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{emp.employeeId} • {emp.department}</div>
                    </td>
                    <td className="py-4">
                      <strong>{req.leaveType} Leave</strong>
                      <div className="text-[10px] text-slate-400 mt-0.5">{formatDate(req.startDate)} to {formatDate(req.endDate)}</div>
                      <div className="text-[10px] text-slate-500">{diff} Working Day(s)</div>
                    </td>
                    <td className="py-4 text-slate-300 max-w-[150px] truncate" title={req.remarks}>{req.remarks || '-'}</td>
                    <td className="py-4">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                        req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                        req.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/25' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                      }`}>{req.status}</span>
                    </td>
                    <td className="py-4">
                      {isPending ? (
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <textarea 
                            value={leaveComments[req._id] || ''} 
                            onChange={e => setLeaveComments({ ...leaveComments, [req._id]: e.target.value })}
                            className="w-full rounded border border-white/5 bg-slate-900/60 p-1.5 text-[10px] text-white focus:outline-none" 
                            placeholder="Add review comments..." 
                            rows="2" 
                          />
                          <div className="flex gap-2">
                            <button onClick={() => onReview(req._id, 'Approved')} className="rounded bg-indigo-500 px-2.5 py-1 text-[10px] font-bold text-white shadow hover:bg-indigo-600 transition-all flex-1">Approve</button>
                            <button onClick={() => onReview(req._id, 'Rejected')} className="rounded bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow hover:bg-red-600 transition-all flex-1">Reject</button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">{req.adminComments || '-'}</span>
                      )}
                    </td>
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
