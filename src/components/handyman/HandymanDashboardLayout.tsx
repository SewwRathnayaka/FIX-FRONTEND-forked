import React, { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser, useClerk } from '@clerk/clerk-react';
import {
  Bell,
  LogOut,
  User,
  Home,
  CreditCard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { HandymanAPI } from "@/lib/api";

interface Props {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  homeButtonHandler?: () => void;
}

const menuItems = [
  { labelKey: "handyman.layout.menu.dashboard", route: "/handyman/dashboard", icon: Home },
  { labelKey: "handyman.layout.menu.schedule", route: "/handyman/schedule" },
  { labelKey: "handyman.layout.menu.serviceHistory", route: "/handyman/service-history" },
  { labelKey: "handyman.layout.menu.payments", route: "/handyman/payments", icon: CreditCard },
  { labelKey: "handyman.layout.menu.settings", route: "/handyman/settings" },
  { labelKey: "handyman.layout.menu.profile", route: "/handyman/profile" },
  { labelKey: "handyman.layout.menu.account", route: "/handyman/account" },
];

const HandymanDashboardLayout = ({ 
  children, 
  title, 
  subtitle, 
  homeButtonHandler 
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { t } = useTranslation();
  const isOnDashboard = location.pathname === "/handyman/dashboard";
  const [unreadCount, setUnreadCount] = useState(0);

  const handleHomeClick = homeButtonHandler || (() => navigate("/handyman/dashboard"));

  // Get user's first name from Clerk
  const firstName = user?.firstName || user?.username || 'there';

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user?.id) return;
      
      try {
        const response = await HandymanAPI.getUserChats(user.id, 'handyman');
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

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="shadow-xl backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 bg-white">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center justify-start"></div>
            <div className="flex-1 flex items-center justify-center">
              <img
                src="/lovable-uploads/f8b0003c-8de6-4035-b677-59817d3a83cf.png"
                alt="FixFinder Logo"
                className="h-8 sm:h-10 object-contain"
                style={{ maxWidth: 140 }}
              />
            </div>
            <div className="flex-1 flex items-center justify-end space-x-1 sm:space-x-3">
              {!isOnDashboard && (
                <button
                  className="rounded-full p-1.5 sm:p-2 hover:bg-green-100 transition-all duration-300 hover:scale-110"
                  aria-label="Home"
                  onClick={() => navigate("/handyman/dashboard")}
                  type="button"
                >
                  <Home className="h-5 w-5 sm:h-6 sm:w-6 text-green-700" />
                </button>
              )}
              <LanguageSwitcher variant="light" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer p-1.5 rounded-full hover:bg-green-100 transition-all duration-300">
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-green-700" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-lg">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 sm:w-72 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl">
                  <div className="p-3 text-sm sm:text-base font-bold text-gray-800 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    {t("handyman.layout.notifications")}
                  </div>
                  <DropdownMenuSeparator />
                  {unreadCount > 0 ? (
                    <DropdownMenuItem className="pointer-events-none text-gray-600 text-sm sm:text-base">
                      <span>You have {unreadCount} unread message{unreadCount > 1 ? 's' : ''}</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem className="pointer-events-none text-gray-400 text-sm sm:text-base">
                      {t("handyman.layout.noNotifications")}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="bg-white rounded-full h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 overflow-hidden border-2 border-green-200">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt="User Profile" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 sm:w-56 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl">
                  {menuItems.map((item) => {
                    const IconComponent = item.icon || User;
                    return (
                      <DropdownMenuItem
                        key={item.labelKey}
                        onClick={() => navigate(item.route)}
                        className={`text-sm sm:text-base hover:bg-green-50/50 transition-colors duration-200 ${location.pathname === item.route ? "bg-green-50 text-green-700" : ""}`}
                      >
                        <IconComponent className="h-4 w-4 mr-2" />
                        <span>{t(item.labelKey)}</span>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 hover:bg-red-50/50 transition-colors duration-200 text-sm sm:text-base font-semibold"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>{t("handyman.layout.logout")}</span>
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
                {title || t("handyman.hero.welcome", { name: firstName })}
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

export default HandymanDashboardLayout;
