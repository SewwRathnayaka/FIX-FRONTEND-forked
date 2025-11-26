
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Wrench, Droplet, Lightbulb, PaintBucket, HardHat, Home } from "lucide-react";
import * as React from "react";
import ServiceDetailDialog from "@/components/services/ServiceDetailDialog";
import serviceBg from "@/assets/images/service back1.jpg";
import plumbingI from "@/assets/images/plumbing.jpg";
import carpentryI from "@/assets/images/capentry.jpg";
import electricalI from "@/assets/images/electrical.jpg";
import paintingI from "@/assets/images/painting.jpg";
import renovationsI from "@/assets/images/renovation.jpg";
import homerepI from "@/assets/images/homerepair.jpg";



// ServiceKey matches dialog's ServiceKey type.

interface Service {
  key: string;
  nameKey: string;
  descriptionKey: string;
  imageUrl: string;
  icon: React.ReactNode;
  baseFee?: number;
}

interface ServiceCardProps {
  name: string;
  description: string;
  imageUrl: string;
  icon: React.ReactNode;
}

const ServiceCard = ({ name, description, imageUrl, icon }: ServiceCardProps) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 focus:outline-none w-full text-left">
      <div className="h-48 sm:h-56 overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
            <div className="[&>svg]:text-white [&>svg]:h-6 [&>svg]:w-6">
              {icon}
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300">{name}</h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};


const Services = () => {
  const { t } = useTranslation();
  
  const SERVICES: Service[] = [
    {
      key: "applianceRepair",
      nameKey: "services.serviceList.applianceRepair.name",
      descriptionKey: "services.serviceList.applianceRepair.description",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      icon: <Wrench className="h-5 w-5 text-green-500" />,
      baseFee: 75
    },
    {
      key: "carpentry",
      nameKey: "services.serviceList.carpentry.name",
      descriptionKey: "services.serviceList.carpentry.description",
      imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
      icon: <Wrench className="h-5 w-5 text-green-500" />,
      baseFee: 60
    },
    {
      key: "cleaning",
      nameKey: "services.serviceList.cleaning.name",
      descriptionKey: "services.serviceList.cleaning.description",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      icon: <Home className="h-5 w-5 text-green-500" />,
      baseFee: 50
    },
    {
      key: "electrical",
      nameKey: "services.serviceList.electrical.name",
      descriptionKey: "services.serviceList.electrical.description",
      imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop",
      icon: <Lightbulb className="h-5 w-5 text-green-500" />,
      baseFee: 80
    },
    {
      key: "gardening",
      nameKey: "services.serviceList.gardening.name",
      descriptionKey: "services.serviceList.gardening.description",
      imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop",
      icon: <Home className="h-5 w-5 text-green-500" />,
      baseFee: 45
    },
    {
      key: "homeRepair",
      nameKey: "services.serviceList.homeRepair.name",
      descriptionKey: "services.serviceList.homeRepair.description",
      imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop",
      icon: <Home className="h-5 w-5 text-green-500" />,
      baseFee: 65
    },
    {
      key: "painting",
      nameKey: "services.serviceList.painting.name",
      descriptionKey: "services.serviceList.painting.description",
      imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=400&fit=crop",
      icon: <PaintBucket className="h-5 w-5 text-green-500" />,
      baseFee: 55
    },
    {
      key: "plumbing",
      nameKey: "services.serviceList.plumbing.name",
      descriptionKey: "services.serviceList.plumbing.description",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      icon: <Droplet className="h-5 w-5 text-green-500" />,
      baseFee: 70
    },
    {
      key: "roofing",
      nameKey: "services.serviceList.roofing.name",
      descriptionKey: "services.serviceList.roofing.description",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      icon: <HardHat className="h-5 w-5 text-green-500" />,
      baseFee: 100
    },
    {
      key: "windowCleaning",
      nameKey: "services.serviceList.windowCleaning.name",
      descriptionKey: "services.serviceList.windowCleaning.description",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      icon: <Home className="h-5 w-5 text-green-500" />,
      baseFee: 40
    },
    {
      key: "pestControl",
      nameKey: "services.serviceList.pestControl.name",
      descriptionKey: "services.serviceList.pestControl.description",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      icon: <Home className="h-5 w-5 text-green-500" />,
      baseFee: 85
    }
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="relative bg-gray-900 py-16 sm:py-20 md:py-24 min-h-[60vh] flex items-center">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${serviceBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              width: "100%",
              height: "100%"
            }}
          />
          {/* Overlay for better text readability */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backgroundBlendMode: "overlay"
            }}
          />
          {/* Decorative gradient overlays */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-green-900/40 via-transparent to-orange-900/30" />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-green-900/50" />
          
          <div className="relative z-10 container mx-auto px-4 text-center w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 px-2 leading-tight drop-shadow-2xl">
              <span className="bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                {t('services.hero.title')}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-green-50 max-w-3xl mx-auto px-2 leading-relaxed drop-shadow-lg">
              {t('services.hero.subtitle')}
            </p>
          </div>
        </div>
        
        <div className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-20 left-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {SERVICES.map((service) => (
                <ServiceCard 
                  key={service.key}
                  name={t(service.nameKey)}
                  description={t(service.descriptionKey)}
                  imageUrl={service.imageUrl}
                  icon={service.icon}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="py-16 sm:py-20 md:py-24 bg-gradient-to-r from-green-600 via-green-500 to-green-600 relative overflow-hidden shadow-2xl">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-300/20 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 sm:mb-8 px-2 drop-shadow-2xl">
              {t('services.cta.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-green-50 mb-8 sm:mb-10 max-w-3xl mx-auto px-2 leading-relaxed drop-shadow-lg">
              {t('services.cta.description')}
            </p>
            <a href="/contact" className="inline-block">
              <Button 
                size="lg" 
                className="bg-white/90 backdrop-blur-sm text-green-600 hover:bg-white hover:text-green-700 px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full"
              >
                {t('services.cta.button')}
              </Button>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;

