
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#14B22D] text-white shadow-xl border-t border-green-400/20">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 md:col-span-1">
            {/* LOGO IMAGE HOLDER */}
            <div className="mb-4">
              <img
                src="/lovable-uploads/a707e924-f315-4907-a798-16e19d2e7a69.png"
                alt="FixFinder Logo"
                className="h-7 sm:h-8 object-contain transition-transform duration-300 hover:scale-105"
                style={{ maxWidth: 120 }}
              />
            </div>
            <p className="text-sm sm:text-base mb-4 text-green-50 leading-relaxed">{t('footer.description')}</p>
            <div className="space-y-3">
              <div className="flex items-center text-sm sm:text-base group">
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg mr-3 group-hover:bg-white/20 transition-all duration-300">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                </div>
                <span className="hover:text-orange-200 transition-colors duration-300">+94 70 550 6127</span>
              </div>
              <div className="flex items-center text-sm sm:text-base group">
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg mr-3 group-hover:bg-white/20 transition-all duration-300">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                </div>
                <span className="break-all hover:text-orange-200 transition-colors duration-300">team3xsltc@gmail.com</span>
              </div>
              <div className="flex items-start text-sm sm:text-base group">
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg mr-3 mt-0.5 group-hover:bg-white/20 transition-all duration-300">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                </div>
                <span className="hover:text-orange-200 transition-colors duration-300">123 Main Street, Anytown, USA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 text-white">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2.5 text-sm sm:text-base">
              <li>
                <Link 
                  to="/" 
                  className="text-green-50 hover:text-orange-200 transition-all duration-300 relative group inline-block"
                >
                  {t('navbar.home')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-green-50 hover:text-orange-200 transition-all duration-300 relative group inline-block"
                >
                  {t('navbar.about')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="text-green-50 hover:text-orange-200 transition-all duration-300 relative group inline-block"
                >
                  {t('navbar.services')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-green-50 hover:text-orange-200 transition-all duration-300 relative group inline-block"
                >
                  {t('navbar.contact')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="text-green-50 hover:text-orange-200 transition-all duration-300 relative group inline-block"
                >
                  {t('navbar.login')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/signup" 
                  className="text-green-50 hover:text-orange-200 transition-all duration-300 relative group inline-block"
                >
                  {t('navbar.signUp')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 text-white">{t('footer.services')}</h3>
            <ul className="space-y-2.5 text-sm sm:text-base">
              <li>
                <Link 
                  to="/services/plumbing" 
                  className="text-green-50 hover:text-orange-200 transition-all duration-300 relative group inline-block"
                >
                  Plumbing
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/services/electrical" 
                  className="text-green-50 hover:text-orange-200 transition-all duration-300 relative group inline-block"
                >
                  Electrical
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/services/carpentry" 
                  className="text-green-50 hover:text-orange-200 transition-all duration-300 relative group inline-block"
                >
                  Carpentry
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/services/painting" 
                  className="text-green-50 hover:text-orange-200 transition-all duration-300 relative group inline-block"
                >
                  Painting
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/services/flooring" 
                  className="text-green-50 hover:text-orange-200 transition-all duration-300 relative group inline-block"
                >
                  Flooring
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link 
                  to="/services/appliance-repair" 
                  className="text-green-50 hover:text-orange-200 transition-all duration-300 relative group inline-block"
                >
                  Appliance Repair
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 text-white">{t('footer.subscribe')}</h3>
            <p className="text-sm sm:text-base mb-4 text-green-50 leading-relaxed">{t('footer.subscribeDescription')}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder={t('footer.emailPlaceholder')} 
                className="px-4 py-2.5 w-full text-gray-800 rounded-lg sm:rounded-l-lg sm:rounded-r-none text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-green-600 shadow-lg transition-all duration-300"
              />
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-6 py-2.5 rounded-lg sm:rounded-r-lg sm:rounded-l-none text-sm sm:text-base whitespace-nowrap font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105">
                {t('footer.subscribeButton')}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 sm:mt-10 pt-6 sm:pt-8 text-center">
          <div className="flex justify-center mb-4">
            {/* LOGO IMAGE HOLDER */}
            <img
              src="/lovable-uploads/a707e924-f315-4907-a798-16e19d2e7a69.png"
              alt="FixFinder Logo"
              className="h-7 sm:h-8 object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105"
              style={{ maxWidth: 120 }}
            />
          </div>
          <p className="text-sm sm:text-base text-green-50">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

