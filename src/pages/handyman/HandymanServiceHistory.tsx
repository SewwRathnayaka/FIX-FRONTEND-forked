import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';
import { HandymanAPI } from '../../lib/api';
import HandymanDashboardLayout from '@/components/handyman/HandymanDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Search, Calendar, Clock, MapPin, Star, DollarSign, Loader2 } from 'lucide-react';

interface Booking {
  _id: string;
  status: string;
  description: string;
  fee: number | null;
  location: string | {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  clientId: string;
  providerId: string;
  serviceId: string;
  providerName: string;
  serviceName: string;
  scheduledTime: string;
  createdAt: string;
  updatedAt: string;
}

const HandymanServiceHistory: React.FC = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Fetch completed bookings for the handyman
  useEffect(() => {
    const fetchCompletedBookings = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get all bookings for the handyman
        const response = await HandymanAPI.getProviderBookingsByClerkUserId(user.id);
        
        if (response.success && response.data) {
          // Filter only completed bookings
          const completedBookings = response.data.filter((booking: Booking) => 
            booking.status === 'completed'
          );
          setBookings(completedBookings);
        } else {
          setError('Failed to fetch completed bookings');
        }
      } catch (err) {
        console.error('Error fetching completed bookings:', err);
        setError('Failed to fetch completed bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedBookings();
  }, [user]);

  // Filter and search bookings
  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => {
        const locationStr = typeof booking.location === 'string' 
          ? booking.location 
          : booking.location?.address || '';
        return booking.description.toLowerCase().includes(lowerSearch) ||
          booking.serviceName.toLowerCase().includes(lowerSearch) ||
          locationStr.toLowerCase().includes(lowerSearch);
      });
    }

    return filtered;
  }, [bookings, searchTerm, filterStatus]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCompleted = bookings.length;
    const totalEarnings = bookings.reduce((sum, booking) => sum + (booking.fee || 0), 0);
    const averageRating = 4.5; // This would come from reviews in the future

    return {
      totalCompleted,
      totalEarnings,
      averageRating
    };
  }, [bookings]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <HandymanDashboardLayout title="Service History" subtitle="View all your completed services and earnings">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-4" />
          <p className="text-lg text-gray-600">Loading service history...</p>
        </div>
      </HandymanDashboardLayout>
    );
  }

  if (error) {
    return (
      <HandymanDashboardLayout title="Service History" subtitle="View all your completed services and earnings">
        <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-red-200">
          <CardContent className="p-12 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Service History</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold px-6 py-2"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </HandymanDashboardLayout>
    );
  }

  return (
    <HandymanDashboardLayout title="Service History" subtitle="View all your completed services and earnings">
      <div className="space-y-6">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2">Total Completed</p>
                  <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    {stats.totalCompleted}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/20 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2">Total Earnings</p>
                  <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    ${stats.totalEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-200/20 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2">Average Rating</p>
                  <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent">
                    {stats.averageRating}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search by service, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-md hover:shadow-lg bg-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  className={filterStatus === 'all' 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold'
                    : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full font-semibold'
                  }
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'completed' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('completed')}
                  className={filterStatus === 'completed'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold'
                    : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full font-semibold'
                  }
                >
                  Completed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100">
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                  {searchTerm || filterStatus !== 'all' ? 'No matching bookings found' : 'No completed services yet'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Complete your first service to see it here!'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking._id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between mb-4 gap-3">
                        <div>
                          <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                            {booking.serviceName}
                          </h3>
                          <p className="text-gray-600">{booking.description}</p>
                        </div>
                        <Badge className={`${getStatusBadgeStyle(booking.status)} px-4 py-1.5 text-xs font-bold border-2 shadow-md`}>
                          {booking.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{formatDate(booking.scheduledTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{formatTime(booking.scheduledTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {typeof booking.location === 'string' 
                              ? booking.location 
                              : booking.location?.address || 'Location not available'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-bold text-green-600 text-lg">${booking.fee || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Results Count */}
        {filteredBookings.length > 0 && (
          <div className="mt-6 text-center text-gray-600 font-semibold">
            Showing {filteredBookings.length} of {bookings.length} completed services
          </div>
        )}
      </div>
    </HandymanDashboardLayout>
  );
};

export default HandymanServiceHistory;
