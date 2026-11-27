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
    <div className="min-h-screen w-screen bg-[#F6F6F2] flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-[#A77B50]/20">
      {/* Container */}
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#202824] border border-[#A77B50]/30 text-[#A77B50] shadow-lg mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242B27] font-heading tracking-wider">
            CONSTRUCTA
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1 tracking-widest uppercase font-semibold">
            Architectural & Construction Project Management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl border border-[#E7E9E3] p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#242B27]">Sign In to Workspace</h2>
            <p className="text-xs text-[#777F79] mt-0.5">
              Access architectural plans, engineering deliverables, and construction schedules
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-[#C66C62]/10 border border-[#C66C62]/30 text-[#C66C62] text-xs mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#242B27]">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#777F79] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anant@constructa.demo"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E7E9E3] bg-[#F6F6F2] text-xs text-[#242B27] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[#242B27]">Password</label>
                <span className="text-[11px] text-[#777F79]">Demo: Demo@123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#777F79] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E7E9E3] bg-[#F6F6F2] text-xs text-[#242B27] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full font-semibold shadow-md mt-2"
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to CONSTRUCTA
            </Button>
          </form>

          {/* Quick Demo Role Selection */}
          <div className="mt-8 pt-6 border-t border-[#E7E9E3]">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#777F79] mb-3 flex items-center justify-between">
              <span>Quick Demo Role Sign-In</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#A77B50]" />
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickRole('superadmin', 'anant@constructa.demo')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[#E7E9E3] hover:border-[#202824] hover:bg-[#F6F6F2] text-left transition-colors group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-[#242B27] group-hover:text-[#A77B50]">
                    Super Admin (Anant Sharma)
                  </div>
                  <div className="text-[10px] text-[#777F79]">anant@constructa.demo • Full Executive Access</div>
                </div>
                <span className="text-xs font-semibold text-[#A77B50] opacity-0 group-hover:opacity-100 transition-opacity">
                  Log in →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('admin', 'priya@constructa.demo')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[#E7E9E3] hover:border-[#A77B50] hover:bg-[#A77B50]/10 text-left transition-colors group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-[#242B27] group-hover:text-[#A77B50]">
                    Admin PM (Priya Patel)
                  </div>
                  <div className="text-[10px] text-[#777F79]">priya@constructa.demo • Tasks & Project Oversight</div>
                </div>
                <span className="text-xs font-semibold text-[#A77B50] opacity-0 group-hover:opacity-100 transition-opacity">
                  Log in →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('employee', 'rajesh@constructa.demo')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-[#E7E9E3] hover:border-[#657A6A] hover:bg-[#657A6A]/10 text-left transition-colors group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-[#242B27] group-hover:text-[#657A6A]">
                    Employee (Rajesh Verma)
                  </div>
                  <div className="text-[10px] text-[#777F79]">rajesh@constructa.demo • Field Specialist Actions</div>
                </div>
                <span className="text-xs font-semibold text-[#657A6A] opacity-0 group-hover:opacity-100 transition-opacity">
                  Log in →
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-[#777F79]">
          <span>CONSTRUCTA Enterprise Construction SaaS • Interactive Prototype</span>
        </div>
      </div>
    </div>
  );
}
