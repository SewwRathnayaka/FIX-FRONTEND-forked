import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { ProviderPaymentSetup } from '@/components/payments/ProviderPaymentSetup';
import HandymanDashboardLayout from '@/components/handyman/HandymanDashboardLayout';
import { useTranslation } from 'react-i18next';
import { StripeAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, Calendar, CreditCard, CheckCircle } from 'lucide-react';

interface Payment {
  _id: string;
  bookingId: string;
  amountCents: number;
  applicationFeeCents: number;
  currency: string;
  status: string;
  createdAt: string;
  metadata?: {
    bookingId: string;
    serviceName?: string;
    providerName?: string;
    clientName?: string;
  };
}

const HandymanPayments = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.id) return;

      try {
        setIsLoadingPayments(true);
        const response = await StripeAPI.getMyPayments();
        if (response.success && response.data?.payments) {
          setPayments(response.data.payments);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setIsLoadingPayments(false);
      }
    };

    fetchPayments();
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      'succeeded': { bg: 'bg-green-100', text: 'text-green-700', label: 'Succeeded' },
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      'failed': { bg: 'bg-red-100', text: 'text-red-700', label: 'Failed' },
      'refunded': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Refunded' },
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    
    return (
      <Badge className={`${config.bg} ${config.text} border-2 border-current px-3 py-1 text-xs font-semibold`}>
        {config.label}
      </Badge>
    );
  };

  const netEarnings = payments
    .filter(p => p.status === 'succeeded')
    .reduce((sum, p) => sum + ((p.amountCents - p.applicationFeeCents) / 100), 0);

  return (
    <HandymanDashboardLayout 
      title="Payment Account Status" 
      subtitle="Manage your payment account and payout settings"
    >
      <div className="space-y-6">
        {/* Payment Account Status */}
        <ProviderPaymentSetup />

        {/* Payment History */}
        <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100">
          <CardHeader className="bg-gradient-to-r from-green-50 to-orange-50 p-6 border-b border-green-200">
            <CardTitle className="text-xl sm:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-green-600" />
              Payment History
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              View all payments received with booking details
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isLoadingPayments ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-4" />
                <p className="text-lg text-gray-600">Loading payment history...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No payments yet</h3>
                <p className="text-gray-500">
                  Payments will appear here once clients complete their bookings and payments.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-gradient-to-r from-green-50 to-orange-50 p-4 rounded-xl border-2 border-green-200 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Total Net Earnings</p>
                      <p className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                        ${netEarnings.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Payments List */}
                {payments.map((payment) => {
                  const netAmount = (payment.amountCents - payment.applicationFeeCents) / 100;
                  const platformFee = payment.applicationFeeCents / 100;
                  
                  return (
                    <Card key={payment._id} className="bg-white border-2 border-gray-200 hover:border-green-300 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-extrabold text-gray-800">
                                {payment.metadata?.serviceName || 'Service Payment'}
                              </h3>
                              {getStatusBadge(payment.status)}
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">{formatDate(payment.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700">Booking ID:</span>
                                <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                  {payment.bookingId}
                                </code>
                              </div>
                              {payment.metadata?.clientName && (
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-700">Client:</span>
                                  <span>{payment.metadata.clientName}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="mb-2">
                              <p className="text-xs text-gray-500 mb-1">Net Earnings</p>
                              <p className="text-2xl font-extrabold text-green-600">
                                ${netAmount.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-xs text-gray-500">
                              <p>Total: ${formatAmount(payment.amountCents)}</p>
                              <p>Platform Fee: ${platformFee.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </HandymanDashboardLayout>
  );
};

export default HandymanPayments;

