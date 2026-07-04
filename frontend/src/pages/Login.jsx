import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Shield, Mail, Lock, User as UserIcon, Eye, EyeOff, Building } from 'lucide-react';

export default function Login() {
  const { user, setUser, showToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user]);

  const [dbStatus, setDbStatus] = useState('connecting');
  const [isSignUp, setIsSignUp] = useState(false);

  // Signin fields
  const [signinLoginId, setSigninLoginId] = useState('');
  const [signinPassword, setSigninPassword] = useState('');

  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupCompanyName, setSignupCompanyName] = useState('');
  const [signupCompanyLogo, setSignupCompanyLogo] = useState('');
  const [signupIsHR, setSignupIsHR] = useState(false);

  // Verification & OTP state
  const [showDevVerify, setShowDevVerify] = useState(false);
  const [devVerifyLink, setDevVerifyLink] = useState('');
  const [generatedLoginId, setGeneratedLoginId] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');

  // Passwords toggles
  const [showSignInPwd, setShowSignInPwd] = useState(false);
  const [showSignUpPwd, setShowSignUpPwd] = useState(false);

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
        body: JSON.stringify({ loginId: signinLoginId, password: signinPassword })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.user.role === 'HR') {
        showToast('HR Account detected. Redirecting to Admin app...', 'info');
        setTimeout(() => {
          window.location.href = 'http://localhost:5174/';
        }, 1500);
        return;
      }

      showToast('Welcome back, ' + data.user.name, 'success');
      setUser(data.user);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (signupPassword !== signupConfirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    const role = signupIsHR ? 'HR' : 'Employee';
    const emailToRegister = signupEmail;
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          role,
          companyName: signupCompanyName,
          companyLogo: signupCompanyLogo
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      showToast(data.message, 'success');
      setGeneratedLoginId(data.loginId);
      setRegisteredEmail(emailToRegister);

      // Reset signup fields
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setSignupCompanyName('');
      setSignupCompanyLogo('');
      setSignupIsHR(false);

      if (data.verificationLinkDevOnly) {
        setDevVerifyLink(data.verificationLinkDevOnly);
        setShowDevVerify(true);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail, otp: otpInput })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      showToast('Account verified! You can now log in.', 'success');
      setShowDevVerify(false);
      setSigninLoginId(generatedLoginId); // Pre-fill the login id field!
      setIsSignUp(false); // Toggle view to Sign In!
      setOtpInput('');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const getPasswordStrength = () => {
    if (!signupPassword) return { text: 'Password must be 6+ chars with letters & numbers', width: '0%', color: 'bg-slate-700', textColor: 'text-slate-500' };
    let score = 0;
    if (signupPassword.length >= 6) score += 1;
    if (/[A-Za-z]/.test(signupPassword)) score += 1;
    if (/[0-9]/.test(signupPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(signupPassword)) score += 1;

    if (score <= 1) return { text: 'Weak password', width: '25%', color: 'bg-red-500', textColor: 'text-red-500' };
    if (score === 2) return { text: 'Medium strength', width: '50%', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    if (score === 3) return { text: 'Strong password!', width: '75%', color: 'bg-emerald-500', textColor: 'text-emerald-500' };
    return { text: 'Excellent password!', width: '100%', color: 'bg-indigo-500', textColor: 'text-indigo-500' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/5 bg-slate-950/80 px-8 py-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-extrabold shadow-lg shadow-indigo-500/25">H</div>
          <span className="font-display text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">HRMS Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-xs font-semibold">
            <span className={`h-2.5 w-2.5 rounded-full shadow-lg ${
              dbStatus === 'online' ? 'bg-emerald-500 shadow-emerald-500/30' :
              dbStatus === 'offline' ? 'bg-amber-500 shadow-amber-500/30' : 'bg-red-500 shadow-red-500/30'
            }`} />
            {dbStatus === 'online' ? 'Database Online' :
             dbStatus === 'offline' ? 'Database Offline (Dev Mode)' : 'Server Offline'}
          </span>
          <a href="http://localhost:5174/" className="text-xs font-bold text-indigo-400 hover:underline">HR Console ➜</a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          
          {!isSignUp ? (
            /* Sign In Card */
            <div className="glass-panel">
              <h2 className="font-display text-2xl font-bold tracking-tight text-white text-center">Welcome Back</h2>
              <p className="mt-1 text-xs text-slate-400 text-center">Sign in to access your employee attendance and slips.</p>
              
              <form onSubmit={handleSignIn} className="mt-8 space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Login ID / Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={signinLoginId} 
                      onChange={e => setSigninLoginId(e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-slate-900/60 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:border-indigo-500/50 focus:bg-slate-900/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10" 
                      placeholder="EMP-XXXXXX or HR-XXXXXX" 
                      required 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input 
                      type={showSignInPwd ? "text" : "password"} 
                      value={signinPassword} 
                      onChange={e => setSigninPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-slate-900/60 py-3.5 pl-11 pr-11 text-sm text-white placeholder-slate-500 transition-all focus:border-indigo-500/50 focus:bg-slate-900/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10" 
                      placeholder="••••••••" 
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowSignInPwd(!showSignInPwd)}
                      className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                    >
                      {showSignInPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:translate-y-[-1px] hover:shadow-indigo-500/35 active:translate-y-0">
                  Sign In to Account
                </button>
              </form>

              <div className="mt-6 border-t border-white/5 pt-4 text-center">
                <p className="text-xs text-slate-400">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setIsSignUp(true)} className="text-indigo-400 font-semibold hover:underline focus:outline-none">
                    Sign Up
                  </button>
                </p>
              </div>

              <div className="mt-6 text-center text-[10px] text-slate-500">
                Employee login: <span className="text-indigo-400 font-mono">EMP-001</span> (pwd: <span className="text-indigo-400 font-mono">password123</span>)
              </div>
            </div>
          ) : (
            /* Sign Up Card */
            <div className="glass-panel">
              <h2 className="font-display text-2xl font-bold tracking-tight text-white text-center">Create Account</h2>
              <p className="mt-1 text-xs text-slate-400 text-center">Register a new profile in the organization database.</p>
              
              <form onSubmit={handleSignUp} className="mt-6 space-y-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    <input 
                      type="text" 
                      value={signupName} 
                      onChange={e => setSignupName(e.target.value)}
                      className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none" 
                      placeholder="Alex Carter" 
                      required 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    <input 
                      type="email" 
                      value={signupEmail} 
                      onChange={e => setSignupEmail(e.target.value)}
                      className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none" 
                      placeholder="alex.carter@company.com" 
                      required 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                    <input 
                      type="text" 
                      value={signupCompanyName} 
                      onChange={e => setSignupCompanyName(e.target.value)}
                      className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none" 
                      placeholder="Innovate Tech" 
                    />
                  </div>
                </div>

                {/* Password fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                      <input 
                        type={showSignUpPwd ? "text" : "password"} 
                        value={signupPassword} 
                        onChange={e => setSignupPassword(e.target.value)}
                        className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 pl-8 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none" 
                        placeholder="••••••••" 
                        required 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowSignUpPwd(!showSignUpPwd)}
                        className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                      >
                        {showSignUpPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                      <input 
                        type={showSignUpPwd ? "text" : "password"} 
                        value={signupConfirmPassword} 
                        onChange={e => setSignupConfirmPassword(e.target.value)}
                        className="w-full rounded-lg border border-white/5 bg-slate-900/60 py-2 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none" 
                        placeholder="••••••••" 
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* Strength indicator */}
                <div className="mt-1 flex flex-col gap-1">
                  <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full transition-all duration-350 ${strength.width} ${strength.color}`} />
                  </div>
                  <span className={`text-[9px] text-right font-medium ${strength.textColor}`}>{strength.text}</span>
                </div>

                <div className="flex items-center gap-3 border-t border-white/5 pt-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Register as HR Officer?</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input 
                      type="checkbox" 
                      checked={signupIsHR} 
                      onChange={e => setSignupIsHR(e.target.checked)} 
                      className="peer sr-only" 
                    />
                    <div className="peer h-5 w-9 rounded-full border border-white/5 bg-white/5 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-500 peer-checked:after:translate-x-full" />
                  </label>
                  <span className={`text-xs font-bold ${signupIsHR ? 'text-purple-400' : 'text-indigo-400'}`}>
                    {signupIsHR ? 'HR' : 'Staff'}
                  </span>
                </div>

                <button type="submit" className="w-full rounded-xl border border-indigo-500/20 bg-indigo-500/5 py-2.5 text-xs font-semibold text-indigo-300 transition-all hover:bg-indigo-500/10 hover:border-indigo-500/30">
                  Create New Account
                </button>
              </form>

              <div className="mt-6 border-t border-white/5 pt-4 text-center">
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setIsSignUp(false)} className="text-indigo-400 font-semibold hover:underline focus:outline-none">
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Dev Verification & Generated Login ID Modal with OTP input */}
      {showDevVerify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-display font-bold text-white text-base">Account Generated</h3>
              <button onClick={() => setShowDevVerify(false)} className="text-slate-400 hover:text-white text-xl">&times;</button>
            </div>
            
            <div className="mt-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-center">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Generated Login ID</span>
              <div className="font-display font-black text-2xl text-white tracking-widest mt-1 select-all">{generatedLoginId}</div>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">Please enter the 6-digit OTP code sent to your email to verify.</p>
            </div>

            {/* OTP Code Form */}
            <form onSubmit={handleVerifyOtpSubmit} className="mt-4 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">6-Digit OTP Code</label>
                <input 
                  type="text" 
                  value={otpInput}
                  onChange={e => setOtpInput(e.target.value)}
                  maxLength={6}
                  placeholder="e.g. 123456" 
                  className="w-full text-center tracking-widest font-mono text-xl rounded-lg border border-white/5 bg-slate-900/60 py-2.5 text-white focus:outline-none" 
                  required
                />
              </div>
              <button type="submit" className="w-full rounded-xl bg-indigo-500 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-600 transition-all">
                Verify OTP & Complete Signup
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
