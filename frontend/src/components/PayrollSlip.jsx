import React from 'react';

export default function PayrollSlip({ slip }) {
  if (!slip) {
    return <p className="text-center py-8 text-slate-500 text-xs">Loading payroll parameters...</p>;
  }

  return (
    <div className="glass-panel max-w-xl mx-auto">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h3 className="font-display font-bold text-white text-base">Pay Slip Breakdown</h3>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">Active salary configuration (Read-Only)</p>
        </div>
        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
          Active
        </span>
      </div>

      <div className="mt-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Earnings */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-1">Earnings</h4>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Basic Salary:</span>
              <span className="font-mono font-semibold">${slip.basic.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Allowances:</span>
              <span className="font-mono font-semibold">${slip.allowances.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs border-t border-dashed border-white/5 pt-2 font-bold">
              <span className="text-slate-300">Gross Salary:</span>
              <span className="font-mono">${slip.grossSalary.toLocaleString()}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-1">Deductions</h4>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Provident Fund (PF):</span>
              <span className="font-mono font-semibold">${(slip.deductions * 0.4).toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Income Tax:</span>
              <span className="font-mono font-semibold">${(slip.deductions * 0.6).toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-xs border-t border-dashed border-white/5 pt-2 font-bold">
              <span className="text-slate-300">Total Deductions:</span>
              <span className="font-mono text-red-400">${slip.deductions.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-white/5 pt-6 mt-4">
          <div>
            <h4 className="text-xs font-semibold text-indigo-400">Net Take-Home Pay</h4>
            <p className="text-[9px] text-slate-500 mt-0.5">Calculated take home salary</p>
          </div>
          <span className="font-display font-extrabold text-2xl text-emerald-400">${slip.netSalary.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
