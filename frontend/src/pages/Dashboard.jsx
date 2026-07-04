import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, FileText, Clock, LogOut, Camera } from 'lucide-react';

import ClockPanel from '../components/ClockPanel';
import AttendanceCalendar from '../components/AttendanceCalendar';
import LeaveForm from '../components/LeaveForm';
import LeaveHistoryTable from '../components/LeaveHistoryTable';
import ProfileView from '../components/ProfileView';
import ProfileEditForm from '../components/ProfileEditForm';
import PayrollSlip from '../components/PayrollSlip';
import EmployeeDetailView from '../components/EmployeeDetailView';
import EmployeeDirectory from '../components/EmployeeDirectory';

export default function Dashboard() {
  const { user, logout, showToast } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('tab-employees');
  const [profileData, setProfileData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedDetailEmployee, setSelectedDetailEmployee] = useState(null);
  
  // Today's Checkin Record
  const [todayRecord, setTodayRecord] = useState(null);
  // Attendance Logs
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  
  // Leave Form parameters
  const [leaveType, setLeaveType] = useState('Paid');
  const [startDateStr, setStartDateStr] = useState('');
  const [endDateStr, setEndDateStr] = useState('');
  const [leaveRemarks, setLeaveRemarks] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);

  // Calendar Click States
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);

  // Profile Edit fields
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Payroll Slip fields
  const [payrollSlip, setPayrollSlip] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchTodayAttendance();
    fetchLogs();
    fetchLeaves();
    fetchPaySlip();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employee/list', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error('Error fetching employee list:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/employee/profile', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        setPhone(data.phone || '');
        setAddress(data.address || '');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const res = await fetch('/api/attendance/today', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setTodayRecord(data.record);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/attendance/my-logs', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setAttendanceLogs(data.logs);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/leave/my-requests', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setLeaveRequests(data.requests);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPaySlip = async () => {
    try {
      const res = await fetch('/api/payroll/my-slip', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) setPayrollSlip(data.salaryStructure);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckIn = async () => {
    try {
      const res = await fetch('/api/attendance/checkin', { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      showToast(data.message, 'success');
      await fetchTodayAttendance();
      await fetchLogs();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await fetch('/api/attendance/checkout', { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      showToast(data.message, 'success');
      await fetchTodayAttendance();
      await fetchLogs();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleLeaveApply = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/leave/apply', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaveType,
          startDate: startDateStr,
          endDate: endDateStr,
          remarks: leaveRemarks
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(data.message, 'success');
      setLeaveRemarks('');
      setStartDateStr('');
      setEndDateStr('');
      setSelectedStart(null);
      setSelectedEnd(null);
      
      await fetchLeaves();
      await fetchLogs();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/employee/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, address })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(data.message, 'success');
      await fetchProfile();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Profile image must be under 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      try {
        const res = await fetch('/api/employee/profile', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profilePicture: base64Data })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        showToast('Profile picture uploaded successfully', 'success');
        await fetchProfile();
      } catch (err) {
        showToast(err.message, 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  const getFormattedDateInput = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSelectRange = (clickedDate) => {
    const dateStr = getFormattedDateInput(clickedDate);

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(clickedDate);
      setSelectedEnd(null);
      setStartDateStr(dateStr);
      setEndDateStr('');
      showToast(`Selected start date: ${dateStr}`, 'info');
    } else {
      if (clickedDate < selectedStart) {
        setSelectedStart(clickedDate);
        setStartDateStr(dateStr);
        showToast(`Updated start date: ${dateStr}`, 'info');
      } else {
        setSelectedEnd(clickedDate);
        setEndDateStr(dateStr);
        showToast(`Selected end date: ${dateStr}`, 'info');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%236366f1'><circle cx='50' cy='35' r='20'/><path d='M20,80 C20,60 80,60 80,80'/></svg>";
  const avatarSrc = (profileData && profileData.profilePicture) || defaultAvatar;

  return (
    <div className="flex min-h-screen flex-col bg-midnight">
      {/* Navbar */}
      <header className="flex items-center justify-between border-b border-white/5 bg-slate-950/80 px-8 py-4 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 font-extrabold text-sm shadow-md shadow-indigo-500/20">H</div>
          <span className="font-display font-bold tracking-tight text-white hidden md:inline-block">HRMS Employee Portal</span>
        </div>

        {/* Center Navigation Tabs */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-xl p-1">
          <button 
            onClick={() => setActiveTab('tab-employees')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tab-employees' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Employees
          </button>
          <button 
            onClick={() => setActiveTab('tab-attendance')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tab-attendance' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Attendance
          </button>
          <button 
            onClick={() => setActiveTab('tab-leave')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tab-leave' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Time Off
          </button>
          <button 
            onClick={() => setActiveTab('tab-payroll')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tab-payroll' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Payroll
          </button>
        </div>

        <div className="flex items-center gap-4">
          {profileData?.role === 'HR' && (
            <a 
              href={window.location.hostname === 'localhost' ? 'http://localhost:5174/' : '/admin/'}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-all flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg"
            >
              Admin Console ➜
            </a>
          )}
          <div className="relative flex items-center gap-2">
            {/* Status dot in header: Green if checked in, Red if checked out */}
            <span 
              className={`h-2.5 w-2.5 rounded-full shadow-lg ${
                todayRecord && todayRecord.checkIn && !todayRecord.checkOut
                  ? 'bg-emerald-500 shadow-emerald-500/30 animate-pulse'
                  : 'bg-red-500 shadow-red-500/30'
              }`} 
              title={todayRecord && todayRecord.checkIn && !todayRecord.checkOut ? 'Checked In' : 'Checked Out'}
            />
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 p-1 pr-3 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-all focus:outline-none"
            >
              <img 
                src={profileData?.profilePicture || defaultAvatar} 
                alt="Avatar" 
                className="h-7 w-7 rounded-full object-cover bg-slate-900 border border-indigo-500/25" 
              />
              <span>{profileData?.name || 'User'}</span>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/5 bg-slate-900/95 backdrop-blur-md p-1 shadow-xl z-50 animate-slide-in">
                <button 
                  onClick={() => { setShowDropdown(false); setShowProfileModal(true); }}
                  className="w-full text-left rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                >
                  My Profile
                </button>
                <button 
                  onClick={() => { setShowDropdown(false); logout(navigate); }}
                  className="w-full text-left rounded-lg px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all border-t border-white/5 mt-1"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Grid */}
      <div className="mx-auto grid w-full max-w-7xl gap-8 p-8 md:grid-cols-[280px_1fr]">
        
        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <div className="glass-panel flex flex-col items-center text-center gap-3">
            <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/25">
              <img src={avatarSrc} alt="Avatar" className="h-full w-full rounded-full object-cover bg-slate-950" />
              <label htmlFor="avatar-file" className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-slate-950 bg-indigo-500 text-white shadow hover:scale-105 transition-all">
                <Camera className="h-3 w-3" />
              </label>
              <input type="file" id="avatar-file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>

            <div className="mt-2">
              <h3 className="font-display font-bold text-white text-base leading-tight">{profileData?.name || 'Staff Employee'}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {profileData?.loginId || 'EMP-ID'}</p>
            </div>
            
            <span className="rounded-full bg-indigo-500/10 border border-indigo-500/25 px-3 py-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
              {profileData?.jobTitle || 'Staff Member'}
            </span>
          </div>

          <nav className="glass-panel flex flex-col gap-1 p-2">
            <button onClick={() => setActiveTab('tab-employees')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'tab-employees' ? 'bg-indigo-500/10 border-l-2 border-indigo-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}>
              <User className="h-4 w-4" />
              Employee Directory
            </button>
            <button onClick={() => setActiveTab('tab-attendance')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'tab-attendance' ? 'bg-indigo-500/10 border-l-2 border-indigo-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}>
              <Calendar className="h-4 w-4" />
              Attendance Tracker
            </button>
            <button onClick={() => setActiveTab('tab-leave')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'tab-leave' ? 'bg-indigo-500/10 border-l-2 border-indigo-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}>
              <Clock className="h-4 w-4" />
              Leave Requests
            </button>
            <button onClick={() => setActiveTab('tab-profile')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'tab-profile' ? 'bg-indigo-500/10 border-l-2 border-indigo-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}>
              <User className="h-4 w-4" />
              Profile Management
            </button>
            <button onClick={() => setActiveTab('tab-payroll')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'tab-payroll' ? 'bg-indigo-500/10 border-l-2 border-indigo-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}>
              <FileText className="h-4 w-4" />
              Payroll Slip
            </button>
          </nav>
        </aside>

        {/* Content area tabs */}
        <main className="min-w-0">
          {activeTab === 'tab-employees' && (
            <EmployeeDirectory 
              employees={employees} 
              onSelectEmployee={setSelectedDetailEmployee} 
              defaultAvatar={defaultAvatar} 
            />
          )}

          {activeTab === 'tab-attendance' && (
            <div className="space-y-6">
              <ClockPanel 
                todayRecord={todayRecord} 
                onCheckIn={handleCheckIn} 
                onCheckOut={handleCheckOut} 
              />
              <AttendanceCalendar 
                logs={attendanceLogs} 
                onSelectRange={handleSelectRange} 
                selectedStart={selectedStart} 
                selectedEnd={selectedEnd} 
              />
            </div>
          )}

          {activeTab === 'tab-leave' && (
            <div className="grid gap-6 md:grid-cols-[1.2fr_2fr]">
              <LeaveForm 
                leaveType={leaveType} 
                setLeaveType={setLeaveType}
                startDate={startDateStr} 
                setStartDate={setStartDateStr}
                endDate={endDateStr} 
                setEndDate={setEndDateStr}
                remarks={leaveRemarks} 
                setRemarks={setLeaveRemarks}
                onSubmit={handleLeaveApply}
              />
              <LeaveHistoryTable 
                requests={leaveRequests} 
                formatDate={formatDate} 
              />
            </div>
          )}

          {activeTab === 'tab-profile' && (
            <div className="grid gap-6 md:grid-cols-2">
              <ProfileView 
                profile={profileData} 
                formatDate={formatDate} 
                avatarSrc={avatarSrc} 
              />
              <ProfileEditForm 
                phone={phone} 
                setPhone={setPhone} 
                address={address} 
                setAddress={setAddress} 
                onSubmit={handleProfileUpdate} 
              />
            </div>
          )}

          {activeTab === 'tab-payroll' && (
            <PayrollSlip slip={payrollSlip} />
          )}
        </main>

      {showProfileModal && (
        <EmployeeDetailView 
          employee={profileData}
          onClose={() => setShowProfileModal(false)}
          defaultAvatar={defaultAvatar}
          showToast={showToast}
          isAdminView={false}
          onSaveSuccess={() => {
            fetchProfile();
            setShowProfileModal(false);
          }}
        />
      )}

      {selectedDetailEmployee && (
        <EmployeeDetailView 
          employee={selectedDetailEmployee}
          onClose={() => setSelectedDetailEmployee(null)}
          defaultAvatar={defaultAvatar}
          showToast={showToast}
          isAdminView={false}
        />
      )}
    </div>
    </div>
  );
}
