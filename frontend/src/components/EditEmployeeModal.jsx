import React from 'react';

export default function EditEmployeeModal({
  name, setName,
  email, setEmail,
  employeeId, setEmployeeId,
  role, setRole,
  jobTitle, setJobTitle,
  department, setDepartment,
  onSubmit, onClose
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="glass-panel w-full max-w-md space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="font-display font-bold text-white text-base">Edit Employee Registry</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-xl">&times;</button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Full Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 px-3 text-xs text-white focus:outline-none" required />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 px-3 text-xs text-white focus:outline-none" required />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Employee ID</label>
          <input type="text" value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 px-3 text-xs text-white focus:outline-none" required />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">System Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 px-3 text-xs text-white focus:outline-none" required>
            <option value="Employee">Employee (Staff)</option>
            <option value="HR">HR Officer (Admin)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Job Title</label>
          <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 px-3 text-xs text-white focus:outline-none" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Department</label>
          <input type="text" value={department} onChange={e => setDepartment(e.target.value)} className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 px-3 text-xs text-white focus:outline-none" />
        </div>

        <button type="submit" className="w-full rounded-xl bg-indigo-500 py-3 text-xs font-bold text-white hover:bg-indigo-600 transition-all">
          Save Employee Configuration
        </button>
      </form>
    </div>
  );
}
