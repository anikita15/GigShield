import React from 'react';
import { LogOut, Smartphone, CheckCircle2, Star, Lock, Sparkles } from 'lucide-react';
import Badge from '../component/Badge';
import { useAuth } from '../context/AuthContext';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const Profile = () => {
  const { user, logout } = useAuth();

  const trustScorePercent = Math.round((user?.trustScore || 0.8) * 100);
  const circumference = 2 * Math.PI * 32;
  const strokeDashoffset = circumference - (trustScorePercent / 100) * circumference;
  const weeklyPremium = user?.weeklyPremium || 99;

  return (
    <div className="space-y-4 px-4 pb-32 animate-in slide-in-from-right-8 duration-500">
       <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex items-center gap-4">
          <div className="w-16 h-16 rounded-[22px] bg-navy-gradient p-0.5 border-2 border-emerald/20 overflow-hidden shadow-lg rotate-3">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} alt="Avatar" className="rounded-[20px] bg-slate-100" />
          </div>
          <div className="flex-1">
             <h2 className="text-lg font-black text-navy-800 leading-none">{user?.name || 'Worker'}</h2>
             <p className="text-[10px] text-slate-400 mt-1 font-medium">{user?.phone || '+91 XXXXX XXXXX'}</p>
             <div className="flex items-center gap-2 mt-2">
                <Badge variant={user?.isPremium ? 'premium' : 'live'}>{user?.tier || 'Basic'}</Badge>
                {user?.isPremium && <CheckCircle2 size={12} className="text-emerald" />}
             </div>
          </div>
          <button onClick={logout} className="p-3.5 bg-slate-50 text-slate-300 rounded-2xl hover:text-danger hover:bg-red-50 hover:shadow-soft transition-all flex items-center justify-center">
             <LogOut size={22} />
          </button>
       </div>

       <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex flex-col items-center">
             <div className="relative w-20 h-20 flex items-center justify-center mb-4">
               <svg className="w-full h-full -rotate-90">
                 <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                 <circle cx="40" cy="40" r="32" fill="none" stroke="#10b981" strokeWidth="6"
                   strokeDasharray={circumference}
                   strokeDashoffset={strokeDashoffset}
                   strokeLinecap="round" />
               </svg>
               <span className="absolute text-xl font-black text-navy-900">{trustScorePercent}</span>
             </div>
             <h3 className="text-xs font-bold text-navy-800 uppercase tracking-widest leading-none">Trust Score</h3>
             <p className="text-[10px] text-slate-400 mt-2 italic font-medium">Verified Status</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex flex-col items-center">
             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner text-slate-300">
                <Smartphone size={28} />
             </div>
             <h3 className="text-xs font-bold text-navy-800 uppercase tracking-widest leading-none">Payment</h3>
             <p className="text-[10px] text-slate-400 mt-2 font-medium">UPI Link Pending</p>
          </div>
       </div>

       <div className={`mt-8 p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl transition-all ${user?.isPremium ? 'bg-black' : 'bg-navy-700 opacity-60'}`}>
          <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-emerald/10 blur-[80px]" />
          <div className="relative z-10">
             <div className="flex items-center justify-between">
                <Badge variant={user?.isPremium ? 'automatic' : 'red'}>{user?.isPremium ? 'Pro Status' : 'Limited Tier'}</Badge>
                {user?.isPremium ? <Star size={24} className="text-emerald" fill="currentColor" /> : <Lock size={20} className="text-white/40" />}
             </div>
             <h1 className="text-4xl font-black mt-4 tracking-tighter uppercase italic leading-none">Sentinel</h1>
             <p className="text-[11px] text-slate-400 leading-relaxed mt-4 font-bold opacity-80 uppercase tracking-widest">
                {user?.isPremium ? 'Autonomous Risk Defence Active' : 'Upgrade to activate AI Sentinel Mode'}
             </p>
             {user?.isPremium && (
               <>
                 <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Weekly Premium</p>
                      <p className="text-lg font-black text-emerald">{fmt(weeklyPremium)}/week</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Coverage</p>
                      <p className="text-lg font-black text-white">{fmt(weeklyPremium * 8)}</p>
                    </div>
                 </div>
                 <div className="mt-4 flex items-center gap-3">
                    <Sparkles size={16} className="text-emerald animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald">IRDAI Compliance Ready</span>
                 </div>
               </>
             )}
          </div>
       </div>
    </div>
  );
};

export default Profile;
