
import React, { useState, useEffect } from "react";
import { useUser, useAuth } from '@clerk/clerk-react';

interface StatsData {
  totalEarnings: number;
  pendingAmount: number;
  transactionCount: number;
  jobsCompleted: number;
  averageRating: number;
}

const StatsCards = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [stats, setStats] = useState<StatsData>({
    totalEarnings: 0,
    pendingAmount: 0,
    transactionCount: 0,
    jobsCompleted: 0,
    averageRating: 0,
  });

  useEffect(() => {
    if (user?.id && getToken) {
      fetchStats();
    }
  }, [user?.id, getToken]);

  const fetchStats = async () => {
    if (!user?.id || !getToken) return;

    try {
      const token = await getToken();
      
      // Fetch payment stats
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const paymentResponse = await fetch(`${API_BASE_URL}/stripe/payments/my`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user.id,
          'X-User-Type': 'provider',
        },
      });

      if (paymentResponse.ok) {
        const paymentResult = await paymentResponse.json();
        if (paymentResult.success && paymentResult.data.summary) {
          setStats(prev => ({
            ...prev,
            totalEarnings: paymentResult.data.summary.totalEarnings,
            pendingAmount: paymentResult.data.summary.pendingAmount,
            transactionCount: paymentResult.data.summary.transactionCount,
          }));
        }
      }

      // Fetch booking stats (jobs completed)
      const bookingsResponse = await fetch(`${API_BASE_URL}/bookings/my`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user.id,
          'X-User-Type': 'provider',
        },
      });

      if (bookingsResponse.ok) {
        const bookingsResult = await bookingsResponse.json();
        if (bookingsResult.success && bookingsResult.data) {
          const completedJobs = bookingsResult.data.filter(
            (booking: any) => booking.status === 'completed' || booking.status === 'done'
          ).length;
          
          setStats(prev => ({
            ...prev,
            jobsCompleted: completedJobs,
          }));
        }
      }

    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/20 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="text-sm font-semibold text-gray-500 mb-2">Total Earnings</div>
          <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-1">
            ${stats.totalEarnings.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">from {stats.transactionCount} transactions</div>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/20 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="text-sm font-semibold text-gray-500 mb-2">Jobs Completed</div>
          <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-1">
            {stats.jobsCompleted}
          </div>
          <div className="text-xs text-gray-400">completed successfully</div>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="text-sm font-semibold text-gray-500 mb-2">Average Rating</div>
          <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-1">
            4.8
          </div>
          <div className="text-xs text-gray-400">based on reviews</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
