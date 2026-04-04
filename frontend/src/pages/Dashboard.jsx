import React from 'react';
import { CloudRain, Wallet, CheckCircle2, AlertCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import Badge from '../component/Badge';
import { useAuth } from '../context/AuthContext';
import useProtectionData from '../hooks/useProtectionData';
import UpgradeView from './UpgradeView';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const Dashboard = () => {
  const { user } = useAuth();
  const { riskScore, payouts, activities, loading } = useProtectionData();

  if (!user?.isPremium) return <UpgradeView />;

  const totalEarningsToday = payouts
    .filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, p) => sum + p.amount, 0);

  const timelineData = activities.slice(0, 3).map(log => ({
    time: new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    label: `Monitoring: Zone ${log.location?.lat?.toFixed(1) || '?'}, ${log.location?.lng?.toFixed(1) || '?'}`,
    icon: CloudRain,
    status: 'complete'
  })).reverse();

  if (payouts.length > 0 && new Date(payouts[0].createdAt).toDateString() === new Date().toDateString()) {
     timelineData.push({
        time: 'Now',
        label: `${fmt(payouts[0].amount)} Income Secured`,
        icon: Wallet,
        status: 'payout'
     });
  }

  return (
    <div className="space-y-6 px-4 md:px-0 pb-32 md:pb-12 animate-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-navy-gradient p-6 rounded-3xl text-white shadow-soft relative overflow-hidden ring-1 ring-white/10 h-full flex flex-col justify-between">
          <Sparkles className="absolute -right-6 -top-6 text-white/5 w-32 h-32" />
          <div>
            <Badge variant="automatic">Sentinel Tier Active</Badge>
            <h1 className="text-2xl font-bold mt-4 leading-tight">
              You are protected. Compensation triggers automatically.
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-4 leading-relaxed font-medium">
            Real-time weather, traffic & pollution risk monitoring active in your zone.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 h-full flex flex-col justify-between">
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Compensation Received Today</h2>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black text-navy-900 tracking-tight">{fmt(totalEarningsToday)}</span>
              <span className="text-emerald text-xs font-black uppercase tracking-tighter animate-pulse">Live</span>
            </div>
          </div>
          <div className="bg-emerald-soft/30 p-3 rounded-2xl flex items-start gap-3 mt-6 border border-emerald/5 uppercase">
            <ShieldCheck size={16} className="text-emerald mt-0.5 shrink-0" />
            <p className="text-[11px] text-emerald leading-normal font-black">
              Automated Logic. No Claims Required.
            </p>
          </div>
        </div>

        <div className="bg-danger p-6 rounded-3xl text-white shadow-soft flex items-center justify-between relative overflow-hidden group h-full">
          <div className="absolute inset-0 bg-red-gradient opacity-60" />
          <div className="relative z-10 w-full flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
               <div>
                 <h2 className="text-[10px] font-bold text-rose-200 tracking-widest uppercase">Current Env Risk</h2>
                 <div className="flex items-center gap-1 mt-1">
                    <span className="text-6xl font-black tracking-tight">{loading ? '--' : riskScore}</span>
                    <span className="text-rose-200 font-bold text-xl">%</span>
                 </div>
               </div>
               <div className="text-right mt-2">
                  <p className="text-2xl font-black italic uppercase tracking-tighter">{riskScore >= 50 ? 'Critical' : 'Stable'}</p>
                  <p className="text-[10px] text-rose-100 opacity-80 uppercase font-bold mt-1 tracking-widest">Continuous AI Sync</p>
               </div>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 p-2 opacity-5 scale-150 transition-transform group-hover:scale-110 pointer-events-none">
             <AlertCircle size={100} />
          </div>
        </div>
      </div>

      {/* Bottom Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100">
          <div className="flex items-end justify-between mb-8 border-b border-slate-50 pb-4">
            <h2 className="text-xl font-bold text-navy-800 leading-none tracking-tight underline decoration-emerald decoration-4 underline-offset-4">Protection Timeline</h2>
            <Badge variant="live">Sensor Stream</Badge>
          </div>

          <div className="relative pl-8 space-y-8">
             <div className="absolute left-3.5 top-2 bottom-6 w-0.5 bg-slate-50 border-l border-dashed border-slate-200" />
             {timelineData.length === 0 && <p className="text-xs text-slate-300 italic py-4">Waiting for first sensor pulse...</p>}
             {timelineData.map((step, idx) => (
               <div key={idx} className="relative group">
                  <div className={`absolute -left-7 top-0 w-7 h-7 rounded-full flex items-center justify-center z-10 shadow-sm transition-all group-hover:scale-110 ${
                    step.status === 'payout' ? 'bg-navy-900 text-emerald' : 'bg-emerald text-white'
                  }`}>
                    {step.status === 'payout' ? <Zap size={14} /> : <CheckCircle2 size={16} />}
                  </div>
                  <div className={step.status === 'payout' ? 'bg-navy-900/5 p-4 rounded-2xl border border-navy-900/5 transition-colors hover:bg-navy-900/10' : 'py-1'}>
                     <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-bold text-slate-400 opacity-80 uppercase leading-none tracking-widest">{step.time}</p>
                        {step.status === 'payout' && <Badge variant="payout">Success</Badge>}
                     </div>
                     <p className={`text-sm font-bold ${step.status === 'payout' ? 'text-navy-900' : 'text-slate-600'}`}>{step.label}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
        
        {/* Empty Placeholder for Second Column to retain layout */}
        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 border-dashed flex items-center justify-center text-slate-400 hidden lg:flex flex-col gap-3">
            <Sparkles className="opacity-20 w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-widest">More Analytics Coming Soon</span>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
