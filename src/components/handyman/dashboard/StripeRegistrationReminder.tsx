import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { CreditCard, AlertCircle, ArrowRight } from 'lucide-react';
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
  const [hasNoAccount, setHasNoAccount] = useState(false);
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
          // Account exists and is set up
          setAccountStatus({
            chargesEnabled: response.data.chargesEnabled || false,
            payoutsEnabled: response.data.payoutsEnabled || false,
            needsOnboarding: response.data.needsOnboarding || false,
            onboardingUrl: response.data.onboardingUrl,
            requirements: response.data.requirements,
          });
          setHasNoAccount(false);
        } else if (response.success === false && !response.data) {
          // No Stripe account exists yet (expected for new users)
          setHasNoAccount(true);
        }
      } catch (error: any) {
        // Handle unexpected errors
        console.error('Error fetching account status:', error);
        // On error, assume no account exists to show the reminder
        setHasNoAccount(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountStatus();
  }, [user?.id]);

  // Don't show reminder if loading, or if account is fully set up
  if (isLoading) {
    return null;
  }

  // Show reminder if no account exists OR if account exists but is not fully set up
  const shouldShowReminder = hasNoAccount || 
    (accountStatus && !(accountStatus.chargesEnabled && accountStatus.payoutsEnabled));

  if (!shouldShowReminder) {
    return null;
  }

  return (
    <div className="mb-8 p-6 sm:p-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-blue-200/50 shadow-xl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-blue-900 mb-2">
                Complete Your Stripe Account Setup
              </h3>
              <p className="text-blue-700 text-sm sm:text-base">
                Enable online payments to receive payments from clients securely and efficiently.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-lg">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        
        {/* Status Information */}
        <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-200/50">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm sm:text-base font-semibold text-blue-900 mb-1">
                Payment Setup Required
              </p>
              <p className="text-xs sm:text-sm text-blue-700">
                {hasNoAccount 
                  ? "You haven't set up your Stripe account yet. Complete the setup to start accepting online payments from clients."
                  : "Your Stripe account setup is incomplete. Complete the remaining steps to enable online payments."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm sm:text-base text-blue-700 font-medium">
            <span className="font-bold">💡 Tip:</span> Setting up Stripe takes just a few minutes and enables secure payment processing for all your bookings.
          </div>
          <Button 
            onClick={() => navigate('/handyman/payments')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Set Up Payments
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StripeRegistrationReminder;

