
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import plumbing from "@/assets/images/plumbing.jpg";
import carpentry from "@/assets/images/capentry.jpg";
import electrical from "@/assets/images/electrical.jpg";

interface ServiceCardProps {
  title: string;
  image: string;
  description: string;
}

const ServiceCard = ({ title, image, description }: ServiceCardProps) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      <div className="h-48 sm:h-56 overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-600/80 via-green-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6 sm:p-8">
        <h3 className="text-gray-800 text-xl sm:text-2xl font-bold mb-3 text-center group-hover:text-green-600 transition-colors duration-300">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">{description}</p>
      </div>
    </div>
  );
};

const ServiceShowcase = () => {
  const { t } = useTranslation();
  
  const services = [
    {
      key: "carpentry",
      image: carpentry,
      titleKey: "homepage.services.carpentry.title",
      descriptionKey: "homepage.services.carpentry.description"
    },
    {
      key: "plumbing",
      image: plumbing,
      titleKey: "homepage.services.plumbing.title",
      descriptionKey: "homepage.services.plumbing.description"
    },
    {
      key: "electrical",
      image: electrical,
      titleKey: "homepage.services.electrical.title",
      descriptionKey: "homepage.services.electrical.description"
    }
  ];

  return (
    <div className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-green-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 px-2">
            <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              {t('homepage.services.title')}
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2 leading-relaxed">
          {t('homepage.services.subtitle')}
        </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 mb-12">
          {services.map((service) => (
            <ServiceCard 
              key={service.key}
              title={t(service.titleKey)}
              image={service.image}
              description={t(service.descriptionKey)}
            />
          ))}
        </div>
        
        <div className="flex justify-center">
          <Link to="/services#top" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-semibold shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 rounded-full">
              {t('homepage.services.viewAll')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceShowcase;
