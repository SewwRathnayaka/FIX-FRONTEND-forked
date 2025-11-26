
import React from "react";
import { useTranslation } from "react-i18next";

interface Testimonial {
  id: number;
  avatar: string;
  testimonialKey: string;
}

const CustomerTestimonials = () => {
  const { t } = useTranslation();
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      avatar: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=64&h=64&q=80",
      testimonialKey: "testimonial1"
    },
    {
      id: 2,
      avatar: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=64&h=64&q=80",
      testimonialKey: "testimonial2"
    },
    {
      id: 3,
      avatar: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=64&h=64&q=80",
      testimonialKey: "testimonial3"
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 px-2">
            <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              {t('homepage.testimonials.title')}
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          {testimonials.map(({ id, avatar, testimonialKey }) => {
            const name = t(`homepage.testimonials.${testimonialKey}.name`);
            const quote = t(`homepage.testimonials.${testimonialKey}.quote`);
            const occupation = t(`homepage.testimonials.${testimonialKey}.occupation`);
            
            return (
              <div
                key={id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center border border-gray-100 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative mb-4">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-green-100 group-hover:ring-green-400 transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mb-4">
                  <svg className="w-8 h-8 text-green-400 mx-auto mb-3 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed font-medium">&quot;{quote}&quot;</p>
                <div className="mt-auto">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{name}</h3>
                  <p className="text-sm sm:text-base text-green-600 font-medium">{occupation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
