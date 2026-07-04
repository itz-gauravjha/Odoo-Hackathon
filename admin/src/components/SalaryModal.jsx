import React from 'react';

export default function SalaryModal({
  selectedEmployee,
  basic, setBasic,
  allowances, setAllowances,
  deductions, setDeductions,
  onSubmit, onClose
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="glass-panel w-full max-w-md space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="font-display font-bold text-white text-base">Modify Salary Parameters</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-xl">&times;</button>
        </div>
        
        <p className="text-xs text-slate-400">Updating salary parameters for <strong>{selectedEmployee?.name}</strong>.</p>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Basic Salary ($)</label>
          <input 
            type="number" 
            value={basic} 
            onChange={e => setBasic(Number(e.target.value))} 
            className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 px-3 text-xs text-white focus:outline-none" 
            required 
            min="0" 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Allowances ($)</label>
          <input 
            type="number" 
            value={allowances} 
            onChange={e => setAllowances(Number(e.target.value))} 
            className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 px-3 text-xs text-white focus:outline-none" 
            required 
            min="0" 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Deductions ($)</label>
          <input 
            type="number" 
            value={deductions} 
            onChange={e => setDeductions(Number(e.target.value))} 
            className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 px-3 text-xs text-white focus:outline-none" 
            required 
            min="0" 
          />
        </div>

        <button type="submit" className="w-full rounded-xl bg-indigo-500 py-3 text-xs font-bold text-white hover:bg-indigo-600 transition-all">
          Commit Salary Modifications
        </button>
      </form>
    </div>
  );
}
