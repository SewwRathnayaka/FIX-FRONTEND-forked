
import React, { useState, useEffect, useMemo } from "react";
import { useUser } from '@clerk/clerk-react';
import HandymanDashboardLayout from "@/components/handyman/HandymanDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin, User, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { HandymanAPI } from "@/lib/api";

interface Booking {
  _id: string;
  serviceName: string;
  clientName?: string;
  location: {
    address: string;
  };
  scheduledTime: string;
  status: string;
  fee?: number;
}

const HandymanSchedule = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const response = await HandymanAPI.getProviderBookingsByClerkUserId(user.id);
        
        if (response.success && response.data) {
          // Filter only incomplete future bookings (scheduled time is in the future and status is not completed/rejected)
          const now = new Date();
          const futureBookings = response.data.filter((booking: Booking) => {
            const scheduledDate = new Date(booking.scheduledTime);
            const isFuture = scheduledDate >= now;
            const isIncomplete = booking.status !== 'completed' && booking.status !== 'rejected';
            return isFuture && isIncomplete;
          });

          // Sort by scheduled time
          futureBookings.sort((a: Booking, b: Booking) => 
            new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
          );

          setBookings(futureBookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  // Filter bookings for the selected date
  const bookingsForDate = useMemo(() => {
    const selectedDate = new Date(currentDate);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    return bookings.filter(booking => {
      const bookingDate = new Date(booking.scheduledTime);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate >= selectedDate && bookingDate < nextDate;
    });
  }, [bookings, currentDate]);

  // Group bookings by date for calendar view
  const bookingsByDate = useMemo(() => {
    const grouped: Record<string, Booking[]> = {};
    bookings.forEach(booking => {
      const dateKey = format(new Date(booking.scheduledTime), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(booking);
    });
    return grouped;
  }, [bookings]);

  function prevDay() {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() - 1);
      return d;
    });
  }
  
  function nextDay() {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + 1);
      return d;
    });
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      'accepted': { bg: 'bg-green-100', text: 'text-green-700', label: 'Accepted' },
      'paid': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Paid' },
      'done': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Work Done' },
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    
    return (
      <Badge className={`${config.bg} ${config.text} border-2 border-current px-3 py-1 text-xs font-semibold`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <HandymanDashboardLayout title="Schedule" subtitle="View your upcoming bookings and appointments">
      <div className="space-y-6">
        {/* Date Navigation */}
        <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={prevDay}
                className="rounded-full border-2 border-gray-300 hover:bg-gray-50 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  {format(currentDate, "EEEE, MMMM d, yyyy")}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {bookingsForDate.length} {bookingsForDate.length === 1 ? 'booking' : 'bookings'} scheduled
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={nextDay}
                className="rounded-full border-2 border-gray-300 hover:bg-gray-50 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        {isLoading ? (
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100">
            <CardContent className="p-12 flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-4" />
              <p className="text-lg text-gray-600">Loading schedule...</p>
            </CardContent>
          </Card>
        ) : bookingsForDate.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100">
            <CardContent className="p-12 text-center">
              <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings scheduled</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                You don't have any bookings scheduled for {format(currentDate, "MMMM d, yyyy")}. Check other dates or wait for new bookings.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookingsForDate.map((booking) => (
              <Card key={booking._id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-extrabold text-gray-800">
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
                        {booking.fee && (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-green-600">Fee: ${booking.fee}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Calendar Overview - Show all future bookings */}
        {bookings.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-orange-50 p-6 border-b border-green-200">
              <CardTitle className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-green-600" />
                Upcoming Schedule Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {Object.entries(bookingsByDate).slice(0, 7).map(([dateKey, dateBookings]) => (
                  <div key={dateKey} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-colors">
                    <div>
                      <p className="font-bold text-gray-800">{format(new Date(dateKey), "EEEE, MMMM d")}</p>
                      <p className="text-sm text-gray-600">{dateBookings.length} {dateBookings.length === 1 ? 'booking' : 'bookings'}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date(dateKey))}
                      className="rounded-full border-2 border-green-500 text-green-700 hover:bg-green-50 font-semibold"
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </HandymanDashboardLayout>
  );
};

export default HandymanSchedule;
