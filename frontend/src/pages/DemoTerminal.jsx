import React, { useState, useEffect, useRef } from 'react';
import { Shield, Sparkles, Activity, AlertTriangle, CheckCircle, RefreshCcw, Zap, Terminal, Database, Server } from 'lucide-react';
import api from '../api/client';

const DemoTerminal = () => {
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({ payouts: 0, fraudPrevented: 0, blocks: 0 });
  const [liveNodes, setLiveNodes] = useState(null);
  const consoleEndRef = useRef(null);

  const log = (msg, type = 'info') => {
    setOutput(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
  };

  const executeCommand = async (commandUrl, commandName) => {
    setLoading(true);
    log(`Executing: ${commandName}...`, 'command');
    
    try {
      const res = await api.post(commandUrl);
      
      if (res.data.beforeVsAfter) {
         setLiveNodes(res.data.beforeVsAfter.after);
      } else if (res.data.state) {
         setLiveNodes(res.data.state);
      }

      if (res.data.explainability_matrix) {
        log('--- TRIGGER ENGINE EXPLAINABILITY OUTPUT ---', 'header');
        res.data.explainability_matrix.forEach(item => {
           let type = 'info';
           if (item.status === 'Approved') type = 'success';
           if (item.status === 'Blocked') type = 'error';
           if (item.status === 'Under Review') type = 'warn';

           log(`[${item.userId}] Status: ${item.status} | Confidence: ${(item.confidenceScore * 100).toFixed(1)}%`, type);
           log(`↳ Reason: ${item.explainability}`, 'text');
        });
      }

      if (res.data.metrics) {
         setMetrics({
           payouts: res.data.metrics.totalPayoutsIssued,
           fraudPrevented: res.data.metrics.fraudPreventedValue,
           blocks: res.data.metrics.payoutsBlocked
         });
      }

      log(`Success: ${res.data.message || 'Sequence complete.'}`, 'success');
    } catch (err) {
      log(`Error: ${err.response?.data?.message || err.message}`, 'error');
    }
    setLoading(false);
  };

  // Auto-scroll console to bottom on new output
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const getStatusColor = (status) => {
      switch(status) {
          case 'paid': return 'text-emerald bg-emerald/10 border-emerald/20';
          case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
          case 'failed': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
          default: return 'text-slate-400 bg-slate-800 border-slate-700';
      }
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] text-slate-300 font-mono p-4 md:p-8 flex flex-col md:flex-row gap-6">
      
      {/* Sidebar Controls & Metrics */}
      <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
        <div className="bg-navy-900 rounded-xl border border-white/5 p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald" />
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="text-emerald" />
            <h1 className="text-white font-bold tracking-widest uppercase text-sm">Investor Demo</h1>
          </div>

          <div className="space-y-3">
            <button 
              disabled={loading}
              onClick={() => executeCommand('/demo/reset', 'INITIALIZING CLEAN DETERMINISTIC STATE')}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition border border-white/5 disabled:opacity-50"
            >
              <span className="text-xs font-bold text-white uppercase">1. Reset Environment</span>
              <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            
            <button 
              disabled={loading}
              onClick={() => executeCommand('/demo/simulate_fraud', 'INJECTING IMPOSSIBLE ACTIVITY TELEMETRY')}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-rose-900/30 hover:bg-rose-900/50 transition border border-rose-500/20 disabled:opacity-50 text-rose-300"
            >
              <span className="text-xs font-bold uppercase">1b. Run Fraud Scenario</span>
              <AlertTriangle size={14} />
            </button>
            
            <button 
              disabled={loading}
              onClick={() => executeCommand('/demo/simulate_crisis', 'SIMULATING HAZARD EVENT')}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-900/30 hover:bg-indigo-900/50 transition border border-indigo-500/20 disabled:opacity-50 text-indigo-300"
            >
              <span className="text-xs font-bold uppercase">2. Inject Heavy Rain Risk</span>
              <AlertTriangle size={14} />
            </button>

            <button 
              disabled={loading}
              onClick={() => executeCommand('/demo/fire_engine', 'FIRING TRIGGER ENGINE')}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-emerald-900/30 hover:bg-emerald-900/50 transition border border-emerald-500/20 disabled:opacity-50 text-emerald-400"
            >
              <span className="text-xs font-bold uppercase">3. Execute Inference</span>
              <Zap size={14} />
            </button>
          </div>
        </div>

        <div className="bg-navy-900 rounded-xl border border-white/5 p-6 shadow-2xl space-y-4">
           <h2 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Commercial Impact Metrics</h2>
           <div>
             <p className="text-3xl font-black text-white">₹{metrics.payouts}</p>
             <p className="text-xs text-slate-400">Total Valid Payouts</p>
           </div>
           <div className="pt-4 border-t border-white/5">
             <p className="text-3xl font-black text-emerald">₹{metrics.fraudPrevented}</p>
             <p className="text-xs text-slate-400">Fraud Prevention Saving</p>
           </div>
           <div className="pt-4 border-t border-white/5">
             <p className="text-3xl font-black text-rose-400">{metrics.blocks}</p>
             <p className="text-xs text-slate-400">Anomalies Handled</p>
           </div>
        </div>
      </div>

      {/* Main Terminal View */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Node Visualizer */}
        <div className="bg-navy-900 rounded-xl border border-white/5 p-6 shadow-2xl">
           <div className="flex items-center gap-2 mb-4">
             <Server size={14} className="text-slate-400" />
             <h2 className="text-xs text-white uppercase tracking-widest font-bold">Live DB State</h2>
           </div>
           
           {!liveNodes ? (
               <p className="text-xs text-slate-500 italic">No state loaded. Click 'Reset Environment' to seed database.</p>
           ) : (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(liveNodes).map(([id, node]) => (
                     <div key={id} className={`p-4 rounded-lg border ${node.hasFraud ? 'bg-rose-900/10 border-rose-500/20' : 'bg-slate-800 border-white/5'}`}>
                        <div className="flex justify-between items-center mb-3">
                           <span className={`text-sm font-bold ${node.hasFraud ? 'text-rose-400' : 'text-white'}`}>{node.name}</span>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(node.payoutStatus)}`}>
                              Payout: {node.payoutStatus}
                           </span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                           <span>Trust Score:</span>
                           <span className={node.trustScore > 0.8 ? 'text-emerald' : 'text-amber-400'}>{node.trustScore}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                           <span>Live Env Risk:</span>
                           <span className={node.riskScore > 0.5 ? 'text-indigo-400 font-bold' : ''}>{node.riskScore}</span>
                        </div>
                     </div>
                  ))}
               </div>
           )}
        </div>

        {/* Explainability Console */}
        <div className="bg-[#05080f] rounded-xl border border-white/5 p-6 flex-1 shadow-2xl overflow-y-auto font-mono text-xs leading-relaxed space-y-1 relative">
           <div className="sticky top-0 bg-[#05080f] pb-2 mb-2 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-2"><Database size={12}/> Explainability Output Feed</span>
           </div>
           
           {output.length === 0 && <p className="text-slate-600">Awaiting deterministic instructions...</p>}

           {output.map((line, i) => (
             <div key={i} className="flex gap-4 group">
               <span className="text-slate-600 shrink-0 select-none">[{line.time}]</span>
               <span className={`
                 ${line.type === 'command' ? 'text-indigo-400 font-bold' : ''}
                 ${line.type === 'success' ? 'text-emerald' : ''}
                 ${line.type === 'error' ? 'text-rose-400' : ''}
                 ${line.type === 'warn' ? 'text-amber-400' : ''}
                 ${line.type === 'header' ? 'text-white font-bold mt-4 block' : ''}
                 ${line.type === 'text' ? 'text-slate-400 italic' : ''}
                 ${line.type === 'info' ? 'text-slate-300' : ''}
               `}>
                 {line.msg}
               </span>
             </div>
           ))}
           <div ref={consoleEndRef} />
        </div>

      </div>
    </div>
  );
};

export default DemoTerminal;
