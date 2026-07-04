import React from 'react';

export default function ProfileView({ profile, formatDate, avatarSrc }) {
  return (
    <div className="glass-panel">
      <h3 className="font-display font-bold text-white text-base border-b border-white/5 pb-3">Registry Information</h3>
      
      <div className="mt-6 flex flex-col gap-6">
        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
          <img src={avatarSrc} alt="Avatar" className="h-16 w-16 rounded-full object-cover bg-slate-950 border border-white/5" />
          <div>
            <h4 className="font-display font-bold text-white text-base leading-tight">{profile?.name}</h4>
            <p className="text-xs text-slate-400 mt-1">{profile?.jobTitle} • {profile?.department}</p>
          </div>
        </div>

        <div className="grid grid-cols-[100px_1fr] gap-y-3.5 text-xs">
          <span className="text-slate-500">Employee ID:</span>
          <span className="font-semibold text-slate-200">{profile?.employeeId}</span>
          
          <span className="text-slate-500">Email Address:</span>
          <span className="font-semibold text-slate-200">{profile?.email}</span>

          <span className="text-slate-500">Phone Number:</span>
          <span className="font-semibold text-slate-200">{profile?.phone || 'Not specified'}</span>

          <span className="text-slate-500">Address:</span>
          <span className="font-semibold text-slate-200">{profile?.address || 'Not specified'}</span>

          <span className="text-slate-500">Date Joined:</span>
          <span className="font-semibold text-slate-200">{formatDate(profile?.joiningDate)}</span>
        </div>
      </div>
    </div>
  );
}
