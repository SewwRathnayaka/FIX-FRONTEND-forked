
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Helper function to map service names from API to translation keys
const getServiceTranslationKey = (serviceName: string, type: 'name' | 'description' = 'name'): string | null => {
  const name = serviceName.toLowerCase().trim();
  const suffix = type === 'name' ? 'name' : 'description';
  
  // Map service names to translation keys (case-insensitive, handles variations)
  if (name.includes('appliance') && name.includes('repair')) return `services.serviceList.applianceRepair.${suffix}`;
  if (name === 'carpentry') return `services.serviceList.carpentry.${suffix}`;
  if (name === 'cleaning' || name.includes('cleaning')) return `services.serviceList.cleaning.${suffix}`;
  if (name === 'electrical' || name.includes('electrical')) return `services.serviceList.electrical.${suffix}`;
  if (name === 'gardening' || name.includes('garden')) return `services.serviceList.gardening.${suffix}`;
  if ((name === 'home repair' || name.includes('home repair')) && !name.includes('window')) return `services.serviceList.homeRepair.${suffix}`;
  if (name === 'painting' || name.includes('paint')) return `services.serviceList.painting.${suffix}`;
  if (name === 'plumbing' || name.includes('plumb')) return `services.serviceList.plumbing.${suffix}`;
  if (name === 'roofing' || name.includes('roof')) return `services.serviceList.roofing.${suffix}`;
  if (name === 'window cleaning' || (name.includes('window') && name.includes('clean'))) return `services.serviceList.windowCleaning.${suffix}`;
  if (name === 'pest control' || (name.includes('pest') && name.includes('control'))) return `services.serviceList.pestControl.${suffix}`;
  if (name === 'landscaping' || name.includes('landscap')) return `services.serviceList.landscaping.${suffix}`;
  if (name === 'security' || name.includes('secur')) return `services.serviceList.security.${suffix}`;
  if (name === 'hvac' || name.includes('hvac') || (name.includes('heating') && name.includes('cooling'))) return `services.serviceList.hvac.${suffix}`;
  if (name === 'renovation' || name.includes('renovation') || name.includes('remodel')) return `services.serviceList.renovation.${suffix}`;
  
  return null;
};

// Helper function to get translated service name
const getTranslatedServiceName = (serviceName: string, t: (key: string) => string): string => {
  const translationKey = getServiceTranslationKey(serviceName, 'name');
  if (translationKey) {
    const translated = t(translationKey);
    return translated !== translationKey ? translated : serviceName;
  }
  return serviceName;
};

// Helper function to get translated service description
const getTranslatedServiceDescription = (serviceName: string, t: (key: string) => string): string | null => {
  const translationKey = getServiceTranslationKey(serviceName, 'description');
  if (translationKey) {
    const translated = t(translationKey);
    return translated !== translationKey ? translated : null;
  }
  return null;
};

// Helper function to get service icons based on service name
const getServiceIcon = (serviceName: string): string => {
  const name = serviceName.toLowerCase();
  
  // Enhanced icons with better visual appeal
  if (name.includes('electrical') || name.includes('electric')) return '⚡';
  if (name.includes('plumbing') || name.includes('pipe')) return '🔧';
  if (name.includes('carpentry') || name.includes('wood')) return '🪚';
  if (name.includes('painting') || name.includes('paint')) return '🎨';
  if (name.includes('cleaning') || name.includes('clean')) return '✨';
  if (name.includes('gardening') || name.includes('garden')) return '🌱';
  if (name.includes('roofing') || name.includes('roof')) return '🏠';
  if (name.includes('appliance') || name.includes('repair')) return '🔨';
  if (name.includes('pest') || name.includes('control')) return '🛡️';
  if (name.includes('window')) return '🪟';
  if (name.includes('home') || name.includes('house')) return '🏡';
  if (name.includes('renovation') || name.includes('remodel')) return '🏗️';
  if (name.includes('landscaping')) return '🌿';
  if (name.includes('security') || name.includes('lock')) return '🔒';
  if (name.includes('hvac') || (name.includes('heating') && name.includes('cooling'))) return '🔥';
  
  return '🔧'; // Default icon
};

const ServiceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const service = location.state?.service;
  


  // Use actual service data from MongoDB
  const serviceDetails = {
    duration: t("client.serviceDetails.duration"),
    startingPrice: `$${service?.baseFee || 85}`,
    description: service?.name 
      ? (getTranslatedServiceDescription(service.name, t) || service?.description || t("client.serviceDetails.defaultDescription"))
      : t("client.serviceDetails.defaultDescription"),
    features: [
      {
        titleKey: "client.serviceDetails.features.professionalService.title",
        descriptionKey: "client.serviceDetails.features.professionalService.description"
      },
      {
        titleKey: "client.serviceDetails.features.qualityWork.title",
        descriptionKey: "client.serviceDetails.features.qualityWork.description"
      },
      {
        titleKey: "client.serviceDetails.features.timelyService.title",
        descriptionKey: "client.serviceDetails.features.timelyService.description"
      },
      {
        titleKey: "client.serviceDetails.features.customerSatisfaction.title",
        descriptionKey: "client.serviceDetails.features.customerSatisfaction.description"
      },
      {
        titleKey: "client.serviceDetails.features.reliableService.title",
        descriptionKey: "client.serviceDetails.features.reliableService.description"
      }
    ]
  };

  if (!service) {
    return (
      <ClientDashboardLayout title={t("client.serviceDetails.title")} subtitle="">
        <div className="max-w-4xl mx-auto relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-100/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 max-w-2xl mx-auto">
              <p className="text-gray-600 font-semibold text-lg mb-6">{t("client.serviceDetails.noServiceSelected")}</p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/client/service-catalog")}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold px-6 py-2"
              >
                {t("client.serviceDetails.backToCatalog")}
              </Button>
            </div>
          </div>
        </div>
      </ClientDashboardLayout>
    );
  }

  return (
    <ClientDashboardLayout title={t("client.serviceDetails.title")} subtitle="">
      <div className="max-w-4xl mx-auto relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-semibold group transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
            {t("client.serviceDetails.backToCatalog")}
          </button>

          {/* Service Header Card */}
          <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white p-6 sm:p-8 rounded-2xl mb-6 shadow-xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-200/20 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                <div className="bg-white rounded-full p-4 sm:p-5 mr-4 mb-4 sm:mb-0 shadow-xl">
                  <span className="text-3xl sm:text-4xl drop-shadow-lg">{service.icon || getServiceIcon(service.name)}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 drop-shadow-lg">
                    {getTranslatedServiceName(service.name, t)} {t("client.serviceDetails.services")}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-green-50">
                    <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                      <span className="text-lg">⏱</span> 
                      <span className="font-semibold">{serviceDetails.duration}</span>
                    </span>
                    <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                      <span className="text-lg">💰</span> 
                      <span className="font-semibold">{t("client.serviceDetails.startingFrom")} {serviceDetails.startingPrice}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About & Features Card */}
          <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl mb-6 border-2 border-gray-100">
            <div className="mb-8">
              <h3 className="text-xl sm:text-2xl font-extrabold mb-4">
                <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  {t("client.serviceDetails.aboutThisService")}
                </span>
              </h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{serviceDetails.description}</p>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold mb-6">
                <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  {t("client.serviceDetails.whatsIncluded")}
                </span>
              </h3>
              <div className="space-y-5">
                {serviceDetails.features.map((feature, index) => (
                  <div key={index} className="flex items-start p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-orange-50/50 hover:from-green-50 hover:to-orange-50 transition-all duration-300 border border-gray-100 hover:border-green-200 hover:shadow-md">
                    <div className="mt-1 mr-4 flex-shrink-0">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">✓</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1 text-base sm:text-lg">{t(feature.titleKey)}</h4>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{t(feature.descriptionKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Book Now Card */}
          <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border-2 border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <div className="text-sm sm:text-base text-gray-600 font-medium mb-2">{t("client.serviceDetails.serviceFee")}</div>
                <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
                  {serviceDetails.startingPrice}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">{t("client.serviceDetails.additionalChargesNote")}</div>
              </div>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-bold text-base sm:text-lg px-8 py-6 w-full sm:w-auto"
                onClick={() => {
                  navigate('/client/select-professional', { state: { service } });
                }}
              >
                {t("client.serviceDetails.bookNow")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ClientDashboardLayout>
  );
};

export default ServiceDetails;
