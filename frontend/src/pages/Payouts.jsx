import React from 'react';
import { Wallet, TrendingUp } from 'lucide-react';
import Badge from '../component/Badge';
import { useAuth } from '../context/AuthContext';
import useProtectionData from '../hooks/useProtectionData';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const Payouts = () => {
  const { user } = useAuth();
  const { payouts } = useProtectionData();

  if (!user?.isPremium) return <div className="p-8 text-center"><Badge variant="red">Protection Inactive</Badge><p className="mt-4 text-xs font-bold text-slate-400 uppercase">Upgrade to Sentinel to view payouts</p></div>;

  const total = payouts.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4 px-4 pb-32 animate-in fade-in duration-700">
       <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-emerald-soft rounded-2xl flex items-center justify-center mb-4 text-emerald shadow-inner">
             <Wallet size={24} />
          </div>
          <h2 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Total Compensation Disbursed</h2>
          <span className="text-5xl font-black text-navy-900 mt-2 block tracking-tight italic">{fmt(total)}</span>
       </div>

       <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mt-8 mb-4">Transaction History</h3>
       <div className="space-y-3">
          {payouts.map((p, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl shadow-soft border border-slate-50 flex justify-between items-center group hover:border-emerald/20 transition-all">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-emerald group-hover:bg-emerald-soft transition-all">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-navy-900 group-hover:text-emerald transition-all">{fmt(p.amount)}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-bold tracking-widest">{new Date(p.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
               </div>
               <div className="text-right flex flex-col items-end gap-1">
                  <Badge variant="payout">Auto</Badge>
                  <span className="text-[9px] font-bold text-slate-300 italic tracking-tighter">Parametric</span>
               </div>
            </div>
          ))}
          {payouts.length === 0 && <p className="text-center p-12 text-slate-300 text-sm font-bold uppercase tracking-widest opacity-40">No payouts yet</p>}
       </div>
    </div>
  );
};

export default Payouts;
