import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { AdminAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Wrench, Calendar, DollarSign, TrendingUp, MapPin, ArrowRight } from 'lucide-react';
import CreateServiceForm from '@/components/admin/CreateServiceForm';

interface DashboardStats {
  totalClients: number;
  totalHandymen: number;
  totalBookings: number;
  bookingsByStatus: {
    pending: number;
    accepted: number;
    rejected: number;
    paid: number;
    done: number;
    completed: number;
  };
  totalRevenue: number;
  popularServices: Array<{
    name: string;
    usageCount: number;
    baseFee: number;
  }>;
}

const AdminDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      
      const isAdmin = user.unsafeMetadata?.admin === true || user.publicMetadata?.admin === true;
      
      try {
        setLoading(true);
        const response = await AdminAPI.getDashboardStats(user.id, isAdmin);
        if (response.success) {
          setStats(response.data);
        } else {
          setError(response.message || 'Failed to load dashboard statistics');
        }
      } catch (err: any) {
        console.error('Error fetching admin stats:', err);
        setError(err.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const firstName = user?.firstName || user?.username || 'Admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
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

  const totalStatusBookings = stats
    ? Object.values(stats.bookingsByStatus).reduce((sum, count) => sum + count, 0)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, {firstName}!</p>
            </div>
            <Button
              onClick={() => navigate('/admin/bookings-location')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <MapPin className="mr-2 h-4 w-4" />
              View Bookings by Location
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Service Form */}
        <div className="mb-8">
          <CreateServiceForm onSuccess={() => {
            // Refresh stats after creating service
            if (user?.id) {
              const isAdmin = user.unsafeMetadata?.admin === true || user.publicMetadata?.admin === true;
              AdminAPI.getDashboardStats(user.id, isAdmin).then((response) => {
                if (response.success) {
                  setStats(response.data);
                }
              });
            }
          }} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Clients */}
          <Card className="bg-white/80 backdrop-blur-md border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Clients</CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats?.totalClients || 0}</div>
            </CardContent>
          </Card>

          {/* Total Handymen */}
          <Card className="bg-white/80 backdrop-blur-md border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Handymen</CardTitle>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wrench className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats?.totalHandymen || 0}</div>
            </CardContent>
          </Card>

          {/* Total Bookings */}
          <Card className="bg-white/80 backdrop-blur-md border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats?.totalBookings || 0}</div>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="bg-white/80 backdrop-blur-md border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Platform Revenue</CardTitle>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ${stats?.totalRevenue.toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings by Status */}
        <Card className="bg-white/80 backdrop-blur-md border-2 border-gray-100 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Bookings by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats && Object.entries(stats.bookingsByStatus).map(([status, count]) => (
                <div
                  key={status}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                >
                  <div className="text-sm font-medium text-gray-600 capitalize mb-1">{status}</div>
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  {totalStatusBookings > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {((count / totalStatusBookings) * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Services */}
        <Card className="bg-white/80 backdrop-blur-md border-2 border-gray-100 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">Most Popular Services</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {stats && stats.popularServices.length > 0 ? (
              <div className="space-y-3">
                {stats.popularServices.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-600">
                        Used {service.usageCount} times • ${service.baseFee.toFixed(2)} base fee
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{service.usageCount}</div>
                      <div className="text-xs text-gray-500">bookings</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No services data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

