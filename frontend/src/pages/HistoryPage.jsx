import React from 'react';
import { ChevronRight } from 'lucide-react';
import Badge from '../component/Badge';
import { useAuth } from '../context/AuthContext';
import useProtectionData from '../hooks/useProtectionData';

const HistoryPage = () => {
  const { user } = useAuth();
  const { activities } = useProtectionData();

  if (!user?.isPremium) return <div className="p-8 text-center text-slate-300 italic">History unavailable for basic accounts.</div>;

  return (
    <div className="space-y-4 px-4 pb-32 animate-in fade-in duration-700">
       <div className="flex items-center justify-between px-1 pt-2">
          <h2 className="text-2xl font-black text-navy-800 tracking-tight italic uppercase">Protection Logs</h2>
          <Badge variant="live">Real-time</Badge>
       </div>
       <div className="space-y-4 mt-6">
          {activities.map((log, i) => (
            <div key={i} className="bg-white p-5 rounded-[28px] shadow-soft border border-slate-50 relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={16} className="text-slate-300" />
               </div>
               <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black bg-navy-900 text-white px-2 py-1 rounded-lg uppercase leading-none shadow-sm">{new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-[11px] text-slate-400 font-bold tracking-tighter">{new Date(log.timestamp).toLocaleDateString('en-IN')}</span>
               </div>
               <p className="text-sm text-slate-600 font-medium leading-normal italic">
                  "Environmental stress detected. Latitude {log.location?.lat?.toFixed(3) || '?'}, Longitude {log.location?.lng?.toFixed(3) || '?'}. System confirmed critical threshold breach."
               </p>
            </div>
          ))}
          {activities.length === 0 && <p className="text-center p-12 text-slate-300 font-bold uppercase opacity-30">Sensors quiet.</p>}
       </div>
    </div>
  );
};

export default HistoryPage;
