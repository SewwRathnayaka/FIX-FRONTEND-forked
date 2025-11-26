
import { useState, useEffect } from "react";
import { useUser } from '@clerk/clerk-react';
import HandymanDashboardLayout from "@/components/handyman/HandymanDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Phone, Mail, MapPin, Loader2, User, Briefcase, Award } from "lucide-react";
import { HandymanAPI } from "@/lib/api";
import { useServices } from "@/hooks/use-api";

interface ProviderData {
  name: string;
  contactNumber?: string;
  emailAddress?: string;
  personalPhoto?: string;
  experience?: number;
  certifications?: string[];
  services?: string[];
  location?: string;
  availability?: {
    workingDays?: string;
    workingHours?: string;
  };
}

const HandymanProfile = () => {
  const { user } = useUser();
  const [profileData, setProfileData] = useState<ProviderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: servicesResponse } = useServices();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const response = await HandymanAPI.getHandymanProfile();
        if (response.success && response.data) {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // Get service names from service IDs
  const getServiceNames = () => {
    if (!profileData?.services || !servicesResponse?.data) return [];
    
    const serviceMap = new Map(
      servicesResponse.data.map((service: any) => [service._id, service.name])
    );
    
    return profileData.services
      .map((serviceId: string) => serviceMap.get(serviceId))
      .filter(Boolean);
  };

  const serviceNames = getServiceNames();
  const displayName = profileData?.name || user?.firstName || user?.username || 'Handyman';
  const displayEmail = profileData?.emailAddress || user?.primaryEmailAddress?.emailAddress || 'N/A';
  const displayPhone = profileData?.contactNumber || 'N/A';
  const displayLocation = profileData?.location || 'Not specified';
  const displayPhoto = profileData?.personalPhoto || user?.imageUrl || '';
  const experience = profileData?.experience || 0;
  const certifications = profileData?.certifications || [];
  const workingDays = profileData?.availability?.workingDays || 'Not specified';
  const workingHours = profileData?.availability?.workingHours || 'Not specified';

  if (isLoading) {
    return (
      <HandymanDashboardLayout title="Profile" subtitle="View and manage your profile information">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-4" />
          <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
      </HandymanDashboardLayout>
    );
  }

  return (
    <HandymanDashboardLayout title="Profile" subtitle="View and manage your profile information">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          {/* Profile Card */}
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-orange-100 flex items-center justify-center mb-4 border-4 border-white shadow-lg overflow-hidden">
                {displayPhoto ? (
                  <img
                    src={displayPhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{displayName}</h2>
              <p className="text-gray-600 mb-4">Service Provider</p>
              
              {/* Star Rating - Placeholder for now */}
              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    className="text-yellow-400 fill-yellow-300"
                    size={18}
                  />
                ))}
                <span className="ml-2 text-gray-700 text-sm font-medium">
                  4.8 <span className="text-gray-500">(0 reviews)</span>
                </span>
              </div>

              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-800">{displayLocation}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200">
                  <Phone className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-800">{displayPhone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200">
                  <Mail className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-800">{displayEmail}</span>
                </div>
                {experience > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200">
                    <Briefcase className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-800">{experience} years experience</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Skills & Services Card */}
          {serviceNames.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100">
              <CardHeader className="bg-gradient-to-r from-green-50 to-orange-50 p-4 border-b border-green-200">
                <CardTitle className="text-lg font-extrabold text-gray-800">Services Offered</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {serviceNames.map((serviceName, index) => (
                    <Badge
                      key={index}
                      className="bg-gradient-to-r from-green-100 to-orange-100 border-2 border-green-300 text-green-700 font-semibold px-3 py-1 text-sm"
                    >
                      {serviceName}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* About Section */}
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-orange-50 p-6 border-b border-green-200">
              <CardTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed">
                {experience > 0 
                  ? `Experienced service provider with ${experience} years of expertise in ${serviceNames.length > 0 ? serviceNames.join(', ') : 'various services'}. Committed to providing high-quality workmanship and excellent customer service.`
                  : 'Service provider committed to delivering quality work and excellent customer service.'
                }
              </p>
            </CardContent>
          </Card>

          {/* Availability Section */}
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-orange-50 p-6 border-b border-green-200">
              <CardTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200">
                  <Briefcase className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Working Days</p>
                    <p className="text-base font-bold text-gray-800">{workingDays}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200">
                  <Briefcase className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Working Hours</p>
                    <p className="text-base font-bold text-gray-800">{workingHours}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications Section */}
          {certifications.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100">
              <CardHeader className="bg-gradient-to-r from-green-50 to-orange-50 p-6 border-b border-green-200">
                <CardTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-orange-50 rounded-xl border-2 border-green-200">
                      <p className="font-semibold text-gray-800">{cert}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Certifications Message */}
          {certifications.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100">
              <CardHeader className="bg-gradient-to-r from-green-50 to-orange-50 p-6 border-b border-green-200">
                <CardTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 text-center py-4">No certifications added yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </HandymanDashboardLayout>
  );
};

export default HandymanProfile;
