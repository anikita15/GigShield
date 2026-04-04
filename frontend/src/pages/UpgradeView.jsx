import React, { useState } from 'react';
import { Star, ShieldCheck, Sparkles, Zap, Clock, ChevronRight, ChevronLeft, Bike, Car, Building2, Moon, Sun, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const QUESTIONS = [
  {
    id: 'platform',
    title: 'Which platform do you deliver for?',
    subtitle: 'Select your primary gig platform',
    options: [
      { label: 'Swiggy', value: 'swiggy', risk: 1.0 },
      { label: 'Zomato', value: 'zomato', risk: 1.0 },
      { label: 'Dunzo / Zepto', value: 'dunzo', risk: 1.1 },
      { label: 'Amazon Flex', value: 'amazon', risk: 0.9 },
      { label: 'Other / Multiple', value: 'other', risk: 1.05 },
    ],
  },
  {
    id: 'city',
    title: 'What type of city do you work in?',
    subtitle: 'City size affects environmental risk exposure',
    options: [
      { label: 'Metro (Delhi, Mumbai, Bengaluru, etc.)', value: 'metro', risk: 1.3, icon: Building2 },
      { label: 'Tier-2 (Jaipur, Lucknow, Pune, etc.)', value: 'tier2', risk: 1.1, icon: MapPin },
      { label: 'Tier-3 or Smaller', value: 'tier3', risk: 0.9, icon: MapPin },
    ],
  },
  {
    id: 'vehicle',
    title: 'What vehicle do you use?',
    subtitle: 'Vehicle type determines accident & weather exposure',
    options: [
      { label: 'Bicycle', value: 'bicycle', risk: 1.4 },
      { label: 'Two-Wheeler (Bike / Scooter)', value: 'two_wheeler', risk: 1.2 },
      { label: 'Auto / Three-Wheeler', value: 'auto', risk: 1.0 },
      { label: 'Car', value: 'car', risk: 0.8 },
    ],
  },
  {
    id: 'hours',
    title: 'How many hours do you work per week?',
    subtitle: 'More hours = more exposure = higher coverage needed',
    options: [
      { label: 'Less than 20 hours', value: 'lt20', risk: 0.8 },
      { label: '20 – 40 hours', value: '20_40', risk: 1.0 },
      { label: '40 – 60 hours', value: '40_60', risk: 1.2 },
      { label: '60+ hours (Full-time)', value: 'gt60', risk: 1.4 },
    ],
  },
  {
    id: 'shift',
    title: 'Do you work night shifts?',
    subtitle: 'Night deliveries carry higher environmental risk',
    options: [
      { label: 'Day shifts only', value: 'day', risk: 1.0, icon: Sun },
      { label: 'Mostly night shifts', value: 'night', risk: 1.3, icon: Moon },
      { label: 'Mixed / Rotating', value: 'mixed', risk: 1.15, icon: Clock },
    ],
  },
];

const BASE_PREMIUM = 79; // ₹79 base weekly premium

const calculatePremium = (answers) => {
  let multiplier = 1;
  QUESTIONS.forEach(q => {
    const selected = q.options.find(o => o.value === answers[q.id]);
    if (selected) multiplier *= selected.risk;
  });
  const raw = Math.round(BASE_PREMIUM * multiplier);
  // Round to nearest ₹5 for clean pricing
  return Math.round(raw / 5) * 5;
};

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const UpgradeView = () => {
  const { updateUserInfo } = useAuth();
  const [step, setStep] = useState(0); // 0..4 = questions, 5 = result
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentQ = QUESTIONS[step];
  const isComplete = step >= QUESTIONS.length;
  const premium = isComplete ? calculatePremium(answers) : 0;
  const maxPayout = premium * 8; // weekly coverage ~8x premium

  const selectOption = (value) => {
    const updated = { ...answers, [currentQ.id]: value };
    setAnswers(updated);
    setTimeout(() => setStep(s => s + 1), 300);
  };

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/subscribe', { weeklyPremium: premium });
      updateUserInfo({ isPremium: true, tier: 'sentinel', weeklyPremium: res.data.weeklyPremium ?? premium });
    } catch (err) {
      setError(err.response?.data?.error || 'Upgrade failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Questionnaire Steps ──
  if (!isComplete) {
    return (
      <div className="px-4 py-6 flex flex-col items-center animate-in fade-in duration-300">
        {/* Progress */}
        <div className="w-full max-w-[380px] mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Profile</span>
            <span className="text-[10px] font-bold text-navy-900">{step + 1} / {QUESTIONS.length}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 w-full max-w-[380px] relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald/10 blur-[60px] rounded-full" />

          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-navy-900 transition-colors mb-6 uppercase tracking-widest"
            >
              <ChevronLeft size={14} /> Back
            </button>
          )}

          <h2 className="text-xl font-black text-navy-800 leading-tight relative z-10">{currentQ.title}</h2>
          <p className="text-[11px] text-slate-400 mt-2 font-medium leading-relaxed">{currentQ.subtitle}</p>

          <div className="mt-8 space-y-3">
            {currentQ.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => selectOption(opt.value)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all active:scale-[0.97] group ${
                  answers[currentQ.id] === opt.value
                    ? 'bg-navy-900 text-white border-navy-900 shadow-lg'
                    : 'bg-slate-50 text-navy-800 border-slate-100 hover:border-emerald/30 hover:bg-emerald-soft/20'
                }`}
              >
                <span className="text-sm font-bold">{opt.label}</span>
                <ChevronRight size={16} className={answers[currentQ.id] === opt.value ? 'text-emerald' : 'text-slate-300 group-hover:text-emerald'} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Result / Pricing Screen ──
  return (
    <div className="px-4 py-6 flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 text-center w-full max-w-[380px] relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald/10 blur-[60px] rounded-full" />

        <div className="w-16 h-16 bg-navy-gradient rounded-[24px] shadow-lg flex items-center justify-center mx-auto mb-6 relative z-10">
          <Star className="text-emerald" size={32} fill="currentColor" />
        </div>

        <p className="text-[10px] font-bold text-emerald uppercase tracking-[0.2em]">Your Personalised Plan</p>
        <h2 className="text-3xl font-black text-navy-800 leading-none mt-2">Sentinel Protection</h2>

        {/* Premium Breakdown */}
        <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Weekly Premium</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-4xl font-black text-navy-900">{fmt(premium)}</span>
            <span className="text-slate-400 font-bold mb-1">/week</span>
          </div>
          <p className="text-[9px] text-emerald font-bold mt-2 uppercase">GST Included • Cancel Anytime</p>

          <div className="mt-4 pt-4 border-t border-slate-200/60 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Max Payout</p>
              <p className="text-lg font-black text-navy-900">{fmt(maxPayout)}</p>
              <p className="text-[8px] text-slate-400">per incident</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Monthly Cost</p>
              <p className="text-lg font-black text-navy-900">{fmt(premium * 4)}</p>
              <p className="text-[8px] text-slate-400">approx</p>
            </div>
          </div>
        </div>

        {/* What's Covered */}
        <div className="mt-8 space-y-4 text-left">
          {[
            { icon: ShieldCheck, title: 'Parametric Insurance', desc: 'Automatic payouts when sensor thresholds are breached — rain, pollution, extreme heat.' },
            { icon: Zap, title: 'AI Risk Monitoring', desc: 'Real-time hazard detection across your delivery zone using satellite & IoT data.' },
            { icon: Clock, title: 'Zero-Claim Payouts', desc: 'No paperwork, no phone calls. Compensation hits your bank account automatically.' },
          ].map((b, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-soft flex items-center justify-center shrink-0 mt-0.5">
                <b.icon size={14} className="text-emerald" />
              </div>
              <div>
                <p className="text-sm font-bold text-navy-900 leading-none">{b.title}</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-tight">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full bg-navy-gradient text-white p-5 rounded-2xl font-bold text-sm mt-8 shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Activating Protection...' : 'Activate Sentinel Now'} <Sparkles size={18} />
        </button>

        {error && <p className="text-danger text-xs font-bold mt-4 text-center">{error}</p>}

        <button
          onClick={() => { setStep(0); setAnswers({}); }}
          className="mt-4 text-[11px] text-slate-400 font-bold uppercase tracking-widest hover:text-navy-900 transition-colors"
        >
          Retake Questionnaire
        </button>

        <p className="text-[10px] text-slate-300 mt-4 leading-tight italic">
          Auto-billed weekly via UPI / Card. Instant coverage from activation.
        </p>
      </div>

      {/* Risk Profile Summary */}
      <div className="w-full max-w-[380px] mt-6 bg-white/60 backdrop-blur-sm p-5 rounded-3xl border border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Your Risk Profile</p>
        <div className="space-y-2">
          {QUESTIONS.map(q => {
            const selected = q.options.find(o => o.value === answers[q.id]);
            return (
              <div key={q.id} className="flex justify-between items-center">
                <span className="text-[11px] text-slate-500 font-medium">{q.title.replace('?', '')}</span>
                <span className="text-[11px] font-bold text-navy-900 bg-slate-50 px-2 py-0.5 rounded-lg">{selected?.label || '—'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UpgradeView;
