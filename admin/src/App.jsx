import React, { useState, useEffect, createContext, useContext, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const AdminAppContext = createContext(null);

export const useAdminApp = () => useContext(AdminAppContext);

function PageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-400">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        <p className="font-display font-medium tracking-wide text-xs text-indigo-400">Loading Console workspace...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAdminStatus = async () => {
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      if (data.isAuthenticated) {
        if (data.user.role === 'HR') {
          setAdmin(data.user);
        } else {
          showToast('Access denied. Redirecting to employee portal...', 'error');
          setTimeout(() => {
            window.location.href = 'http://localhost:5173/';
          }, 1500);
        }
      } else {
        setAdmin(null);
      }
    } catch (err) {
      console.error('Session check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStatus();
  }, []);

  const logout = async (navigate) => {
    try {
      const res = await fetch('/api/auth/signout', { method: 'POST' });
      if (res.ok) {
        setAdmin(null);
        showToast('Logged out successfully');
        if (navigate) navigate('/');
      }
    } catch (err) {
      showToast('Logout failed', 'error');
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <AdminAppContext.Provider value={{ admin, setAdmin, showToast, logout, fetchAdminStatus }}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                admin ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      {/* Global Toast component */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[10000] flex min-w-[280px] animate-slide-in items-center gap-3 rounded-lg border border-white/5 bg-[#1e293b] p-4 text-slate-100 shadow-2xl transition-all duration-300"
             style={{ borderLeft: `4px solid ${toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#6366f1'}` }}>
          <span className="text-xl">
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}
    </AdminAppContext.Provider>
  );
}

// Inline animation keyframes styles injected
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .animate-slide-in {
    animation: slideIn 0.3s ease forwards;
  }
`;
document.head.appendChild(style);
