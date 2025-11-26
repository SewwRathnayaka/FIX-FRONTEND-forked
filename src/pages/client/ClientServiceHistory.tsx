import { useState, useEffect } from "react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { useUser } from '@clerk/clerk-react';
import { BookingsAPI } from "@/lib/api";
import { useTranslation } from "react-i18next";

const ClientServiceHistory = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedBookings = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const response = await BookingsAPI.getMyBookings();
        if (response.success && response.data) {
          // Filter only completed bookings
          const completedBookings = response.data.filter((booking: any) => 
            booking.status === 'completed'
          );
          setBookings(completedBookings);
        }
      } catch (error) {
        console.error('Error fetching completed bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedBookings();
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <ClientDashboardLayout title="Service History">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-600">Loading service history...</p>
        </div>
      </ClientDashboardLayout>
    );
  }

  return (
    <ClientDashboardLayout title="Service History">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No completed services yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking._id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 border-2 border-gray-100 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
                      {booking.providerName?.charAt(0) || 'H'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-extrabold text-lg text-gray-800 mb-1">{booking.serviceName || 'Service'}</h3>
                      <p className="text-gray-600 text-sm mb-1">by {booking.providerName || 'Handyman'}</p>
                      <p className="text-gray-500 text-sm">Date: {formatDate(booking.scheduledTime || booking.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-green-100 text-green-700 border-2 border-green-300 mb-2">
                      Completed
                    </span>
                    <p className="font-extrabold text-lg text-gray-800 mt-2">
                      ${booking.fee ? booking.fee.toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientDashboardLayout>
  );
};

export default ClientServiceHistory;
