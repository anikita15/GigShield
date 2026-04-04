import React from 'react';
import { Navigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-neutral-page animate-pulse"><Shield size={48} className="text-slate-200" /></div>;
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
