import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StripeAPI } from '@/lib/api';

interface AccountStatus {
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  needsOnboarding: boolean;
  onboardingUrl?: string;
  requirements?: {
    currentlyDue: string[];
    eventuallyDue: string[];
    pastDue: string[];
    pendingVerification: string[];
  };
}

const StripeRegistrationReminder = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccountStatus = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await StripeAPI.getProviderAccountStatus(user.id);
        
        if (response.success && response.data) {
          setAccountStatus({
            chargesEnabled: response.data.chargesEnabled || false,
            payoutsEnabled: response.data.payoutsEnabled || false,
            needsOnboarding: response.data.needsOnboarding || false,
            onboardingUrl: response.data.onboardingUrl,
            requirements: response.data.requirements,
          });
        }
      } catch (error) {
        console.error('Error fetching account status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountStatus();
  }, [user?.id]);

  // Don't show reminder if account is fully set up
  if (isLoading || !accountStatus || (accountStatus.chargesEnabled && accountStatus.payoutsEnabled)) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 shadow-lg mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-lg sm:text-xl font-bold text-orange-900">
              Complete Your Payment Setup
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-orange-800">
            To receive payments from clients, you need to complete your Stripe account setup. 
            This is required before you can accept bookings and get paid.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate('/handyman/payments')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Set Up Payments
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/handyman/payments')}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Learn More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripeRegistrationReminder;

