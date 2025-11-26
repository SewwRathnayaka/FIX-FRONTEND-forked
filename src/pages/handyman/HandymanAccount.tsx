
import { useUser, useClerk } from '@clerk/clerk-react';
import HandymanDashboardLayout from "@/components/handyman/HandymanDashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User, Shield, Bell, Key, ExternalLink, Mail, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

const HandymanAccount = () => {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const { t } = useTranslation();

  const handleManageAccount = () => {
    // Open Clerk's user profile modal which includes account management
    if (openUserProfile) {
      openUserProfile();
    }
  };

  return (
    <HandymanDashboardLayout title="Account Settings" subtitle="Manage your account settings and preferences">
      <div className="space-y-6">
        {/* Clerk Account Settings Card */}
        <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 relative overflow-hidden">
          {/* Decorative blur elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200/20 rounded-full blur-2xl" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Account Management
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Manage your account settings, security, and preferences through Clerk's secure account management portal.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-gradient-to-br from-green-50 to-orange-50 p-4 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800">Profile Settings</h3>
                  </div>
                  <p className="text-sm text-gray-600">Update your name, email, and profile picture</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-orange-50 p-4 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg">
                      <Key className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800">Security & Password</h3>
                  </div>
                  <p className="text-sm text-gray-600">Change password and manage two-factor authentication</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-orange-50 p-4 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800">Privacy & Data</h3>
                  </div>
                  <p className="text-sm text-gray-600">Manage your privacy settings and data preferences</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-orange-50 p-4 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800">Notifications</h3>
                  </div>
                  <p className="text-sm text-gray-600">Configure email and notification preferences</p>
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={handleManageAccount}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-6 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-full"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Manage Account Settings
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 relative overflow-hidden">
          {/* Decorative blur elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-colors">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg shadow-lg">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 mb-1">Email Address</p>
                  <p className="text-base font-bold text-gray-800">{user?.primaryEmailAddress?.emailAddress || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-colors">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-lg shadow-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 mb-1">Account Created</p>
                  <p className="text-base font-bold text-gray-800">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </HandymanDashboardLayout>
  );
};

export default HandymanAccount;
