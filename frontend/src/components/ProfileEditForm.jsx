import React from 'react';

export default function ProfileEditForm({ phone, setPhone, address, setAddress, onSubmit }) {
  return (
    <div className="glass-panel h-fit">
      <h3 className="font-display font-bold text-white text-base border-b border-white/5 pb-3">Update Contacts</h3>
      
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Phone Number</label>
          <input 
            type="text" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2.5 px-3 text-xs text-white focus:outline-none" 
            placeholder="+1 555-0100" 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Residential Address</label>
          <textarea 
            value={address} 
            onChange={e => setAddress(e.target.value)} 
            rows="4" 
            className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2.5 px-3 text-xs text-white focus:outline-none" 
            placeholder="123 Main St, City, Country" 
          />
        </div>

        <button type="submit" className="w-full rounded-xl bg-indigo-500 py-3 text-xs font-bold text-white shadow hover:bg-indigo-600 transition-all">
          Save Changes
        </button>
      </form>
    </div>
  );
}
