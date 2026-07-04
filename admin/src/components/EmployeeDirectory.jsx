import React from 'react';
import { Edit2 } from 'lucide-react';

export default function EmployeeDirectory({ employees, onEdit, defaultAvatar }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display font-bold text-white text-lg">Employee Directory</h2>
        <span className="text-xs font-medium text-slate-500">{employees.length} registered member(s)</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {employees.map(emp => {
          const isHr = emp.role === 'HR';
          return (
            <div key={emp._id} className="glass-panel-interactive flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <img 
                    src={emp.profilePicture || defaultAvatar} 
                    alt="Avatar" 
                    className={`h-11 w-11 rounded-full object-cover bg-slate-900 border ${
                      isHr ? 'border-purple-500/30' : 'border-indigo-500/30'
                    }`} 
                  />
                  <div>
                    <h4 className="font-semibold text-sm text-slate-200 leading-none">{emp.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">{emp.employeeId}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-[11px] text-slate-400">
                  <div>💼 <strong>Title:</strong> {emp.jobTitle || 'Junior Associate'}</div>
                  <div>🏢 <strong>Dept:</strong> {emp.department || 'General'}</div>
                  <div className="truncate">📧 <strong>Email:</strong> {emp.email}</div>
                  <div>📞 <strong>Phone:</strong> {emp.phone || '-'}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                  isHr ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {emp.role}
                </span>
                
                <button onClick={() => onEdit(emp)} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5">
                  <Edit2 className="h-3 w-3" />
                  Edit Info
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
