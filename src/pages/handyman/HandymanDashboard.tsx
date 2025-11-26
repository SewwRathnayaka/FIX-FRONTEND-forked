
import { useState, useCallback } from "react";
import { useUser } from '@clerk/clerk-react';
import { useTranslation } from "react-i18next";
import HandymanDashboardLayout from "@/components/handyman/HandymanDashboardLayout";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import StatsCards from "@/components/handyman/dashboard/StatsCards";
import ClientRequests from "@/components/handyman/dashboard/ClientRequests";
import TodaySchedule from "@/components/handyman/dashboard/TodaySchedule";
import StripeRegistrationReminder from "@/components/handyman/dashboard/StripeRegistrationReminder";

const HandymanDashboard = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const [tab, setTab] = useState<"requests" | "today">("requests");
  const [refreshKey, setRefreshKey] = useState(0);

  // Get user's first name from Clerk
  const firstName = user?.firstName || user?.username || 'there';

  // Callback to refresh all components when booking status changes
  const handleBookingStatusChange = useCallback(() => {
    console.log('Handyman dashboard - Status change detected, refreshing...');
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <HandymanDashboardLayout 
      title={t("handyman.hero.welcome", { name: firstName })} 
      subtitle={t("handyman.hero.subtitle")}
    >
      <div className="space-y-6">
        <StripeRegistrationReminder />
        <StatsCards />

        <Tabs value={tab} onValueChange={(val) => setTab(val as typeof tab)} className="w-full">
          <TabsList className="bg-gray-100 rounded-xl p-1 shadow-sm mb-6">
            <TabsTrigger 
              value="requests" 
              className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-md data-[state=active]:border-green-200 data-[state=active]:border transition-all duration-200 rounded-lg px-6 py-2 text-sm font-medium text-gray-600 hover:text-green-700"
            >
              Client Requests
            </TabsTrigger>
            <TabsTrigger 
              value="today" 
              className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-md data-[state=active]:border-green-200 data-[state=active]:border transition-all duration-200 rounded-lg px-6 py-2 text-sm font-medium text-gray-600 hover:text-green-700"
            >
              Today's Schedule
            </TabsTrigger>
          </TabsList>
          <TabsContent value="requests" className="mt-0">
            <ClientRequests key={refreshKey} onStatusChange={handleBookingStatusChange} />
          </TabsContent>
          <TabsContent value="today" className="mt-0">
            <TodaySchedule />
          </TabsContent>
        </Tabs>
      </div>
    </HandymanDashboardLayout>
  );
};

export default HandymanDashboard;
