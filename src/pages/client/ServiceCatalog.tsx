
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const ServiceCatalog = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  // Fetch services from backend
  const { data: servicesResponse, isLoading, error } = useServices();

  // Extract services from API response and sort alphabetically
  const services = useMemo(() => {
    if (!servicesResponse?.data) {
      return [];
    }
    // The API returns { success: true, data: [...], message: "..." }
    // So we need to access servicesResponse.data directly
    const servicesArray = servicesResponse.data;
    
    return servicesArray.sort((a: any, b: any) => 
      a.name.localeCompare(b.name)
    );
  }, [servicesResponse]);

  // Filter services based on search
  const filteredServices = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return services.filter((service: any) =>
      service.name.toLowerCase().includes(lowerSearch)
    );
  }, [services, search]);

  // Handle service click
  const handleServiceClick = (service: any) => {
    navigate("/client/service-details", { state: { service } });
  };

  // Loading state
  if (isLoading) {
    return (
      <ClientDashboardLayout title={t("client.serviceCatalog.title")} subtitle={t("client.serviceCatalog.subtitle")}>
        <div className="max-w-7xl mx-auto relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center py-20">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                  <span className="text-gray-700 font-medium">{t("client.serviceCatalog.loadingServices")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClientDashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <ClientDashboardLayout title={t("client.serviceCatalog.title")} subtitle={t("client.serviceCatalog.subtitle")}>
        <div className="max-w-7xl mx-auto relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="text-center py-20">
              <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl border-2 border-red-200 shadow-xl p-8 max-w-2xl mx-auto">
                <p className="text-red-600 mb-4 font-bold text-lg">{t("client.serviceCatalog.failedToLoad")}</p>
                <p className="text-sm text-gray-600 mb-6">
                  {error.message || t("client.serviceCatalog.failedHint")}
                </p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold px-6 py-2"
                >
                  {t("client.serviceCatalog.tryAgain")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ClientDashboardLayout>
    );
  }

  return (
    <ClientDashboardLayout title={t("client.serviceCatalog.title")} subtitle={t("client.serviceCatalog.subtitle")}>
      <div className="max-w-7xl mx-auto relative overflow-hidden">
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
            {t("client.serviceCatalog.back")}
          </button>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("client.serviceCatalog.searchPlaceholder")}
              className="pl-12 pr-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-md hover:shadow-lg bg-white"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Service List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredServices.map((service: any) => (
              <div
                key={service._id || service.serviceId}
                className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 p-6 sm:p-8 border-2 border-gray-100 hover:border-green-200 group"
                onClick={() => handleServiceClick(service)}
              >
                {/* Service Image Container */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-orange-100 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  {service.imageUrl ? (
                    <img 
                      src={service.imageUrl} 
                      alt={service.name}
                      className="w-20 h-20 object-cover rounded-full shadow-md"
                      onError={(e) => {
                        // Fallback to default icon if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback Icon */}
                  <span className={`text-5xl drop-shadow-lg ${service.imageUrl ? 'hidden' : ''}`}>
                    {getServiceIcon(service.name)}
                  </span>
                </div>
                
                {/* Service Name */}
                <span className="font-extrabold text-gray-800 text-center text-base sm:text-lg leading-tight group-hover:text-green-700 transition-colors duration-300">
                  {getTranslatedServiceName(service.name, t)}
                </span>
                
                {/* Service Description (optional) */}
                {service.description && (
                  <span className="text-xs sm:text-sm text-gray-500 text-center line-clamp-2 leading-relaxed">
                    {getTranslatedServiceDescription(service.name, t) || service.description}
                  </span>
                )}
              </div>
            ))}
            
            {filteredServices.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100">
                <p className="text-gray-600 font-semibold text-lg mb-2">
                  {search ? t("client.serviceCatalog.noServicesFound") : t("client.serviceCatalog.noServicesAvailable")}
                </p>
                {search && (
                  <p className="text-sm text-gray-500">
                    Try searching with different keywords
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientDashboardLayout>
  );
};

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
    // If translation returns the key itself, it means translation is missing, use original name
    return translated !== translationKey ? translated : serviceName;
  }
  return serviceName;
};

// Helper function to get translated service description
const getTranslatedServiceDescription = (serviceName: string, t: (key: string) => string): string | null => {
  const translationKey = getServiceTranslationKey(serviceName, 'description');
  if (translationKey) {
    const translated = t(translationKey);
    // If translation returns the key itself, it means translation is missing, return null
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
  if (name.includes('heating') || name.includes('hvac')) return '🔥';
  if (name.includes('cooling') || name.includes('ac')) return '❄️';
  
  return '🔧'; // Default icon
};

export default ServiceCatalog;
