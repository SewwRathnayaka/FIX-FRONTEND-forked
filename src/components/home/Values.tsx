
import { CheckCircle, Heart, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const Values = () => {
  const { t } = useTranslation();
  return (
    <div className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-green-50 via-orange-50 to-green-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="md:w-1/3 w-full text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {t('homepage.values.title').split(' ')[0]}
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                {t('homepage.values.title').split(' ')[1]} {t('homepage.values.title').split(' ')[2]}
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                {t('homepage.values.title').split(' ').slice(3).join(' ')}
              </span>
            </h2>
          </div>
          
          <div className="md:w-2/3 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="group rounded-2xl p-6 sm:p-8 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-3 text-gray-800">{t('homepage.values.qualityAssurance.title')}</h3>
              <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                {t('homepage.values.qualityAssurance.description')}
              </p>
            </div>
            
            <div className="group rounded-2xl p-6 sm:p-8 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-3 text-gray-800">{t('homepage.values.customerSatisfaction.title')}</h3>
              <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                {t('homepage.values.customerSatisfaction.description')}
              </p>
            </div>
            
            <div className="group rounded-2xl p-6 sm:p-8 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100 sm:col-span-2 md:col-span-1">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-3 text-gray-800">{t('homepage.values.onTimeService.title')}</h3>
              <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                {t('homepage.values.onTimeService.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Values;
