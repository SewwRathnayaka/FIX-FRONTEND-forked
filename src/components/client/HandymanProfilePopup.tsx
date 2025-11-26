
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Briefcase, Award, User, Loader2 } from "lucide-react";
import { HandymanAPI } from "@/lib/api";
import { useServices } from "@/hooks/use-api";

interface Professional {
  _id: string;
  userId: string;
  name: string;
  rating: number;
  reviews: number;
  jobsCompleted: number;
  yearsExp: number;
  services: string[];
  location: {
    city: string;
    area: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  bio?: string;
  experience?: string;
}

interface HandymanProfilePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional: Professional | null;
}

const HandymanProfilePopup = ({ open, onOpenChange, professional }: HandymanProfilePopupProps) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: servicesResponse } = useServices();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!professional?.userId || !open) return;

      try {
        setIsLoading(true);
        const response = await HandymanAPI.getServiceProviderByUserId(professional.userId);
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
  }, [professional?.userId, open]);

  // Get service names from service IDs
  const getServiceNames = () => {
    if (!professional?.services || !servicesResponse?.data) return professional?.services || [];
    
    const serviceMap = new Map(
      servicesResponse.data.map((service: any) => [service._id, service.name])
    );
    
    return professional.services
      .map((serviceId: string) => serviceMap.get(serviceId) || serviceId)
      .filter(Boolean);
  };

  const serviceNames = getServiceNames();
  const displayName = professional?.name || 'Handyman';
  const displayLocation = professional?.location 
    ? `${professional.location.area || ''}, ${professional.location.city || ''}`.trim().replace(/^,\s*|,\s*$/g, '')
    : 'Not specified';
  const rating = professional?.rating || 0;
  const reviews = professional?.reviews || 0;
  const jobsCompleted = professional?.jobsCompleted || 0;
  const yearsExp = professional?.yearsExp || 0;
  const bio = professional?.bio || profileData?.bio || 'Experienced service provider committed to delivering quality work.';

  if (!professional) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-gray-200">
        <DialogHeader className="pb-4 border-b-2 border-gray-200 bg-gradient-to-r from-green-50 to-orange-50 -m-6 mb-0 p-6 rounded-t-3xl">
          <DialogTitle className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent flex items-center gap-3">
            <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg"></div>
            Handyman Profile
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-4" />
              <p className="text-lg text-gray-600">Loading profile...</p>
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-green-50 via-orange-50 to-green-50 p-6 rounded-2xl border-2 border-green-200 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-2xl" />
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{displayName}</h2>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star
                            key={i}
                            className={i <= Math.floor(rating) ? "text-yellow-400 fill-yellow-300" : "text-gray-300"}
                            size={18}
                          />
                        ))}
                        <span className="ml-2 text-gray-700 font-semibold">
                          {rating.toFixed(1)} <span className="text-gray-500">({reviews} reviews)</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{yearsExp} years experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{jobsCompleted} jobs completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-100 shadow-md">
                <h3 className="text-xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-3">
                  About
                </h3>
                <p className="text-gray-700 leading-relaxed">{bio}</p>
              </div>

              {/* Location Section */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-100 shadow-md">
                <h3 className="text-xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Location
                </h3>
                <p className="text-gray-700 font-medium">{displayLocation}</p>
              </div>

              {/* Skills & Services Section */}
              {serviceNames.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-100 shadow-md">
                  <h3 className="text-xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-4">
                    Services Offered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {serviceNames.map((serviceName, index) => (
                      <Badge
                        key={index}
                        className="bg-gradient-to-r from-green-100 to-orange-100 border-2 border-green-300 text-green-700 font-semibold px-4 py-2 text-sm"
                      >
                        {serviceName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HandymanProfilePopup;


