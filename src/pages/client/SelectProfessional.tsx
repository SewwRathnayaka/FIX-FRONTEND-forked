import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from '@clerk/clerk-react';
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import BookingDetailsDialog from "@/components/client/BookingDetailsDialog";
import HandymanProfilePopup from "@/components/client/HandymanProfilePopup";
import { HandymanAPI } from "@/lib/api";

interface Professional {
  _id: string;
  userId: string;
  name: string;
  status: "Available Now" | "Busy";
  title: string;
  rating: number;
  reviews: number;
  jobsCompleted: number;
  yearsExp: number;
  distance: string;
  services: string[]; // Changed from skills to services
  bio: string;
  location: {
    city: string;
    area: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  availability: {
    [key: string]: string[];
  };
}

type SortOption = 'distance' | 'rating' | 'experience' | null;

const SelectProfessional = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const service = location.state?.service;
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [originalProfessionals, setOriginalProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSort, setCurrentSort] = useState<SortOption>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  // Sorting functions
  const sortByDistance = (a: Professional, b: Professional) => {
    const distanceA = parseFloat(a.distance);
    const distanceB = parseFloat(b.distance);
    return distanceA - distanceB; // Least to highest
  };

  const sortByRating = (a: Professional, b: Professional) => {
    return b.rating - a.rating; // Highest to lowest
  };

  const sortByExperience = (a: Professional, b: Professional) => {
    return b.yearsExp - a.yearsExp; // Highest to lowest
  };

  const handleSort = (sortOption: SortOption) => {
    setCurrentSort(sortOption);
    
    if (!sortOption) {
      setProfessionals([...originalProfessionals]);
      return;
    }

    const sortedProfessionals = [...originalProfessionals];
    
    switch (sortOption) {
      case 'distance':
        sortedProfessionals.sort(sortByDistance);
        break;
      case 'rating':
        sortedProfessionals.sort(sortByRating);
        break;
      case 'experience':
        sortedProfessionals.sort(sortByExperience);
        break;
    }
    
    setProfessionals(sortedProfessionals);
  };

  // Search functionality
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    
    if (!searchValue.trim()) {
      // If no search term, apply current sort to original data
      if (currentSort) {
        handleSort(currentSort);
      } else {
        setProfessionals([...originalProfessionals]);
      }
      return;
    }

    // Filter professionals based on search term
    const filtered = originalProfessionals.filter(professional =>
      professional.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      professional.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      professional.services.some(service => 
        service.toLowerCase().includes(searchValue.toLowerCase())
      )
    );

    // Apply current sort to filtered results
    if (currentSort) {
      switch (currentSort) {
        case 'distance':
          filtered.sort(sortByDistance);
          break;
        case 'rating':
          filtered.sort(sortByRating);
          break;
        case 'experience':
          filtered.sort(sortByExperience);
          break;
      }
    }

