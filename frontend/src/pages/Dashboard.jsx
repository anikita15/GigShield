import React from 'react';
import { CloudRain, Wallet, CheckCircle2, AlertCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import Badge from '../component/Badge';
import { useAuth } from '../context/AuthContext';
import useProtectionData from '../hooks/useProtectionData';
import UpgradeView from './UpgradeView';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import io from 'socket.io-client';
import confetti from 'canvas-confetti';

const Dashboard = () => {
  const { user, token } = useAuth();
  const { riskScore, payouts, activities, loading, fetchData } = useProtectionData();
  const [showVictory, setShowVictory] = React.useState(null);

  // Real-time Payout Listener
  React.useEffect(() => {
    if (!token) return;
    
    const socket = io(window.location.origin, {
      auth: { token },
      path: '/socket.io/'
    });

    socket.on('payout_triggered', (data) => {
      setShowVictory(data);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#064E3B', '#34D399']
      });
      // Refresh local data to show the new payout in timeline
      fetchData();
    });

    return () => socket.disconnect();
  }, [token, fetchData]);

  if (!user?.isPremium) return <UpgradeView />;

  const totalEarningsToday = payouts
    .filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, p) => sum + p.amount, 0);

  // Derive mock chart data for demo vibrancy
  const chartData = [
    { name: '10:00', risk: 24 },
    { name: '11:00', risk: 36 },
    { name: '12:00', risk: Math.max(10, riskScore - 15) },
    { name: 'Now', risk: riskScore },
  ];

  const radarData = [
    { subject: 'Weather', A: riskScore > 50 ? 95 : 20, fullMark: 100 },
    { subject: 'Traffic', A: riskScore > 50 ? 70 : 40, fullMark: 100 },
    { subject: 'Behavior', A: 90, fullMark: 100 },
    { subject: 'Location', A: 85, fullMark: 100 },
    { subject: 'History', A: 98, fullMark: 100 },
  ];

  const timelineData = activities.slice(0, 3).map(log => ({
    time: new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    label: `Monitoring: Zone ${log.location?.lat?.toFixed(1) || '?'}, ${log.location?.lng?.toFixed(1) || '?'}`,
    icon: CloudRain,
    status: 'complete'
  })).reverse();

  if (payouts.length > 0 && new Date(payouts[0].createdAt).toDateString() === new Date().toDateString()) {
     const p = payouts[0];
     timelineData.push({
        time: 'Now',
        label: `${fmt(p.amount)} Income Secured`,
        subLabel: p.reason || "Automated trigger due to environmental hazard parity.",
        txId: p.transactionId,
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
                     {step.subLabel && <p className="text-[10px] text-slate-500 mt-1 italic">{step.subLabel}</p>}
                     {step.txId && <p className="text-[8px] text-slate-400 mt-2 font-mono">TX_ID: {step.txId}</p>}
                  </div>
               </div>
             ))}
          </div>
        </div>
        
        {/* Real-time Analytics Chart */}
        <div className="bg-white p-3 md:p-6 rounded-3xl shadow-soft border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-navy-800 uppercase tracking-widest">Risk Exposure Scan</h2>
                <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold tracking-tighter">Rolling 6H</span>
            </div>
            <div className="flex-1 min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="risk" 
                            stroke="#ef4444" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorRisk)" 
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-4">
                <div className="flex-1">
                    <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Threat Status</p>
                    <p className="text-xs font-black text-rose-500 italic uppercase">Parametric Parity Active</p>
                </div>
                <Zap size={20} className="text-amber-400 opacity-30 animate-pulse" />
            </div>
        </div>
      </div>

      {/* NEW: AI Logic Breakdown (Radar) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-navy-900 border border-white/10 p-6 rounded-3xl shadow-soft flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center mb-4 border border-emerald/20">
                <Sparkles className="text-emerald" size={32} />
             </div>
             <h3 className="text-white font-bold text-lg">AI Logic Breakdown</h3>
             <p className="text-slate-400 text-xs mt-2 px-4 italic">
                Our Sentinel engine analyzes 5 multi-dimensional vectors to calculate your live protection parity.
             </p>
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex items-center justify-center min-h-[300px]">
             <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                  <Radar
                    name="Risk Factors"
                    dataKey="A"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.5}
                  />
                </RadarChart>
             </ResponsiveContainer>
          </div>
      </div>

      {/* Victory Modal overlap */}
      {showVictory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm" onClick={() => setShowVictory(null)} />
           <div className="relative bg-white rounded-[40px] shadow-2xl p-8 max-w-sm w-full text-center border-4 border-emerald animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-emerald rounded-full flex items-center justify-center mx-auto -mt-16 border-8 border-white shadow-lg">
                 <Zap className="text-white fill-white" size={40} />
              </div>
              <h2 className="text-3xl font-black text-navy-900 mt-6 leading-none tracking-tight underline decoration-emerald decoration-8 underline-offset-4 decoration-skip-ink-none">Income Secured!</h2>
              <p className="text-4xl font-black text-emerald mt-4">₹{showVictory.amount}</p>
              <div className="bg-slate-50 p-4 rounded-2xl mt-6 border border-slate-100 text-left">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Reasoning</p>
                 <p className="text-xs text-navy-800 font-medium leading-relaxed italic">"{showVictory.reason}"</p>
              </div>
              <p className="text-[10px] text-slate-400 mt-6 font-mono break-all opacity-50 uppercase">TX: {showVictory.transactionId}</p>
              <button 
                onClick={() => setShowVictory(null)}
                className="w-full bg-navy-900 text-white font-bold py-4 rounded-2xl mt-8 hover:bg-navy-800 transition-colors shadow-lg"
              >
                Close Trace
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
