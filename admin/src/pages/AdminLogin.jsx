import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminApp } from '../App';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const { admin, setAdmin, showToast } = useAdminApp();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (admin) {
      navigate('/admin');
    }
  }, [admin]);

  const [dbStatus, setDbStatus] = useState('connecting');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const checkConnection = async () => {
    try {
      const res = await fetch('/api/backend-status');
      const data = await res.json();
      if (data.success && data.dbStatus === 1) {
        setDbStatus('online');
      } else {
        setDbStatus('offline');
      }
    } catch (err) {
      setDbStatus('server-offline');
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.user.role !== 'HR') {
        throw new Error('Access denied. HR credentials required.');
      }

      showToast('Admin authority loaded successfully. Welcome, ' + data.user.name, 'success');
      setAdmin(data.user);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/5 bg-slate-950/80 px-8 py-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-extrabold shadow-lg shadow-indigo-500/25">H</div>
          <span className="font-display text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">HRMS Console</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-xs font-semibold">
            <span className={`h-2.5 w-2.5 rounded-full shadow-lg ${
              dbStatus === 'online' ? 'bg-emerald-500 shadow-emerald-500/30' :
              dbStatus === 'offline' ? 'bg-amber-500 shadow-amber-500/30' : 'bg-red-500 shadow-red-500/30'
            }`} />
            {dbStatus === 'online' ? 'Database Connected' :
             dbStatus === 'offline' ? 'Database Disconnected' : 'Server Disconnected'}
          </span>
          <a href={window.location.hostname === 'localhost' ? 'http://localhost:5173/' : '/'} className="text-xs font-bold text-indigo-400 hover:underline">Employee Portal ➜</a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          
          {/* Sign In Card */}
          <div className="glass-panel flex flex-col justify-between">
            <div>
              <div className="mb-4 text-center">
                <span className="inline-block rounded-full bg-purple-500/10 border border-purple-500/25 px-3 py-1 text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  HR Admin Authority
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-center tracking-tight text-white">Console Sign In</h2>
              <p className="mt-1 text-xs text-center text-slate-400">Authenticate with HR credentials to access administration panels.</p>
              
              <form onSubmit={handleSignIn} className="mt-8 space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Login ID / Email</label>
                  <div className="relative">
                    <Shield className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={loginId} 
                      onChange={e => setLoginId(e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-slate-900/60 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:border-indigo-500/50 focus:bg-slate-900/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10" 
                      placeholder="HR-XXXXXX or hr@company.com" 
                      required 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Secret Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-slate-900/60 py-3.5 pl-11 pr-11 text-sm text-white placeholder-slate-500 transition-all focus:border-indigo-500/50 focus:bg-slate-900/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10" 
                      placeholder="••••••••" 
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:translate-y-[-1px] hover:shadow-indigo-500/35 active:translate-y-0">
                  Authenticate Admin Session
                </button>
              </form>
            </div>
            
            <div className="mt-8 border-t border-white/5 pt-6 text-center text-[10px] text-slate-500 leading-normal">
              Admin login: <span className="text-indigo-400 font-mono">HR-001</span> (pwd: <span className="text-indigo-400 font-mono">password123</span>)
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
