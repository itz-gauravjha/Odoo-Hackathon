import React, { useState, useEffect } from 'react';
import { useAdminApp } from '../App';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Clock, DollarSign, LogOut } from 'lucide-react';

import EmployeeDirectory from '../components/EmployeeDirectory';
import EditEmployeeModal from '../components/EditEmployeeModal';
import EmployeeDetailView from '../components/EmployeeDetailView';
import AttendanceGrid from '../components/AttendanceGrid';
import ManualAttendanceModal from '../components/ManualAttendanceModal';
import LeaveReviewTable from '../components/LeaveReviewTable';
import PayrollRegistry from '../components/PayrollRegistry';
import SalaryModal from '../components/SalaryModal';

export default function AdminDashboard() {
  const { admin, logout, showToast } = useAdminApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('tab-directory');

  // Lists caches
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);

  // Date filters
  const getLocalDateString = (dateObj = new Date()) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [filterDate, setFilterDate] = useState(getLocalDateString());

  // Edit employee modal states
  const [showEditEmpModal, setShowEditEmpModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [selectedDetailEmployee, setSelectedDetailEmployee] = useState(null);
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empEmpId, setEmpEmpId] = useState('');
  const [empRole, setEmpRole] = useState('Employee');
  const [empTitle, setEmpTitle] = useState('');
  const [empDept, setEmpDept] = useState('');

  // Salary modal states
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [selectedSalaryEmp, setSelectedSalaryEmp] = useState(null);
  const [salBasic, setSalBasic] = useState(0);
  const [salAllowances, setSalAllowances] = useState(0);
  const [salDeductions, setSalDeductions] = useState(0);

  // Manual attendance modal states
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualEmpId, setManualEmpId] = useState('');
  const [manualDate, setManualDate] = useState(getLocalDateString());
  const [manualStatus, setManualStatus] = useState('Present');
  const [manualRemarks, setManualRemarks] = useState('');

  // Leave comments
  const [leaveComments, setLeaveComments] = useState({});

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
    fetchLeaves();
    fetchPayroll();
  }, [filterDate]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employee/list');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`/api/attendance/all?date=${filterDate}`);
      const data = await res.json();
      if (data.success) setAttendance(data.records);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/leave/all');
      const data = await res.json();
      if (data.success) setLeaves(data.requests);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPayroll = async () => {
    try {
      const res = await fetch('/api/payroll/all');
      const data = await res.json();
      if (data.success) setPayroll(data.payroll);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditEmpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/employee/${selectedEmp._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: empName,
          email: empEmail,
          employeeId: empEmpId,
          role: empRole,
          jobTitle: empTitle,
          department: empDept
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(data.message, 'success');
      setShowEditEmpModal(false);
      await fetchEmployees();
      await fetchPayroll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSalarySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/payroll/update/${selectedSalaryEmp._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basic: salBasic,
          allowances: salAllowances,
          deductions: salDeductions
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(data.message, 'success');
      setShowSalaryModal(false);
      await fetchPayroll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleManualAttendance = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: manualEmpId,
          date: manualDate,
          status: manualStatus,
          remarks: manualRemarks
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(data.message, 'success');
      setShowManualModal(false);
      setManualEmpId('');
      setManualRemarks('');
      await fetchAttendance();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleLeaveReview = async (id, status) => {
    const comment = leaveComments[id] || '';
    try {
      const res = await fetch(`/api/leave/approve/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminComments: comment })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast(data.message, 'success');
      await fetchLeaves();
      await fetchAttendance();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const triggerEdit = (emp) => {
    setSelectedEmp(emp);
    setEmpName(emp.name);
    setEmpEmail(emp.email);
    setEmpEmpId(emp.employeeId);
    setEmpRole(emp.role);
    setEmpTitle(emp.jobTitle || '');
    setEmpDept(emp.department || '');
    setShowEditEmpModal(true);
  };

  const triggerSalary = (empRecord) => {
    setSelectedSalaryEmp(empRecord);
    setSalBasic(empRecord.salaryStructure.basic);
    setSalAllowances(empRecord.salaryStructure.allowances);
    setSalDeductions(empRecord.salaryStructure.deductions);
    setShowSalaryModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%236366f1'><circle cx='50' cy='35' r='20'/><path d='M20,80 C20,60 80,60 80,80'/></svg>";

  return (
    <div className="flex min-h-screen flex-col bg-midnight">
      {/* Navbar */}
      <header className="flex items-center justify-between border-b border-white/5 bg-slate-950/80 px-8 py-4 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 font-extrabold text-sm shadow-md shadow-indigo-500/20">H</div>
          <span className="font-display font-bold tracking-tight text-white">HRMS Admin Console</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-3 py-1.5 text-xs font-semibold text-purple-400">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            {admin?.name || 'HR Officer'}
          </span>
          <button onClick={() => logout(navigate)} className="rounded-lg border border-white/5 bg-white/5 p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all" title="Sign Out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Grid */}
      <div className="mx-auto grid w-full max-w-7xl gap-8 p-8 md:grid-cols-[280px_1fr]">
        
        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <div className="glass-panel flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Console Authority</span>
            <div className="font-display font-bold text-white text-base mt-1">{admin?.name || 'HR Administrator'}</div>
            <p className="text-xs text-indigo-400 font-mono font-bold mt-1">ID: {admin?.loginId || 'HR-001'}</p>
            <div className="text-xs text-slate-400 mt-0.5 truncate">{admin?.email}</div>
          </div>

          <nav className="glass-panel flex flex-col gap-1 p-2">
            <button onClick={() => setActiveTab('tab-directory')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'tab-directory' ? 'bg-indigo-500/10 border-l-2 border-indigo-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}>
              <Users className="h-4 w-4" />
              Employee Directory
            </button>
            <button onClick={() => setActiveTab('tab-all-attendance')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'tab-all-attendance' ? 'bg-indigo-500/10 border-l-2 border-indigo-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}>
              <Calendar className="h-4 w-4" />
              Attendance Tracker
            </button>
            <button onClick={() => setActiveTab('tab-approvals')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'tab-approvals' ? 'bg-indigo-500/10 border-l-2 border-indigo-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}>
              <Clock className="h-4 w-4" />
              Leave Approvals
            </button>
            <button onClick={() => setActiveTab('tab-payroll-admin')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'tab-payroll-admin' ? 'bg-indigo-500/10 border-l-2 border-indigo-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}>
              <DollarSign className="h-4 w-4" />
              Payroll Structure
            </button>
          </nav>
        </aside>

        {/* Content area */}
        <main className="min-w-0">
          {activeTab === 'tab-directory' && (
            <EmployeeDirectory 
              employees={employees} 
              attendance={attendance}
              leaves={leaves}
              onSelectEmployee={setSelectedDetailEmployee} 
              defaultAvatar={defaultAvatar} 
            />
          )}

          {activeTab === 'tab-all-attendance' && (
            <AttendanceGrid 
              records={attendance} 
              filterDate={filterDate} 
              setFilterDate={setFilterDate} 
              onManualMarkTrigger={() => setShowManualModal(true)} 
              formatDate={formatDate} 
              formatTime={formatTime} 
            />
          )}

          {activeTab === 'tab-approvals' && (
            <LeaveReviewTable 
              requests={leaves} 
              formatDate={formatDate} 
              leaveComments={leaveComments} 
              setLeaveComments={setLeaveComments} 
              onReview={handleLeaveReview} 
            />
          )}

          {activeTab === 'tab-payroll-admin' && (
            <PayrollRegistry 
              payrollData={payroll} 
              onUpdateSalary={triggerSalary} 
            />
          )}
        </main>
      </div>

      {/* Edit registry modal */}
      {showEditEmpModal && (
        <EditEmployeeModal 
          name={empName} setName={setEmpName}
          email={empEmail} setEmail={setEmpEmail}
          employeeId={empEmpId} setEmployeeId={setEmpEmpId}
          role={empRole} setRole={setEmpRole}
          jobTitle={empTitle} setJobTitle={setEmpTitle}
          department={empDept} setDepartment={setEmpDept}
          onSubmit={handleEditEmpSubmit}
          onClose={() => setShowEditEmpModal(false)}
        />
      )}

      {/* Salary Modal */}
      {showSalaryModal && (
        <SalaryModal 
          selectedEmployee={selectedSalaryEmp}
          basic={salBasic} setBasic={setSalBasic}
          allowances={salAllowances} setAllowances={setSalAllowances}
          deductions={salDeductions} setDeductions={setSalDeductions}
          onSubmit={handleSalarySubmit}
          onClose={() => setShowSalaryModal(false)}
        />
      )}

      {/* Manual attendance mark modal */}
      {showManualModal && (
        <ManualAttendanceModal 
          employees={employees}
          employeeId={manualEmpId} setEmployeeId={setManualEmpId}
          date={manualDate} setDate={setManualDate}
          status={manualStatus} setStatus={setManualStatus}
          remarks={manualRemarks} setRemarks={setManualRemarks}
          onSubmit={handleManualAttendance}
          onClose={() => setShowManualModal(false)}
        />
      )}

      {/* Detailed employee card view & configurations */}
      {selectedDetailEmployee && (
        <EmployeeDetailView 
          employee={selectedDetailEmployee}
          defaultAvatar={defaultAvatar}
          showToast={showToast}
          onClose={() => setSelectedDetailEmployee(null)}
          onSaveSuccess={() => {
            fetchEmployees();
            setSelectedDetailEmployee(null);
          }}
        />
      )}
    </div>
  );
}
