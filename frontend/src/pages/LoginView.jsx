import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Shield, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const LoginView = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState(null);
  const [step, setStep] = useState('phone');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/request-otp', { phone });
      setDemoOtp(res.data.demo_otp || null);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.error || "User not found. Please register first.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/verify-otp', { phone, otp });
      login(res.data, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-page justify-center flex flex-col items-center p-8 animate-in fade-in duration-500 relative">
      <div className="w-16 h-16 bg-navy-gradient rounded-3xl shadow-xl flex items-center justify-center mb-6">
        <Shield size={32} className="text-emerald" />
      </div>
      <h2 className="text-3xl font-bold text-navy-800 text-center leading-none">GigShield AI</h2>
      <p className="text-slate-400 text-xs mt-3 uppercase tracking-widest font-bold">Parametric Protection for Gig Workers</p>

      <div className="w-full max-w-[340px] mt-12 bg-white p-6 rounded-3xl shadow-soft border border-slate-100">
        {step === 'phone' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
             <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
               <input
                 type="tel"
                 placeholder="+91 98765 43210"
                 className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-navy-900 outline-none transition-all"
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 required
               />
             </div>
             {error && <p className="text-danger text-[11px] font-bold text-center">{error}</p>}
             <button
               type="submit"
               disabled={loading}
               className="w-full bg-navy-900 text-white p-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
             >
               {loading ? 'Sending...' : 'Request OTP'} <ArrowRight size={16} />
             </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
             {demoOtp && (
               <div className="bg-emerald-soft/50 p-4 rounded-2xl border border-emerald/10 text-center mb-2">
                  <p className="text-[10px] font-bold text-emerald uppercase tracking-widest leading-none">Demo OTP (Test Only)</p>
                  <p className="text-2xl font-black text-emerald mt-2 tracking-[0.3em]">{demoOtp}</p>
                  <p className="text-[9px] text-emerald opacity-70 mt-2 font-medium italic underline">In production, this arrives via SMS</p>
               </div>
             )}
             <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">6-Digit Verification Code</label>
               <input
                 type="text"
                 maxLength="6"
                 placeholder="Enter code"
                 className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center text-xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-navy-900 outline-none transition-all uppercase"
                 value={otp}
                 onChange={(e) => setOtp(e.target.value)}
                 required
               />
             </div>
             {error && <p className="text-danger text-[11px] font-bold text-center">{error}</p>}
             <button
               type="submit"
               disabled={loading}
               className="w-full bg-navy-900 text-white p-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
             >
               {loading ? 'Verifying...' : 'Unlock Dashboard'} <CheckCircle2 size={16} />
             </button>
             <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-slate-400 text-[11px] font-bold uppercase tracking-widest hover:text-navy-900"
             >
                Wrong number?
             </button>
          </form>
        )}
      </div>

      <p className="mt-8 text-slate-400 text-xs font-medium">
        First time here? <NavLink to="/register" className="text-navy-900 font-bold underline">Create Profile</NavLink>
      </p>
    </div>
  );
};

export default LoginView;
