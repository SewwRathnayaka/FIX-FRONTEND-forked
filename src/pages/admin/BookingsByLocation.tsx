import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { AdminAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, MapPin } from 'lucide-react';

interface LocationBooking {
  location: string;
  total: number;
  byStatus: {
    pending: number;
    accepted: number;
    rejected: number;
    paid: number;
    done: number;
    completed: number;
  };
}

const BookingsByLocation = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<LocationBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;
      
      const isAdmin = user.unsafeMetadata?.admin === true || user.publicMetadata?.admin === true;
      
      try {
        setLoading(true);
        const response = await AdminAPI.getBookingsByLocation(user.id, isAdmin);
        if (response.success) {
          setBookings(response.data);
        } else {
          setError(response.message || 'Failed to load bookings by location');
        }
      } catch (err: any) {
        console.error('Error fetching bookings by location:', err);
        setError(err.message || 'Failed to load bookings by location');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading bookings by location...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4 w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/dashboard')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Bookings by Location
                </h1>
                <p className="text-gray-600 mt-1">View booking distribution across different cities</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((location, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-md border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">{location.location}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-gray-900 mb-1">{location.total}</div>
                    <div className="text-sm text-gray-600">Total Bookings</div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-700 mb-2">By Status:</div>
                    {Object.entries(location.byStatus).map(([status, count]) => (
                      count > 0 && (
                        <div key={status} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 capitalize">{status}:</span>
                          <span className="font-semibold text-gray-900">{count}</span>
                        </div>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-md border-2 border-gray-100 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-gray-500 text-center py-8">No booking location data available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingsByLocation;

