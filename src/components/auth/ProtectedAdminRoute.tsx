import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        navigate('/', { replace: true });
        return;
      }

      // Check if user has admin metadata in Clerk
      const isAdmin = user.unsafeMetadata?.admin === true || user.publicMetadata?.admin === true;
      
      if (!isAdmin) {
        console.log('🚫 Admin access denied:', {
          hasUser: !!user,
          isAdmin,
          metadata: user.unsafeMetadata
        });
        navigate('/', { replace: true });
        return;
      }
    }
  }, [user, isLoaded, navigate]);

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full bg-[#f6f7fa] flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Verifying admin access...</p>
      </div>
    );
  }

  // Check admin status
  const isAdmin = user?.unsafeMetadata?.admin === true || user?.publicMetadata?.admin === true;
  
  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;

