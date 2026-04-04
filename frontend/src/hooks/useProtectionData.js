import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const useProtectionData = (interval = 5000) => {
  const [data, setData] = useState({
    riskScore: 0,
    payouts: [],
    activities: [],
    loading: true,
    error: null,
  });
  const { user, token } = useAuth();

  const fetchData = useCallback(async () => {
    if (!token || !user) return;
    if (!user.isPremium) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }
    try {
      const [riskRes, payoutRes, activityRes] = await Promise.all([
        api.get(`/risk/latest/${user._id}`),
        api.get('/payout/me'),
        api.get(`/activity/${user._id}`)
      ]);

      setData({
        riskScore: Math.round((riskRes.data.risk_score || 0) * 100),
        payouts: payoutRes.data.data || [],
        activities: activityRes.data.data || [],
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Sync failed:", err.message);
      setData(prev => ({ ...prev, loading: false, error: err.message }));
    }
  }, [user, token]);

  useEffect(() => {
    let isMounted = true;

    const safeFetch = async () => {
      if (isMounted) await fetchData();
    };

    safeFetch();

    // Pause polling when tab is not visible
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible' && isMounted) {
        fetchData();
      }
    }, interval);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [fetchData, interval]);

  return data;
};

export default useProtectionData;
