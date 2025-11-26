
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
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
                {t('contact.hero.title')}
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-green-50 max-w-3xl mx-auto px-2 leading-relaxed drop-shadow-lg">
              {t('contact.hero.subtitle')}
            </p>
          </div>
        </div>
        
        {/* Form and Contact Info Section */}
        <div className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-white via-green-50/20 to-white relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-20 left-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16">
              {/* Contact Form */}
              <div className="lg:w-1/2 w-full">
                <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 sm:mb-6">
                    <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                      {t('contact.form.title')}
                    </span>
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                    {t('contact.form.description')}
                  </p>
                  
                  <form className="space-y-5 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                      <div>
                        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2" htmlFor="first-name">
                          {t('contact.form.firstName')}
                        </label>
                        <input
                          id="first-name"
                          type="text"
                          className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md"
                          placeholder={t('contact.form.firstNamePlaceholder')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2" htmlFor="last-name">
                          {t('contact.form.lastName')}
                        </label>
                        <input
                          id="last-name"
                          type="text"
                          className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md"
                          placeholder={t('contact.form.lastNamePlaceholder')}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2" htmlFor="email">
                        {t('contact.form.email')}
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md"
                        placeholder={t('contact.form.emailPlaceholder')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2" htmlFor="subject">
                        {t('contact.form.subject')}
                      </label>
                      <input
                        id="subject"
                        type="text"
                        className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md"
                        placeholder={t('contact.form.subjectPlaceholder')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2" htmlFor="message">
                        {t('contact.form.message')}
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all duration-300 shadow-sm hover:shadow-md"
                        placeholder={t('contact.form.messagePlaceholder')}
                      ></textarea>
                    </div>
                    
                    <div>
                      <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-base sm:text-lg font-semibold py-5 sm:py-6 shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 rounded-full">
                        {t('contact.form.submitButton')}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="lg:w-1/2 w-full">
                <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 h-full">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 sm:mb-8">
                    <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                      {t('contact.info.title')}
                    </span>
                  </h3>
                  
                  <div className="space-y-5 sm:space-y-6">
                    <div className="group flex items-start p-4 rounded-xl hover:bg-green-50/50 transition-all duration-300">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-1">{t('contact.info.phone')}</h4>
                        <p className="text-sm sm:text-base text-gray-600 font-medium">+94 70 550 6127</p>
                        <p className="text-sm sm:text-base text-gray-600">{t('contact.info.monFri')}</p>
                      </div>
                    </div>
                    
                    <div className="group flex items-start p-4 rounded-xl hover:bg-orange-50/50 transition-all duration-300">
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-1">{t('contact.info.email')}</h4>
                        <p className="text-sm sm:text-base text-gray-600 break-all font-medium">team3xsltc@gmail.com</p>
                      </div>
                    </div>
                    
                    <div className="group flex items-start p-4 rounded-xl hover:bg-green-50/50 transition-all duration-300">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-1">{t('contact.info.office')}</h4>
                        <p className="text-sm sm:text-base text-gray-600 font-medium">123 Main Street</p>
                        <p className="text-sm sm:text-base text-gray-600">Anytown, USA 12345</p>
                      </div>
                    </div>
                    
                    <div className="group flex items-start p-4 rounded-xl hover:bg-green-50/50 transition-all duration-300">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-1">{t('contact.info.workingHours')}</h4>
                        <p className="text-sm sm:text-base text-gray-600 font-medium">{t('contact.info.mondayFriday')}</p>
                        <p className="text-sm sm:text-base text-gray-600">{t('contact.info.saturday')}</p>
                        <p className="text-sm sm:text-base text-gray-600">{t('contact.info.sunday')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map Section */}
        <div className="h-64 sm:h-80 md:h-96 w-full relative overflow-hidden shadow-2xl">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2626.131346521185!2d-122.41941648515827!3d37.77492997975857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f7e1bba1a0d35%3A0xc5f20b64717e04b9!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1650444268692!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          ></iframe>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
