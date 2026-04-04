import React from 'react';
import Badge from './Badge';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user } = useAuth();
  return (
    <header className="md:hidden flex items-center justify-between p-4 sticky top-0 bg-neutral-page/80 backdrop-blur-md z-40">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shadow-soft">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} alt="Avatar" />
        </div>
        <div>
          <span className="font-bold text-navy-800 text-sm leading-none block">GigShield AI</span>
          <span className="text-[9px] text-slate-400 font-medium">Parametric Protection</span>
        </div>
      </div>
      <Badge variant="live">System Active</Badge>
    </header>
  );
};

export default Header;
