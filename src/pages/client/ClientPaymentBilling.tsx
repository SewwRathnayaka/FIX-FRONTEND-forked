
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { useUser } from '@clerk/clerk-react';
import { BookingsAPI } from "@/lib/api";
import { CreditCard, History, Plus, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const ClientPaymentBilling = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiry: "12/24",
      default: true
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "8765",
      expiry: "03/25",
      default: false
    }
  ];

  useEffect(() => {
    const fetchBillingHistory = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const response = await BookingsAPI.getMyBookings();
        if (response.success && response.data) {
          // Filter only paid and completed bookings
          const paidBookings = response.data
            .filter((booking: any) => 
              booking.status === 'paid' || booking.status === 'completed'
            )
            .map((booking: any) => ({
              id: booking._id,
              date: new Date(booking.createdAt || booking.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              description: booking.serviceName || 'Service',
              amount: `$${booking.fee ? booking.fee.toFixed(2) : '0.00'}`,
              status: 'Paid'
            }))
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setBillingHistory(paidBookings);
        }
      } catch (error) {
        console.error('Error fetching billing history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillingHistory();
  }, [user?.id]);

  return (
    <ClientDashboardLayout title="Payment & Billing" subtitle="Manage your payment methods and billing history">
      <Tabs defaultValue="paymentMethods" className="w-full">
        <TabsList className="mb-6 bg-gray-100 rounded-xl p-1 shadow-sm">
          <TabsTrigger value="paymentMethods" className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-md data-[state=active]:border-green-200 data-[state=active]:border transition-all duration-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-green-700">
            <CreditCard className="h-4 w-4 mr-2" /> Payment Methods
          </TabsTrigger>
          <TabsTrigger value="billingHistory" className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-md data-[state=active]:border-green-200 data-[state=active]:border transition-all duration-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-green-700">
            <History className="h-4 w-4 mr-2" /> Billing History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="paymentMethods">
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg border-2 border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Your Payment Methods
              </h2>
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Add New Card
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map(card => (
                <Card key={card.id} className={`relative overflow-hidden bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${card.default ? 'border-green-500' : 'border-gray-100'}`}>
                  {card.default && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg font-semibold shadow-md">
                      Default
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-lg font-semibold text-gray-800">{card.type} •••• {card.last4}</div>
                      <div className="flex space-x-2">
                        {!card.default && (
                          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm transition-all duration-300">
                            Set Default
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm transition-all duration-300">
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="text-gray-600 text-sm">
                      Expires: {card.expiry}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="billingHistory">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100">
            {isLoading ? (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
                <p className="text-gray-600 text-lg">Loading billing history...</p>
              </div>
            ) : billingHistory.length === 0 ? (
              <div className="p-8 text-center">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No billing history available.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-green-50 to-orange-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Invoice ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {billingHistory.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-green-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">#{invoice.id.substring(0, 8)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{invoice.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-extrabold text-green-700">{invoice.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800 border-2 border-green-300">
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </ClientDashboardLayout>
  );
};

export default ClientPaymentBilling;
