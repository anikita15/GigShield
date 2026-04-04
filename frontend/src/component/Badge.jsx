import React from 'react';

const Badge = ({ children, variant = 'live' }) => {
  const styles = {
    live: 'bg-emerald-soft text-emerald border border-emerald/20 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1 uppercase',
    automatic: 'bg-white/10 text-white/90 border border-white/20 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase',
    payout: 'bg-emerald text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase',
    red: 'bg-danger text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
    premium: 'bg-navy-900 text-emerald border border-emerald/30 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase'
  };

  return (
    <span className={styles[variant]}>
      {variant === 'live' && <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />}
      {children}
    </span>
  );
};

export default Badge;
