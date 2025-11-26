
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/images/Hero.jpg";
import { Sparkles } from "lucide-react";

const Hero = () => {
  const { t } = useTranslation();
  return (
    <div className="relative bg-gray-900 overflow-hidden min-h-screen flex flex-col">
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: `url(${heroImage})`,
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
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backgroundBlendMode: "overlay"
        }}
      />
      
      {/* Decorative gradient overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-green-900/30 via-transparent to-orange-900/20" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-green-900/50" />
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 sm:py-28 md:py-36 lg:py-44 flex-1 flex items-center">
        <div className="max-w-3xl w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20 shadow-lg">
            <Sparkles className="h-4 w-4 text-orange-400" />
            <span className="text-white text-sm font-medium">{t('homepage.hero.tagline')}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 sm:mb-8 leading-tight drop-shadow-2xl">
            {t('homepage.hero.title').split('\n').map((line, index) => (
              <span key={index} className="block">
                
                <span className="block mt-2">{line}</span>
              </span>
            ))}
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-green-100 mb-8 sm:mb-10 leading-relaxed max-w-2xl drop-shadow-lg">
            {t('homepage.hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link to="/services" className="w-full sm:w-auto group">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 text-sm sm:text-base md:text-lg font-semibold shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 rounded-full"
              >
                {t('homepage.hero.bookService')}
              </Button>
            </Link>
            <Link to="/signup/handyman" className="w-full sm:w-auto group">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-2 border-green-400 bg-white/10 backdrop-blur-md text-white hover:bg-green-500 hover:border-green-500 px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 text-sm sm:text-base md:text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full"
              >
                {t('homepage.hero.joinAsHandyman')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Modern bottom banner */}
      <div className="relative z-10 bg-gradient-to-r from-green-600 via-green-500 to-green-600 py-4 sm:py-5 md:py-6 px-4 shadow-2xl border-t border-green-400/20">
        <div className="container mx-auto">
          <p className="text-white text-center text-xs sm:text-sm md:text-base lg:text-lg font-medium px-2">
            <span className="text-orange-300 font-semibold">✨</span> {t('homepage.hero.tagline')} <span className="text-orange-300 font-semibold">✨</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
