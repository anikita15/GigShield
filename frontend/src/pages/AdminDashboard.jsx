import React, { useState, useEffect } from 'react';
import { Shield, Activity, ShieldAlert, BadgeCheck, FileText, Banknote } from 'lucide-react';
import api from '../api/client';

import MapVisual from '../component/MapVisual';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [frauds, setFrauds] = useState([]);
  const [userState, setUserState] = useState({}); // New state for map pins

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data.data);
        const payoutsRes = await api.get('/admin/payouts');
        setPayouts(payoutsRes.data.data);
        const fraudRes = await api.get('/admin/fraud-flags');
        setFrauds(fraudRes.data.data);
        
        // Fetch current telemetry without resetting
        const demoRes = await api.get('/demo/state');
        if (demoRes.data.state) {
            setUserState(demoRes.data.state);
        }
      } catch (err) {
        console.error("Admin fetch error", err);
        setErrorMsg(err.response?.data?.error || err.message || "Failed to load admin stats");
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval);
  }, []);

  if (errorMsg) return <div className="text-center mt-20 p-6 bg-rose-900/20 text-rose-400 font-bold border border-rose-500 max-w-lg mx-auto rounded-xl">Authentication Error: {errorMsg}. Are you logged in as the Admin (Phone 0000000000)?</div>;
  if (!stats) return <div className="text-center mt-20 text-slate-400">Loading Command Center...</div>;

  const mapUsers = userState ? Object.values(userState) : [];

  return (
    <div className="w-full space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <ShieldAlert className="text-indigo-400" size={28} />
        <h1 className="text-2xl font-black text-white tracking-tight">Enterprise Command Center</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Banknote, label: 'Total Payouts', value: `₹${stats.totalPayoutValue}`, border: 'border-emerald/30', bg: 'bg-emerald/10', txt: 'text-emerald' },
          { icon: Activity, label: 'Protected Value', value: `₹${stats.todayProtected}`, border: 'border-indigo-500/30', bg: 'bg-indigo-900/20', txt: 'text-indigo-300' },
          { icon: Shield, label: 'Fraud Blocks', value: stats.blockedPayouts, border: 'border-rose-500/30', bg: 'bg-rose-900/20', txt: 'text-rose-400' },
          { icon: FileText, label: 'Fraud Rate', value: stats.fraudRate, border: 'border-amber-500/30', bg: 'bg-amber-900/20', txt: 'text-amber-400' }
        ].map((card, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${card.border} bg-[#0D121F] shadow-lg`}>
            <card.icon className={`${card.txt} mb-2`} size={20} />
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{card.label}</p>
            <p className={`text-2xl font-black ${card.txt}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* NEW: Geographic Visual */}
      <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
          <MapVisual users={mapUsers} />
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Latest Payouts */}
        <div className="bg-[#0D121F] border border-slate-800 rounded-2xl p-5 shadow-xl overflow-hidden flex flex-col h-96">
          <h2 className="text-sm text-slate-300 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <BadgeCheck className="text-emerald" size={16}/> Successful Payouts
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3">
             {payouts.length === 0 ? <p className="text-slate-500 text-xs">No payouts yet.</p> :
               payouts.map((p, i) => (
               <div key={i} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                 <div>
                    <p className="text-emerald font-bold text-sm">₹{p.amount} <span className="text-slate-400 font-medium text-[10px] ml-2 select-all">#{p.transactionId}</span></p>
                    <p className="text-xs text-slate-300 mt-0.5">{p.userId?.name || 'Unknown User'}</p>
                    {p.reason && <p className="text-[10px] text-slate-500 italic mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">AI Reason: {p.reason}</p>}
                 </div>
                 <div className="px-3 py-1 bg-emerald/10 border border-emerald/20 text-emerald text-[10px] uppercase font-bold rounded">
                   Paid
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Fraud Blocks */}
        <div className="bg-[#0D121F] border border-slate-800 rounded-2xl p-5 shadow-xl overflow-hidden flex flex-col h-96">
          <h2 className="text-sm text-slate-300 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldAlert className="text-rose-400" size={16}/> Security Interventions
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3">
             {frauds.length === 0 ? <p className="text-slate-500 text-xs">No active fraud flags.</p> :
               frauds.map((f, i) => (
               <div key={i} className="flex flex-col p-3 bg-slate-800/50 rounded-lg border border-rose-500/20">
                 <div className="flex justify-between items-center mb-2">
                    <p className="text-rose-400 font-bold text-sm select-none">Blocked Alert</p>
                    <div className="px-2 py-0.5 bg-rose-900/40 text-rose-300 text-[10px] uppercase font-bold rounded border border-rose-500/20">
                      Fraud Caught
                    </div>
                 </div>
                 <p className="text-xs text-slate-400 italic mb-2">{f.reason}</p>
                 <p className="text-[10px] text-slate-500 uppercase">Target: {f.userId?.name || 'Unknown User'}</p>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
