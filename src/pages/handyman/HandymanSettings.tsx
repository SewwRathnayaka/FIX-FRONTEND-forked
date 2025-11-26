
import HandymanDashboardLayout from "@/components/handyman/HandymanDashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar, Globe, Bell, Lock, CheckCircle2, XCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { CalendarAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const HandymanSettings = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Example states (for demonstration; real logic/data/fetching isn't needed per instructions)
  const [calendarView, setCalendarView] = useState("daily");
  const [completedColor, setCompletedColor] = useState("#10B981");
  const [inProgressColor, setInProgressColor] = useState("#F5E90B");
  const [showCompleted, setShowCompleted] = useState(false);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("est");
  const [dateFormat, setDateFormat] = useState("us");
  const [timeFormat, setTimeFormat] = useState("12h");
  // Notifications
  const [emailOpts, setEmailOpts] = useState({
    newJob: true,
    jobReminders: true,
    payment: true,
    marketing: false,
  });
  const [smsOpts, setSmsOpts] = useState({
    jobReminders: true,
    newJob: false,
  });
  // Privacy
  const [privacy, setPrivacy] = useState({
    stats: true,
    publicProfile: false,
  });

  // Check calendar connection status on mount
  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        const response = await CalendarAPI.getConnectionStatus();
        if (response.success) {
          setCalendarConnected(response.data.connected);
        }
      } catch (error) {
        console.error('Error checking calendar connection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Check URL params for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const calendarParam = urlParams.get('calendar');
    
    if (calendarParam === 'connected') {
      toast({
        title: "Google Calendar Connected",
        description: "Your Google Calendar has been successfully connected!",
      });
      setCalendarConnected(true);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (calendarParam === 'error') {
      toast({
        title: "Connection Failed",
        description: "Failed to connect Google Calendar. Please try again.",
        variant: "destructive",
      });
      window.history.replaceState({}, '', window.location.pathname);
    }

    checkConnectionStatus();
  }, [toast]);

  // Handlers
  const handleEmailChange = (key: string) => setEmailOpts(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev]}));
  const handleSmsChange = (key: string) => setSmsOpts(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev]}));
  const handlePrivacyChange = (key: string) => setPrivacy(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev]}));

  const handleConnectCalendar = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to connect Google Calendar.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const response = await CalendarAPI.initiateOAuth(user.id);
      if (response.success && response.data.authUrl) {
        // Redirect to Google OAuth
        window.location.href = response.data.authUrl;
      } else {
        throw new Error(response.message || 'Failed to initiate OAuth');
      }
    } catch (error: any) {
      console.error('Error connecting calendar:', error);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect Google Calendar. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnectCalendar = async () => {
    try {
      const response = await CalendarAPI.disconnect();
      if (response.success) {
        setCalendarConnected(false);
        toast({
          title: "Google Calendar Disconnected",
          description: "Your Google Calendar has been disconnected.",
        });
      } else {
        throw new Error(response.message || 'Failed to disconnect');
      }
    } catch (error: any) {
      console.error('Error disconnecting calendar:', error);
      toast({
        title: "Disconnect Error",
        description: error.message || "Failed to disconnect Google Calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <HandymanDashboardLayout title="Settings" subtitle="Manage your preferences and account settings">
      <div className="flex flex-col gap-6 pb-8">
        {/* Google Calendar Integration */}
        <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl" />
          <CardHeader className="relative z-10 bg-gradient-to-r from-green-50 to-orange-50 p-6 border-b border-green-200">
            <CardTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent flex items-center gap-2">
              <Calendar className="h-6 w-6 text-green-600" />
              Google Calendar Integration
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Connect your Google Calendar to automatically add bookings when customers pay
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200">
                  {calendarConnected ? (
                    <>
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Google Calendar Connected</div>
                        <div className="text-sm text-gray-600">
                          Bookings will be automatically added to your calendar when customers pay
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleDisconnectCalendar}
                        className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-orange-600" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Google Calendar Not Connected</div>
                        <div className="text-sm text-gray-600">
                          Connect your Google Calendar to automatically sync bookings
                        </div>
                      </div>
                      <Button
                        onClick={handleConnectCalendar}
                        disabled={isConnecting}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                      >
                        {isConnecting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Connecting...
                          </>
                        ) : (
                          'Connect Google Calendar'
                        )}
                      </Button>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <strong>How it works:</strong> When a customer pays for a booking, it will automatically be added to your Google Calendar with a reminder 24 hours and 1 hour before the scheduled time.
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-2xl" />
          <CardHeader className="relative z-10 bg-gradient-to-r from-green-50 to-orange-50 p-6 border-b border-green-200">
            <CardTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent flex items-center gap-2">
              <Calendar className="h-6 w-6 text-green-600" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 p-6">
            <div className="flex flex-col md:flex-row gap-5 md:gap-8 mb-5">
              <div className="flex-1 flex flex-col gap-2">
                <Label htmlFor="calendar-view" className="font-medium">Default Calendar View</Label>
                <Select value={calendarView} onValueChange={setCalendarView}>
                  <SelectTrigger id="calendar-view" className="w-full max-w-xs">
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <Label className="font-medium">Job Status Colors</Label>
                <div className="flex flex-wrap items-center gap-5">
                  <div>
                    <Label className="text-xs mb-1 block">Completed</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="color"
                        className="h-9 w-12 border"
                        value={completedColor}
                        onChange={e => setCompletedColor(e.target.value)}
                        aria-label="Completed Color"
                      />
                      <Input
                        className="w-28"
                        value={completedColor}
                        onChange={e => setCompletedColor(e.target.value)}
                        maxLength={8}
                        aria-label="Completed Color Hex"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">In Progress</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="color"
                        className="h-9 w-12 border"
                        value={inProgressColor}
                        onChange={e => setInProgressColor(e.target.value)}
                        aria-label="In Progress Color"
                      />
                      <Input
                        className="w-28"
                        value={inProgressColor}
                        onChange={e => setInProgressColor(e.target.value)}
                        maxLength={8}
                        aria-label="InProgress Color Hex"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Checkbox
                    id="show-completed"
                    checked={showCompleted}
                    onCheckedChange={checked => setShowCompleted(Boolean(checked))}
                  />
                  <Label htmlFor="show-completed" className="text-gray-600 text-sm">
                    Show completed jobs in calendar
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end pt-4">
            <Button 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold" 
              type="button"
            >
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Regional Settings */}
        <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl" />
          <CardHeader className="relative z-10 bg-gradient-to-r from-green-50 to-orange-50 p-6 border-b border-green-200">
            <CardTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent flex items-center gap-2">
              <Globe className="h-6 w-6 text-green-600" />
              Regional Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 p-6">
            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-5 mb-5">
              {/* Language */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="language" className="font-medium">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="es">Spanish (ES)</SelectItem>
                    <SelectItem value="fr">French (FR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Timezone */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="tz" className="font-medium">Time Zone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="tz">
                    <SelectValue placeholder="Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="est">Eastern Time (US & Canada)</SelectItem>
                    <SelectItem value="cst">Central Time (US & Canada)</SelectItem>
                    <SelectItem value="pst">Pacific Time (US & Canada)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Date Format */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="date-fmt" className="font-medium">Date Format</Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger id="date-fmt">
                    <SelectValue placeholder="Date Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">MM/DD/YYYY</SelectItem>
                    <SelectItem value="intl">DD/MM/YYYY</SelectItem>
                    <SelectItem value="iso">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Time Format */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="time-fmt" className="font-medium">Time Format</Label>
                <Select value={timeFormat} onValueChange={setTimeFormat}>
                  <SelectTrigger id="time-fmt">
                    <SelectValue placeholder="Time Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end pt-4">
            <Button 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold" 
              type="button"
            >
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Notification Preferences */}
        <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl" />
          <CardHeader className="relative z-10 bg-gradient-to-r from-green-50 to-orange-50 p-6 border-b border-green-200">
            <CardTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent flex items-center gap-2">
              <Bell className="h-6 w-6 text-green-600" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 p-6">
            {/* Email Notifications */}
            <div className="mb-6">
              <div className="font-bold text-gray-800 text-base mb-4">Email Notifications</div>
              <div className="flex flex-col gap-3 pl-2">
                <label className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer">
                  <Checkbox checked={emailOpts.newJob} onCheckedChange={() => handleEmailChange("newJob")} />
                  <span className="text-gray-800 text-base font-semibold">New job requests</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer">
                  <Checkbox checked={emailOpts.jobReminders} onCheckedChange={() => handleEmailChange("jobReminders")} />
                  <span className="text-gray-700 text-base font-medium">Job reminders (24h before)</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer">
                  <Checkbox checked={emailOpts.payment} onCheckedChange={() => handleEmailChange("payment")} />
                  <span className="text-gray-700 text-base font-medium">Payment received</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer">
                  <Checkbox checked={emailOpts.marketing} onCheckedChange={() => handleEmailChange("marketing")} />
                  <span className="text-gray-700 text-base font-medium">Marketing updates</span>
                </label>
              </div>
            </div>
            {/* SMS Notifications */}
            <div>
              <div className="font-bold text-gray-800 text-base mb-4">SMS Notifications</div>
              <div className="flex flex-col gap-3 pl-2">
                <label className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer">
                  <Checkbox checked={smsOpts.jobReminders} onCheckedChange={() => handleSmsChange("jobReminders")} />
                  <span className="text-gray-700 text-base font-medium">Job reminders (2h before)</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer">
                  <Checkbox checked={smsOpts.newJob} onCheckedChange={() => handleSmsChange("newJob")} />
                  <span className="text-gray-700 text-base font-medium">New job requests</span>
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end pt-4">
            <Button 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold" 
              type="button"
            >
              Save Preferences
            </Button>
          </CardFooter>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl" />
          <CardHeader className="relative z-10 bg-gradient-to-r from-green-50 to-orange-50 p-6 border-b border-green-200">
            <CardTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent flex items-center gap-2">
              <Lock className="h-6 w-6 text-green-600" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 p-6">
            <div className="flex flex-col gap-4">
              <div className="font-bold text-gray-800 text-base mb-2">Data Sharing</div>
              <label className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer">
                <Switch checked={privacy.stats} onCheckedChange={() => handlePrivacyChange("stats")} />
                <span className="text-gray-700 text-base font-medium">Share job statistics anonymously to improve the service</span>
              </label>
              <label className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer">
                <Switch checked={privacy.publicProfile} onCheckedChange={() => handlePrivacyChange("publicProfile")} />
                <span className="text-gray-700 text-base font-medium">Allow my profile to be discoverable in public directory</span>
              </label>
            </div>
          </CardContent>
          <CardFooter className="justify-end pt-4">
            <Button 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold" 
              type="button"
            >
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </div>
    </HandymanDashboardLayout>
  );
};

export default HandymanSettings;
