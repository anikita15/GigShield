import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserPlus, ShieldCheck } from 'lucide-react';
import api from '../api/client';

const RegisterView = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await api.post('/auth/register', formData);
      setMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-page justify-center flex flex-col items-center p-8 animate-in fade-in duration-500 relative">
      <div className="w-16 h-16 bg-navy-gradient rounded-3xl shadow-xl flex items-center justify-center mb-6">
        <UserPlus size={32} className="text-emerald" />
      </div>
      <h2 className="text-2xl font-bold text-navy-800 text-center">Get GigShield Protection</h2>
      <p className="text-slate-400 text-[11px] mt-2 uppercase tracking-widest font-bold">Secure your gig income today</p>

      <div className="w-full max-w-[340px] mt-8 bg-white p-6 rounded-3xl shadow-soft border border-slate-100">
          {message && <p className="text-emerald text-[11px] font-bold text-center mb-4">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
             {[
               { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Rahul Sharma' },
               { label: 'Email Address', field: 'email', type: 'email', placeholder: 'rahul@example.com' },
               { label: 'Mobile Number', field: 'phone', type: 'tel', placeholder: '+91 98765 43210' }
             ].map(i => (
               <div key={i.field} className="space-y-1">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{i.label}</label>
                 <input
                   type={i.type}
                   placeholder={i.placeholder}
                   className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-navy-900 outline-none transition-all"
                   value={formData[i.field]}
                   onChange={(e) => setFormData({...formData, [i.field]: e.target.value})}
                   required
                 />
               </div>
             ))}
             {error && <p className="text-danger text-[11px] font-bold text-center">{error}</p>}
             <button
               type="submit"
               disabled={loading}
               className="w-full bg-navy-gradient text-white p-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 mt-4 hover:brightness-110 active:scale-95 disabled:opacity-50"
             >
               {loading ? 'Creating...' : 'Create Profile'} <ShieldCheck size={18} />
             </button>
          </form>
      </div>

      <NavLink to="/login" className="mt-6 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-navy-900">
         Already Registered? Login
      </NavLink>
    </div>
  );
};

export default RegisterView;
