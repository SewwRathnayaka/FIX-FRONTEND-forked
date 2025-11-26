import React, { useState, useEffect, useMemo } from "react";
import { MessageSquare, Calendar, Clock, MapPin, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useUser } from '@clerk/clerk-react';
import { HandymanAPI } from "@/lib/api";
import { useTranslation } from "react-i18next";

interface Booking {
  _id: string;
  serviceName: string;
  clientName?: string;
  location: {
    address: string;
  };
  scheduledTime: string;
  status: string;
}

const TodaySchedule = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodayBookings = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const response = await HandymanAPI.getProviderBookingsByClerkUserId(user.id);
        
        if (response.success && response.data) {
          // Filter bookings scheduled for today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          const todayBookings = response.data.filter((booking: Booking) => {
            const scheduledDate = new Date(booking.scheduledTime);
            scheduledDate.setHours(0, 0, 0, 0);
            const isToday = scheduledDate >= today && scheduledDate < tomorrow;
            const isIncomplete = booking.status !== 'completed' && booking.status !== 'rejected';
            return isToday && isIncomplete;
          });

          // Sort by scheduled time
          todayBookings.sort((a: Booking, b: Booking) => 
            new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
          );

          setBookings(todayBookings);
        }
      } catch (error) {
        console.error('Error fetching today\'s bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayBookings();
  }, [user?.id]);

  const handleChat = (bookingId: string) => {
    navigate(`/handyman/chat/${bookingId}`);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      'pending': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Pending' },
      'accepted': { bg: 'bg-green-100', text: 'text-green-700', label: 'Accepted' },
      'paid': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Paid' },
      'done': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Work Done' },
      'completed': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Completed' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    
    return (
      <Badge className={`${config.bg} ${config.text} border-2 border-current px-3 py-1 text-xs font-semibold`}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100">
        <CardContent className="p-8 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
          <p className="text-lg text-gray-600">Loading today's schedule...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100">
      <CardHeader className="bg-gradient-to-r from-green-50 to-orange-50 p-6 border-b border-green-200">
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-green-600" />
          Today's Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {bookings.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600">No bookings scheduled for today.</p>
            <p className="text-sm text-gray-500 mt-2">Check back later or view your upcoming schedule.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <div 
                key={booking._id} 
                className="p-4 sm:p-6 hover:bg-green-50/50 transition-colors duration-200"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                        {booking.serviceName || 'Service'}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {booking.clientName && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{booking.clientName}</span>
                        </div>
                      )}
                      {booking.location?.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{booking.location.address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-green-700">{formatTime(booking.scheduledTime)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      onClick={() => handleChat(booking._id)}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      size="sm"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaySchedule;
