import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, ShieldCheck, ArrowRight, Lock, Mail, CheckCircle } from 'lucide-react';
import { Button } from '../components/common/Button';

export function Login() {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('anant@constructa.demo');
  const [password, setPassword] = useState('Demo@123');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide an email');
      return;
    }
    const result = login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleQuickRole = (roleKey, roleEmail) => {
    setEmail(roleEmail);
    setPassword('Demo@123');
    switchRole(roleKey);
    navigate('/');
  };

  return (
    <div className="min-h-screen w-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-blue-500/20 font-sans">
      {/* Container */}
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-md mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            CONSTRUCTA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 uppercase font-semibold tracking-wider">
            Enterprise Construction Project Management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sign In to Workspace</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Access architectural plans, engineering deliverables, and construction schedules
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anant@constructa.demo"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <span className="text-[11px] text-slate-400">Demo: Demo@123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full font-semibold shadow-xs mt-2"
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to CONSTRUCTA
            </Button>
          </form>

          {/* Quick Demo Role Selection */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Quick Demo Role Sign-In</span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickRole('superadmin', 'anant@constructa.demo')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left transition-colors group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Super Admin (Anant Sharma)
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">anant@constructa.demo • Full Executive Access</div>
                </div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Log in →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('admin', 'priya@constructa.demo')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left transition-colors group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Admin PM (Priya Patel)
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">priya@constructa.demo • Tasks & Project Oversight</div>
                </div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Log in →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('employee', 'rajesh@constructa.demo')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left transition-colors group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Employee (Rajesh Verma)
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">rajesh@constructa.demo • Field Specialist Actions</div>
                </div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Log in →
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-slate-400">
          <span>CONSTRUCTA Enterprise Construction SaaS • Interactive Prototype</span>
        </div>
      </div>
    </div>
  );
}
