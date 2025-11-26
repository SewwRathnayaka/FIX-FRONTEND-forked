import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bell, User, Home, Wrench } from "lucide-react";
import { useUser } from '@clerk/clerk-react';
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { ClientAPI } from "@/lib/api";

interface ClientDashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showHomeIcon?: boolean;
  showHandymanButton?: boolean;
}

// This will be populated from API
const notifications: any[] = [];

const ClientDashboardLayout = ({ children, title, subtitle, showHomeIcon = true, showHandymanButton = false }: ClientDashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoaded } = useUser();
  const { t } = useTranslation();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user?.id) return;
      
      try {
        const response = await ClientAPI.getUserChats(user.id, 'client');
        if (response.success && response.data) {
          const totalUnread = response.data.reduce((sum: number, chat: any) => sum + (chat.unreadCount || 0), 0);
          setUnreadCount(totalUnread);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // Authentication is now handled by ProtectedClientRoute wrapper
  // No need for manual checks here

  const handleLogout = () => {
    toast({
      title: t("client.layout.menu.logout"),
      description: t("client.layout.menu.logout")
    });
    navigate("/");
  };

  const isHandyman = user?.unsafeMetadata?.isHandyman;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="shadow-xl backdrop-blur-md border-b border-green-400/20 sticky top-0 z-50" style={{ background: "#14B22D" }}>
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center justify-start"></div>
            <div className="flex-1 flex items-center justify-center">
              <Link to="/" className="flex items-center h-8 sm:h-10">
                <img
                  src="/lovable-uploads/a707e924-f315-4907-a798-16e19d2e7a69.png"
                  alt="FixFinder Logo"
                  className="h-8 sm:h-10 object-contain"
                  style={{ maxWidth: 150 }}
                />
              </Link>
            </div>
            <div className="flex-1 flex items-center justify-end space-x-1 sm:space-x-3">
              {showHomeIcon && location.pathname !== "/client/dashboard" && (
                <button
                  className="rounded-full p-1.5 sm:p-2 hover:bg-green-100/20 transition-all duration-300 hover:scale-110"
                  aria-label="Home"
                  onClick={() => navigate("/client/dashboard")}
                  type="button"
                >
                  <Home className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </button>
              )}
              {!isHandyman && showHandymanButton && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 py-1.5 sm:py-2 mr-1 sm:mr-2 text-xs sm:text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => navigate("/handyman/registration")}
                >
                  <Wrench className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden md:inline">{t("client.layout.registerHandyman")}</span>
                </Button>
              )}
              {isHandyman && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 py-1.5 sm:py-2 mr-1 sm:mr-2 text-xs sm:text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => window.open("/handyman/dashboard", "_blank")}
                >
                  <span className="hidden md:inline">{t("client.layout.serviceDashboard")}</span>
                </Button>
              )}
              <LanguageSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer p-1.5 rounded-full hover:bg-white/10 transition-all duration-300">
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-lg">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 sm:w-72 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl">
                  <div className="p-3 text-sm sm:text-base font-bold text-gray-800 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{t("client.layout.notifications")}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => navigate("/client/dashboard")}
                    className="text-sm sm:text-base hover:bg-green-50/50 transition-colors duration-200"
                  >
                    {unreadCount > 0 ? (
                      <span>You have {unreadCount} unread message{unreadCount > 1 ? 's' : ''}</span>
                    ) : (
                      <span className="text-gray-400">{t("client.layout.noNotifications")}</span>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="bg-white rounded-full h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 overflow-hidden">
                    {user?.imageUrl ? (
                      <img 
                        src={user.imageUrl} 
                        alt={user.firstName || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 sm:w-56 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl">
                  <DropdownMenuItem
                    onClick={() => navigate("/client/dashboard")}
                    className="text-sm sm:text-base hover:bg-green-50/50 transition-colors duration-200"
                  >
                    {t("client.layout.menu.dashboard")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/profile")} className="text-sm sm:text-base hover:bg-green-50/50 transition-colors duration-200">
                    {t("client.layout.menu.basicInfo")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/service-history")} className="text-sm sm:text-base hover:bg-green-50/50 transition-colors duration-200">
                    {t("client.layout.menu.serviceHistory")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/payment-billing")} className="text-sm sm:text-base hover:bg-green-50/50 transition-colors duration-200">
                    {t("client.layout.menu.paymentBilling")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/account-settings")} className="text-sm sm:text-base hover:bg-green-50/50 transition-colors duration-200">
                    {t("client.layout.menu.accountSettings")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50/50 transition-colors duration-200 text-sm sm:text-base font-semibold">
                    {t("client.layout.menu.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        <main className="flex-1 p-4 sm:p-6 md:p-8 relative z-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-2xl font-extrabold text-gray-800 mb-2">
              <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            {subtitle && <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">{subtitle}</p>}
          </div>
          {children}
        </main>
      </div>

      <div className="w-full flex justify-center p-4 sm:p-5 bg-white border-t border-gray-200 shadow-xl">
        <div className="flex items-center">
          <img
            src="/lovable-uploads/dd421578-d45c-4aa5-ac80-e96f8fe812e5.png"
            alt="FixFinder New Logo"
            className="h-6 sm:h-8 object-contain"
            style={{ maxWidth: 120 }}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardLayout;
