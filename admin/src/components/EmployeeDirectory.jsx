import React from 'react';
import { Plane, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EmployeeDirectory({ employees, onSelectEmployee, defaultAvatar }) {

  const getEmployeeStatus = (emp) => {
    return emp.todayStatus || 'absent';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display font-bold text-white text-lg">Employee Directory</h2>
        <span className="text-xs font-medium text-slate-500">{employees.length} registered member(s)</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {employees.map(emp => {
          const isHr = emp.role === 'HR';
          const status = getEmployeeStatus(emp);

          return (
            <div
              key={emp._id}
              onClick={() => onSelectEmployee(emp)}
              className="glass-panel-interactive flex flex-col justify-between cursor-pointer hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all relative group"
            >
              <div>
                {/* Status indicator on top right */}
                <div className="absolute top-4 right-4">
                  {status === 'present' && (
                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/30" title="Present in office">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  )}
                  {status === 'leave' && (
                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-sky-500/10 border border-sky-500/30" title="On approved leave">
                      <Plane className="h-3 w-3 text-sky-400" />
                    </div>
                  )}
                  {status === 'absent' && (
                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-amber-500/10 border border-amber-500/30" title="Absent">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                    </div>
                  )}
                </div>

                {/* Avatar and name */}
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <img
                    src={emp.profilePicture || defaultAvatar}
                    alt="Avatar"
                    className={`h-11 w-11 rounded-full object-cover bg-slate-900 border ${isHr ? 'border-purple-500/30 animate-pulse' : 'border-indigo-500/30'
                      }`}
                  />
                  <div>
                    <h4 className="font-semibold text-sm text-slate-200 leading-none group-hover:text-indigo-400 transition-colors">{emp.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">ID: {emp.loginId || emp.employeeId}</span>
                  </div>
                </div>

                {/* Profile info fields */}
                <div className="mt-4 space-y-2 text-[11px] text-slate-400">
                  <div>💼 <strong>Title:</strong> {emp.jobTitle || 'Junior Associate'}</div>
                  <div>🏢 <strong>Dept:</strong> {emp.department || 'General'}</div>
                  <div className="truncate">📧 <strong>Email:</strong> {emp.email}</div>
                  <div>📞 <strong>Phone:</strong> {emp.mobile || emp.phone || '-'}</div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${isHr ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                  {emp.role}
                </span>

                <span className="text-[10px] font-semibold text-indigo-400 group-hover:underline">
                  View Profile ➜
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
