
import { CheckCircle, UserCheck, FileText, DollarSign, CreditCard, Wrench, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState, useCallback } from "react";

interface StepCardProps {
  stepNumber: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "yellow" | "orange";
  image: string;
  isActive: boolean;
}

const StepCard = ({ stepNumber, icon, title, description, color, image, isActive }: StepCardProps) => {
  const bgColor = color === "yellow" ? "bg-yellow-400" : "bg-orange-400";
  
  return (
    <div 
      className={`
        ${bgColor} rounded-lg p-4 sm:p-6 shadow-md relative flex flex-col items-center text-center 
        transition-all duration-300 ease-in-out
        ${isActive 
          ? 'scale-105 opacity-100 blur-0 z-10' 
          : 'scale-95 opacity-60 blur-sm'
        }
        w-[280px] sm:w-[320px] md:w-[280px] lg:w-[300px] flex-shrink-0
      `}
    >
      {/* Step Number Badge */}
      <div className={`absolute -top-4 -left-4 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg border-4 border-white z-10 transition-all duration-300 ${
        isActive ? 'bg-gray-800' : 'bg-gray-500'
      }`}>
        {stepNumber}
      </div>
      
      {/* Step Image */}
      <div className="w-full mb-4 flex-shrink-0">
        <img 
          src={image} 
          alt={title}
          className="w-full h-32 sm:h-40 md:h-36 lg:h-40 object-contain rounded-lg bg-white p-2"
        />
      </div>
      
      {/* Step Content */}
      <div className="flex items-center justify-center mb-2 sm:mb-3 flex-wrap">
        <div className="bg-white rounded-full p-2 mr-2 flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm sm:text-base text-gray-800">{description}</p>
    </div>
  );
};

const HowItWorks = () => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const steps = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      titleKey: "homepage.howItWorks.chooseService.title",
      descriptionKey: "homepage.howItWorks.chooseService.description",
      color: "yellow" as const,
      image: "/lovable-uploads/How-it-works/Choose Service.png"
    },
    {
      icon: <UserCheck className="h-6 w-6 text-green-500" />,
      titleKey: "homepage.howItWorks.chooseProvider.title",
      descriptionKey: "homepage.howItWorks.chooseProvider.description",
      color: "orange" as const,
      image: "/lovable-uploads/How-it-works/Choose Service Provider.png"
    },
    {
      icon: <FileText className="h-6 w-6 text-green-500" />,
      titleKey: "homepage.howItWorks.createBooking.title",
      descriptionKey: "homepage.howItWorks.createBooking.description",
      color: "yellow" as const,
      image: "/lovable-uploads/How-it-works/Create Booking.png"
    },
    {
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      titleKey: "homepage.howItWorks.handymanConfirms.title",
      descriptionKey: "homepage.howItWorks.handymanConfirms.description",
      color: "orange" as const,
      image: "/lovable-uploads/How-it-works/Handyman Confirms.png"
    },
    {
      icon: <CreditCard className="h-6 w-6 text-green-500" />,
      titleKey: "homepage.howItWorks.customerPays.title",
      descriptionKey: "homepage.howItWorks.customerPays.description",
      color: "yellow" as const,
      image: "/lovable-uploads/How-it-works/Pay & Confirm.png"
    },
    {
      icon: <Wrench className="h-6 w-6 text-green-500" />,
      titleKey: "homepage.howItWorks.handymanCompletes.title",
      descriptionKey: "homepage.howItWorks.handymanCompletes.description",
      color: "orange" as const,
      image: "/lovable-uploads/How-it-works/Work Completion.png"
    },
    {
      icon: <Star className="h-6 w-6 text-green-500" />,
      titleKey: "homepage.howItWorks.customerReviews.title",
      descriptionKey: "homepage.howItWorks.customerReviews.description",
      color: "yellow" as const,
      image: "/lovable-uploads/How-it-works/Confirm & Review.png"
    }
  ];

  // Smooth scroll to center the selected step
  const scrollToIndex = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const child = container.children[index] as HTMLElement;
    if (!child) return;

    const containerRect = container.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();
    const scrollLeft = container.scrollLeft;
    
    // Calculate the position to center the card
    const cardLeft = childRect.left - containerRect.left + scrollLeft;
    const cardWidth = childRect.width;
    const containerWidth = containerRect.width;
    const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }, []);

  // Navigate to next step
  const goToNext = () => {
    if (activeIndex < steps.length - 1) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      scrollToIndex(nextIndex);
    }
  };

  // Navigate to previous step
  const goToPrevious = () => {
    if (activeIndex > 0) {
      const prevIndex = activeIndex - 1;
      setActiveIndex(prevIndex);
      scrollToIndex(prevIndex);
    }
  };

  // Initialize: scroll to first card on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const timer = setTimeout(() => {
        scrollToIndex(0);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [scrollToIndex]);

  return (
    <div className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-white via-green-50/30 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-green-100/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 px-2">
            <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              {t('homepage.howItWorks.title')}
            </span>
          </h2>
        </div>
        
        {/* Horizontal Scroll Container with Arrows */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            disabled={activeIndex === 0}
            className={`
              absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20
              bg-white rounded-full p-3 sm:p-4 shadow-xl
              hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 transition-all duration-300
              disabled:opacity-30 disabled:cursor-not-allowed
              flex items-center justify-center
              transform hover:scale-110 disabled:hover:scale-100
              border-2 border-gray-100 hover:border-green-500
            `}
            aria-label="Previous step"
          >
            <ChevronLeft className={`h-6 w-6 sm:h-8 sm:w-8 transition-colors duration-300 ${
              activeIndex === 0 ? 'text-gray-400' : 'text-gray-800 group-hover:text-white'
            }`} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            disabled={activeIndex === steps.length - 1}
            className={`
              absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20
              bg-white rounded-full p-3 sm:p-4 shadow-xl
              hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 transition-all duration-300
              disabled:opacity-30 disabled:cursor-not-allowed
              flex items-center justify-center
              transform hover:scale-110 disabled:hover:scale-100
              border-2 border-gray-100 hover:border-green-500
            `}
            aria-label="Next step"
          >
            <ChevronRight className={`h-6 w-6 sm:h-8 sm:w-8 transition-colors duration-300 ${
              activeIndex === steps.length - 1 ? 'text-gray-400' : 'text-gray-800 group-hover:text-white'
            }`} />
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-4 sm:gap-5 md:gap-6 px-12 sm:px-16 md:px-20 py-8 scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {steps.map((step, index) => (
              <div
                key={index}
                className="snap-center"
              >
                <StepCard 
                  stepNumber={index + 1}
                  icon={step.icon}
                  title={t(step.titleKey)}
                  description={t(step.descriptionKey)}
                  color={step.color}
                  image={step.image}
                  isActive={index === activeIndex}
                />
              </div>
            ))}
          </div>

          {/* Scroll indicator dots */}
          <div className="flex justify-center gap-3 mt-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  scrollToIndex(index);
                }}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 w-10 shadow-lg shadow-green-500/50' 
                    : 'bg-gray-300 hover:bg-green-400 w-3 hover:w-4'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Custom scrollbar styles */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default HowItWorks;