    setProfessionals(filtered);
  };

  useEffect(() => {
    const fetchProfessionals = async () => {
      if (!service?._id) {
        setError("No service selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await HandymanAPI.getServiceProvidersByServiceId(service._id);
        
        if (response.success) {
          // Filter out the current user's own handyman profile to prevent self-booking
          const filteredProfessionals = response.data.filter((professional: Professional) => {
            return professional.userId !== user?.id;
          });
          
          setProfessionals(filteredProfessionals);
          setOriginalProfessionals(filteredProfessionals);
        } else {
          setError(response.message || "Failed to fetch professionals");
        }
      } catch (err) {
        console.error("Error fetching professionals:", err);
        setError("Failed to load professionals");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [service?._id, user?.id]);

  if (loading) {
    return (
      <ClientDashboardLayout title={`${service?.name || 'Service'} - Select a Professional`} subtitle="">
        <div className="max-w-6xl mx-auto relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center py-20">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                  <span className="text-gray-700 font-medium text-lg">Loading professionals...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClientDashboardLayout>
    );
  }

  if (error) {
    return (
      <ClientDashboardLayout title={`${service?.name || 'Service'} - Select a Professional`} subtitle="">
        <div className="max-w-6xl mx-auto relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center py-20">
              <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl border-2 border-red-200 shadow-xl p-8 max-w-2xl mx-auto text-center">
                <p className="text-red-600 font-bold text-lg mb-4">{error}</p>
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold px-6 py-2"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ClientDashboardLayout>
    );
  }

  return (
    <ClientDashboardLayout title={`${service?.name || 'Service'} - Select a Professional`} subtitle="">
      <div className="max-w-6xl mx-auto relative overflow-hidden">
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
            Back to Service Details
          </button>

          {/* Search and Sort Section */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-6 border-2 border-gray-100">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="font-semibold text-gray-700">Sort by:</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`rounded-full transition-all duration-300 ${
                    currentSort === 'distance' 
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-lg hover:shadow-xl" 
                      : "hover:bg-green-50 border-gray-300"
                  }`}
                  onClick={() => handleSort(currentSort === 'distance' ? null : 'distance')}
                >
                  Distance
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`rounded-full transition-all duration-300 ${
                    currentSort === 'rating' 
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-lg hover:shadow-xl" 
                      : "hover:bg-green-50 border-gray-300"
                  }`}
                  onClick={() => handleSort(currentSort === 'rating' ? null : 'rating')}
                >
                  Rating
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`rounded-full transition-all duration-300 ${
                    currentSort === 'experience' 
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-lg hover:shadow-xl" 
                      : "hover:bg-green-50 border-gray-300"
                  }`}
                  onClick={() => handleSort(currentSort === 'experience' ? null : 'experience')}
                >
                  Experience
                </Button>
              </div>
              <div className="flex items-center gap-2 w-full lg:w-auto">
                <Input
                  type="search"
                  placeholder="Search professionals..."
                  className="w-full lg:w-64 border-2 border-gray-200 focus:border-green-500 rounded-full shadow-md focus:shadow-lg transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-600">
              <div className="font-semibold">Showing: <span className="text-green-600">{professionals.length}</span> available professionals</div>
              {currentSort && (
                <div className="text-green-600 font-medium bg-green-50 rounded-full px-3 py-1">
                  Sorted by: {currentSort === 'distance' ? 'Distance (nearest first)' : 
                             currentSort === 'rating' ? 'Rating (highest first)' : 
                             'Experience (most experienced first)'}
                </div>
              )}
            </div>
          </div>

          {/* Professionals List */}
          <div className="space-y-4">
            {professionals.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-gray-100 p-12 text-center">
                <p className="text-gray-600 font-semibold text-lg">No professionals found matching your search.</p>
              </div>
            ) : (
              professionals.map((professional) => (
                <div 
                  key={professional._id} 
                  className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border-2 border-gray-100 hover:border-green-200 hover:shadow-2xl transition-all duration-300 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div 
                      className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-300"
                      onClick={() => {
                        setSelectedProfessional(professional);
                        setShowProfilePopup(true);
                      }}
                      title="View Profile"
                    >
                      {professional.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-gray-800">{professional.name}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold shadow-md ${
                          professional.status === "Available Now" 
                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white" 
                            : "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                        }`}>
                          {professional.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 font-medium">
                        {professional.services && professional.services.length > 0 
                          ? professional.services.join(', ')
                          : professional.title
                        }
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center gap-1 bg-yellow-50 rounded-full px-3 py-1">
                          <span className="text-yellow-500 text-base">★</span>
                          <span className="font-semibold text-gray-700">
                            {professional.rating}
                          </span>
                          <span className="text-gray-500">
                            ({professional.reviews} reviews)
                          </span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-600 font-medium">
                          {professional.jobsCompleted} jobs completed
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 lg:gap-8 flex-shrink-0">
                    <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-md">
                      <div className="text-2xl font-extrabold text-green-700">{professional.yearsExp}</div>
                      <div className="text-xs text-gray-600 font-semibold uppercase">Years Exp.</div>
                    </div>
                    <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 shadow-md">
                      <div className="text-2xl font-extrabold text-orange-700">{professional.distance} km</div>
                      <div className="text-xs text-gray-600 font-semibold uppercase">Away</div>
                    </div>
                    <Button 
                      onClick={() => navigate('/client/create-booking', { 
                        state: { 
                          service, 
                          professional,
                          serviceId: service._id,
                          providerId: professional.userId
                        } 
                      })}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-bold px-8 py-6 whitespace-nowrap"
                    >
                      Hire Now
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <BookingDetailsDialog
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
      />

      <HandymanProfilePopup
        open={showProfilePopup}
        onOpenChange={setShowProfilePopup}
        professional={selectedProfessional}
      />
    </ClientDashboardLayout>
  );
};

export default SelectProfessional;
