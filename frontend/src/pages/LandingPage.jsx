import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Zap, Activity, Clock, Database, ChevronRight, Lock, CheckCircle2, PlayCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-navy-900 text-white font-['Outfit',sans-serif] selection:bg-emerald/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-900/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald/10 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Shield className="text-emerald w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">GigShield AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-bold">
            <NavLink to="/login" className="text-slate-300 hover:text-white transition-colors">Login</NavLink>
            <NavLink to="/register" className="bg-emerald text-navy-900 px-6 py-2.5 rounded-full hover:bg-emerald/90 transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              Start Protection
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
        {/* Abstract background blobs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald/10 border border-emerald/20 text-emerald text-xs font-bold uppercase tracking-widest">
              <Zap className="w-3 h-3" />
              <span>Parametric Insurance</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
              Protect your income <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald to-teal-400">automatically</span> when you can't work.
            </h1>
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
              GigShield AI monitors your gig accounts and local triggers. The moment you face involuntary downtime, we trigger an instant payout directly to your bank.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <NavLink to="/register" className="bg-emerald text-navy-900 px-8 py-4 rounded-full font-bold hover:bg-emerald/90 transition-all active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-2">
                Start Protection <ChevronRight className="w-5 h-5" />
              </NavLink>
              <NavLink to="/demo-console" className="px-8 py-4 rounded-full font-bold border border-white/10 hover:bg-white/5 transition-all text-white flex items-center gap-2">
                <PlayCircle className="w-5 h-5 opacity-70" /> View Demo
              </NavLink>
            </div>
          </div>
          
          {/* Dashboard Mockup - Glass Card */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 fill-mode-both hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald/20 to-transparent blur-3xl rounded-full" />
            <div className="relative bg-navy-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl overflow-hidden ring-1 ring-white/5">
               <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5 rounded-t-2xl">
                 <div className="w-3 h-3 rounded-full bg-danger" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500" />
                 <div className="w-3 h-3 rounded-full bg-emerald shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
               </div>
               <div className="p-6 space-y-6">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Active Coverage</p>
                     <p className="text-3xl font-bold text-white tracking-tight mt-1">₹500 <span className="text-lg text-slate-500 font-medium">/ day</span></p>
                   </div>
                   <div className="bg-emerald/10 text-emerald px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-emerald/20">
                     <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" /> Active
                   </div>
                 </div>
                 
                 <div className="space-y-3">
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-all cursor-default hover:scale-[1.02]">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                         <Activity className="w-6 h-6" />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-white">Uber (Driving)</p>
                         <p className="text-xs text-slate-400">Monitored 24/7</p>
                       </div>
                     </div>
                     <CheckCircle2 className="text-emerald w-6 h-6 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                   </div>
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-all cursor-default hover:scale-[1.02]">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 border border-orange-500/20">
                         <Database className="w-6 h-6" />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-white">Zomato (Delivery)</p>
                         <p className="text-xs text-slate-400">Risk Score: Low</p>
                       </div>
                     </div>
                     <CheckCircle2 className="text-emerald w-6 h-6 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-6 relative bg-navy-800/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 tracking-tight">How It Works</h2>
            <p className="text-slate-400 text-lg">Four seamless steps from monitoring to money in your bank, completely autonomous.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Activity, title: 'Activity', desc: 'Connect your gig platforms. We monitor your work patterns securely.', color: 'text-blue-400', shadow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]', borderHover: 'hover:border-blue-500/30' },
              { icon: Database, title: 'Risk', desc: 'Our AI analyzes local data, weather, and traffic to assess risk in real-time.', color: 'text-purple-400', shadow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]', borderHover: 'hover:border-purple-500/30' },
              { icon: Lock, title: 'Trigger', desc: 'If conditions meet the policy index (e.g., severe flood), the policy triggers.', color: 'text-orange-400', shadow: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]', borderHover: 'hover:border-orange-500/30' },
              { icon: Zap, title: 'Payout', desc: 'Instant cash payout sent directly to your account. No claims process.', color: 'text-emerald', shadow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]', borderHover: 'hover:border-emerald/30' },
            ].map((step, idx) => (
              <div key={idx} className={`relative group p-8 rounded-3xl bg-navy-900 border border-white/5 transition-all duration-300 ${step.shadow} ${step.borderHover} hover:-translate-y-2`}>
                <div className="absolute top-0 right-8 -translate-y-1/2 w-12 h-12 bg-navy-800 rounded-full border border-white/10 flex items-center justify-center font-black text-slate-500 group-hover:text-emerald transition-colors">
                  {idx + 1}
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 bg-white/5 border border-white/10`}>
                  <step.icon className={`w-7 h-7 ${step.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Credibility */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="grid gap-6">
              {[
                { title: 'AI-Powered Detection', desc: 'Advanced machine learning models accurately verify work interruptions with 99% precision.', icon: Database },
                { title: 'Real-Time Monitoring', desc: 'Continuous tracking ensures you are covered the second disaster strikes.', icon: Clock },
                { title: 'Fraud-Resistant System', desc: 'Multi-layered logic and immutable ledger tech prevents fraud and ensures transparent payouts.', icon: Shield },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all hover:scale-[1.01] cursor-default">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald/10 border border-emerald/20 flex items-center justify-center">
                    <item.icon className="text-emerald w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-8 lg:pl-12">
               <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">Enterprise-grade security for the <span className="text-emerald block">gig economy.</span></h2>
               <p className="text-lg text-slate-400">
                 We've stripped away the bureaucracy of traditional insurance. 
                 By heavily utilizing parametric triggers and real-time APIs, 
                 we ensure complete transparency, no investigations, and zero fraud.
               </p>
               <div className="flex items-center gap-12 pt-6">
                 <div>
                   <p className="text-5xl font-extrabold text-white">0s</p>
                   <p className="text-sm font-bold tracking-widest text-emerald uppercase mt-2">Claim Wait</p>
                 </div>
                 <div className="w-px h-16 bg-white/10" />
                 <div>
                   <p className="text-5xl font-extrabold text-white">100%</p>
                   <p className="text-sm font-bold tracking-widest text-emerald uppercase mt-2">Autonomous</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Bottom Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-emerald/10 border border-emerald/20 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald/20 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-3xl font-bold mb-4">Ready to secure your income?</h2>
          <p className="text-emerald hover:text-emerald/80 transition-colors mb-8 max-w-lg mx-auto text-sm">Join thousands of gig workers building a smarter, safer financial future with GigShield AI.</p>
          <div className="flex justify-center gap-4">
              <NavLink to="/register" className="bg-emerald text-navy-900 px-8 py-4 rounded-full font-bold hover:bg-emerald/90 transition-all active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                Start Protection Now
              </NavLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 bg-navy-900 text-center">
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" /> © 2026 GigShield AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
