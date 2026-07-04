import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, User, Building, Award, Briefcase, Plus, X, Edit, Save } from 'lucide-react';

export default function EmployeeDetailView({ employee, onClose, onSaveSuccess, defaultAvatar, showToast, isAdminView = false }) {
  const [activeTab, setActiveTab] = useState('resume');
  const [isEditing, setIsEditing] = useState(false);

  // Profile editable fields
  const [name, setName] = useState(employee?.name || '');
  const [email, setEmail] = useState(employee?.email || '');
  const [phone, setPhone] = useState(employee?.phone || '');
  const [mobile, setMobile] = useState(employee?.mobile || '');
  const [address, setAddress] = useState(employee?.address || '');
  const [location, setLocation] = useState(employee?.location || '');
  const [manager, setManager] = useState(employee?.manager || '');
  const [companyName, setCompanyName] = useState(employee?.companyName || '');
  const [jobTitle, setJobTitle] = useState(employee?.jobTitle || '');
  const [department, setDepartment] = useState(employee?.department || '');
  const [role, setRole] = useState(employee?.role || 'Employee');

  // Resume fields
  const [about, setAbout] = useState(employee?.about || '');
  const [loveJob, setLoveJob] = useState(employee?.loveJob || '');
  const [hobbies, setHobbies] = useState(employee?.hobbies || '');
  const [skills, setSkills] = useState(employee?.skills || []);
  const [certifications, setCertifications] = useState(employee?.certifications || []);
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setSkills(skills.filter((_, i) => i !== indexToRemove));
  };

  const handleAddCert = (e) => {
    e.preventDefault();
    if (newCert.trim() && !certifications.includes(newCert.trim())) {
      setCertifications([...certifications, newCert.trim()]);
      setNewCert('');
    }
  };

  const handleRemoveCert = (indexToRemove) => {
    setCertifications(certifications.filter((_, i) => i !== indexToRemove));
  };

  const handleSave = async () => {
    try {
      const payload = {
        name,
        email,
        phone,
        mobile,
        address,
        location,
        manager,
        companyName,
        jobTitle,
        department,
        role,
        about,
        loveJob,
        hobbies,
        skills,
        certifications
      };

      const endpoint = isAdminView ? `/api/employee/${employee._id}` : '/api/employee/profile';
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile details');
      }

      showToast('Profile details updated successfully', 'success');
      setIsEditing(false);
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl my-8 flex flex-col md:flex-row gap-6 p-6 relative">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white text-xl z-10">&times;</button>

        {/* Left Side: Summary & Actions */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header / Avatar */}
            <div className="flex flex-col items-center text-center gap-3">
              <img 
                src={employee?.profilePicture || defaultAvatar} 
                alt="Avatar" 
                className="h-24 w-24 rounded-full object-cover bg-slate-900 border border-indigo-500/30 shadow-lg"
              />
              <div>
                <h3 className="font-display font-bold text-white text-lg">{name}</h3>
                <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[9px] font-bold text-indigo-400 uppercase mt-1 inline-block">
                  {role}
                </span>
                <div className="text-[10px] text-slate-500 font-mono mt-1">ID: {employee?.loginId || employee?.employeeId}</div>
              </div>
            </div>

            {/* Quick Metadata */}
            <div className="space-y-3.5 text-xs text-slate-300 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-indigo-400" />
                <span className="truncate">{email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-indigo-400" />
                {isEditing ? (
                  <input type="text" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded px-2 py-0.5 text-xs text-white" placeholder="Mobile" />
                ) : (
                  <span>{mobile || phone || 'No contact phone'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-3.5 w-3.5 text-indigo-400" />
                <span>{companyName || 'Odoo India'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-indigo-400" />
                <span>Manager: {manager || 'CEO'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                <span>{location || 'General Office'}</span>
              </div>
            </div>

            {/* Registry Info */}
            <div className="space-y-3.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Job Title:</span>
                <strong className="text-white">{jobTitle}</strong>
              </div>
              <div className="flex justify-between">
                <span>Department:</span>
                <strong className="text-white">{department}</strong>
              </div>
              <div className="flex justify-between">
                <span>Joining Date:</span>
                <strong className="text-white">{new Date(employee?.joiningDate || Date.now()).toLocaleDateString()}</strong>
              </div>
            </div>
          </div>

          {/* Edit Actions */}
          <div className="mt-8 border-t border-white/5 pt-4">
            {isEditing ? (
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20">
                  <Save className="h-3.5 w-3.5" /> Save Profile
                </button>
                <button onClick={() => setIsEditing(false)} className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 py-2.5 px-4 text-xs font-semibold text-slate-300">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 py-2.5 text-xs font-bold text-indigo-400">
                <Edit className="h-3.5 w-3.5" /> Update My Details
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Tab Contents */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs header */}
          <div className="flex border-b border-white/5 pb-2 mb-4 gap-4">
            <button 
              onClick={() => setActiveTab('resume')}
              className={`pb-2 text-sm font-semibold border-b-2 px-1 transition-all ${
                activeTab === 'resume' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Resume
            </button>
            <button 
              onClick={() => setActiveTab('private')}
              className={`pb-2 text-sm font-semibold border-b-2 px-1 transition-all ${
                activeTab === 'private' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Private Info
            </button>
          </div>

          {/* Tab View Contents */}
          <div className="flex-1 overflow-y-auto max-h-[420px] pr-2 space-y-5">
            {activeTab === 'resume' && (
              <div className="space-y-4 text-xs">
                {/* About */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">About</label>
                  {isEditing ? (
                    <textarea value={about} onChange={e => setAbout(e.target.value)} rows={3} className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" placeholder="Summary of biography or objective statement..." />
                  ) : (
                    <p className="text-slate-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{about || 'No information entered.'}</p>
                  )}
                </div>

                {/* Love Job */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">What I love about my job</label>
                  {isEditing ? (
                    <textarea value={loveJob} onChange={e => setLoveJob(e.target.value)} rows={3} className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" placeholder="Motivations, favorite assignments..." />
                  ) : (
                    <p className="text-slate-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{loveJob || 'No details specified.'}</p>
                  )}
                </div>

                {/* Hobbies */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My interests and hobbies</label>
                  {isEditing ? (
                    <textarea value={hobbies} onChange={e => setHobbies(e.target.value)} rows={3} className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" placeholder="Sports, activities, reading..." />
                  ) : (
                    <p className="text-slate-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{hobbies || 'No interests listed.'}</p>
                  )}
                </div>

                {/* Skills Section */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-indigo-400" /> Professional Skills
                  </label>
                  {isEditing && (
                    <form onSubmit={handleAddSkill} className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={newSkill} 
                        onChange={e => setNewSkill(e.target.value)}
                        placeholder="Add skill (e.g. JavaScript)" 
                        className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <button type="submit" className="rounded-lg bg-indigo-500 hover:bg-indigo-600 px-3.5 text-white font-bold"><Plus className="h-4 w-4" /></button>
                    </form>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map((skill, idx) => (
                        <span key={idx} className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-indigo-300 border border-indigo-500/20 text-xs">
                          {skill}
                          {isEditing && (
                            <button type="button" onClick={() => handleRemoveSkill(idx)} className="text-slate-400 hover:text-white ml-0.5"><X className="h-3 w-3" /></button>
                          )}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">No skills declared.</span>
                    )}
                  </div>
                </div>

                {/* Certifications Section */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-indigo-400" /> Certifications
                  </label>
                  {isEditing && (
                    <form onSubmit={handleAddCert} className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={newCert} 
                        onChange={e => setNewCert(e.target.value)}
                        placeholder="Add certification (e.g. AWS Developer)" 
                        className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <button type="submit" className="rounded-lg bg-indigo-500 hover:bg-indigo-600 px-3.5 text-white font-bold"><Plus className="h-4 w-4" /></button>
                    </form>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {certifications.length > 0 ? (
                      certifications.map((cert, idx) => (
                        <span key={idx} className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-purple-300 border border-purple-500/20 text-xs">
                          {cert}
                          {isEditing && (
                            <button type="button" onClick={() => handleRemoveCert(idx)} className="text-slate-400 hover:text-white ml-0.5"><X className="h-3 w-3" /></button>
                          )}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">No certifications logged.</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'private' && (
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Personal Address</label>
                  {isEditing ? (
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none" />
                  ) : (
                    <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 text-slate-300">{address || 'Not specified'}</div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Number</label>
                  {isEditing ? (
                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none" />
                  ) : (
                    <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 text-slate-300">{phone || 'Not specified'}</div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Work Location</label>
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 text-slate-300">{location || 'Primary Branch'}</div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Supervisor Manager</label>
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 text-slate-300">{manager || 'CEO'}</div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
