import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import PrivateRoute from '../component/PrivateRoute';
import Header from '../component/Header';
import BottomNav from '../component/BottomNav';
import LoginView from '../pages/LoginView';
import RegisterView from '../pages/RegisterView';
import Dashboard from '../pages/Dashboard';
import Payouts from '../pages/Payouts';
import HistoryPage from '../pages/HistoryPage';
import Profile from '../pages/Profile';
import LandingPage from '../pages/LandingPage';
import DemoTerminal from '../pages/DemoTerminal';

const ProtectedLayout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-neutral-page font-['Outfit',sans-serif]">
      <BottomNav />
      <div className="flex-1 w-full max-w-5xl mx-auto md:p-8 pb-24 md:pb-8 relative">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-page font-['Outfit',sans-serif] text-navy-900 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo-console" element={<DemoTerminal />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />

          <Route element={<PrivateRoute><ProtectedLayout /></PrivateRoute>}>
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/payouts" element={<Payouts />} />
             <Route path="/history" element={<HistoryPage />} />
             <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
