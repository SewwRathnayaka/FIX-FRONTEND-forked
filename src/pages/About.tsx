
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTranslation } from "react-i18next";
import AboutImage from "@/assets/images/about.png";
import { Users, Heart, Building2 } from "lucide-react";

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 py-16 sm:py-20 md:py-24 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 px-2 drop-shadow-2xl">
              <span className="bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                {t('about.hero.title')}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-green-50 max-w-3xl mx-auto px-2 leading-relaxed drop-shadow-lg">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </div>
        
        {/* Who We Are Section */}
        <div className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-20 left-0 w-72 h-72 bg-green-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
              <div className="md:w-1/2 w-full group">
                <img 
                  src={AboutImage}
                  alt="About FixFinder" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover transform transition-all duration-300 hover:scale-105"
                />
              </div>
              <div className="md:w-1/2 w-full">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 sm:mb-8">
                  <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    {t('about.whoWeAre.title')}
                  </span>
                </h2>
                <div className="space-y-4 sm:space-y-5">
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    {t('about.whoWeAre.paragraph1')}
                  </p>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    {t('about.whoWeAre.paragraph2')}
                  </p>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    {t('about.whoWeAre.paragraph3')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mission Section */}
        <div className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 px-2">
                <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  {t('about.mission.title')}
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl flex-1 transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
                <div className="flex justify-center mb-5">
                  <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-4 text-center">{t('about.mission.forCustomers.title')}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">
                  {t('about.mission.forCustomers.description')}
                </p>
              </div>
              <div className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl flex-1 transition-all duration-300 transform hover:-translate-y-2 border border-orange-100">
                <div className="flex justify-center mb-5">
                  <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-orange-600 mb-4 text-center">{t('about.mission.forHandymen.title')}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">
                  {t('about.mission.forHandymen.description')}
                </p>
              </div>
              <div className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl flex-1 transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
                <div className="flex justify-center mb-5">
                  <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-4 text-center">{t('about.mission.forCommunities.title')}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">
                  {t('about.mission.forCommunities.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="py-16 sm:py-20 md:py-24 bg-gradient-to-r from-green-600 via-green-500 to-green-600 relative overflow-hidden shadow-2xl">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-300/20 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-8 sm:mb-10 px-2 drop-shadow-2xl">
              {t('about.cta.title')}
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link 
                to="/services" 
                className="bg-white/90 backdrop-blur-sm text-green-600 hover:bg-white hover:text-green-700 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-base sm:text-lg shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t('about.cta.browseServices')}
              </Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-base sm:text-lg shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105"
              >
                {t('about.cta.joinFixFinder')}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
