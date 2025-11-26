import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench, Menu, X, Shield } from "lucide-react";
import { SignUpButton, SignedOut, SignedIn, UserButton, SignInButton, useUser } from '@clerk/clerk-react';
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

interface NavbarProps {
  showHandymanDashboard?: boolean;
  showAdminDashboard?: boolean;
}

const Navbar = ({ showHandymanDashboard = false, showAdminDashboard = false }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="bg-[#14B22D] shadow-xl backdrop-blur-md border-b border-green-400/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center h-8 sm:h-10 transition-transform duration-300 hover:scale-105" onClick={() => setIsMobileMenuOpen(false)}>
              {/* LOGO IMAGE HOLDER */}
              <img
                src="/lovable-uploads/a707e924-f315-4907-a798-16e19d2e7a69.png"
                alt="FixFinder Logo"
                className="h-8 sm:h-10 object-contain"
                style={{ maxWidth: 150 }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              to="/" 
              className="text-white hover:text-orange-200 font-semibold text-sm lg:text-base transition-all duration-300 relative group px-2 py-1"
            >
              {t('navbar.home')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/about" 
              className="text-white hover:text-orange-200 font-semibold text-sm lg:text-base transition-all duration-300 relative group px-2 py-1"
            >
              {t('navbar.about')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/services" 
              className="text-white hover:text-orange-200 font-semibold text-sm lg:text-base transition-all duration-300 relative group px-2 py-1"
            >
              {t('navbar.services')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/contact" 
              className="text-white hover:text-orange-200 font-semibold text-sm lg:text-base transition-all duration-300 relative group px-2 py-1"
            >
              {t('navbar.contact')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <LanguageSwitcher variant="dark" />
            <SignedOut>
              <SignInButton mode="modal">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/90 backdrop-blur-sm text-green-600 hover:bg-white hover:text-green-700 border-white/20 shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold px-4 lg:px-5"
                >
                  {t('navbar.login')}
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 font-semibold px-4 lg:px-5"
                >
                  {t('navbar.signUp')}
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link to="/client/dashboard">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold px-4 lg:px-5"
                >
                  {t('navbar.dashboard')}
                </Button>
              </Link>
              {showHandymanDashboard && (
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold px-4 lg:px-5"
                  onClick={() => window.open('/handyman/dashboard', '_blank')}
                >
                  {t('navbar.serviceDashboard')}
                </Button>
              )}
              {showAdminDashboard && (
                <Link to="/admin/dashboard">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold px-4 lg:px-5"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-1 sm:space-x-2">
            <div className="flex-shrink-0">
              <LanguageSwitcher variant="dark" />
            </div>
            <SignedIn>
              <div className="flex-shrink-0">
                <UserButton />
              </div>
            </SignedIn>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 backdrop-blur-sm p-2 flex-shrink-0 rounded-lg transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4 backdrop-blur-md bg-white/5 rounded-lg">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-white hover:text-orange-200 font-semibold py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navbar.home')}
              </Link>
              <Link 
                to="/about" 
                className="text-white hover:text-orange-200 font-semibold py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navbar.about')}
              </Link>
              <Link 
                to="/services" 
                className="text-white hover:text-orange-200 font-semibold py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navbar.services')}
              </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-orange-200 font-semibold py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navbar.contact')}
              </Link>
              <div className="pt-3 border-t border-white/20">
                <SignedOut>
                  <div className="flex flex-col space-y-2">
                    <SignInButton mode="modal">
                      <Button 
                        variant="outline" 
                        className="w-full bg-white/90 backdrop-blur-sm text-green-600 hover:bg-white hover:text-green-700 border-white/20 shadow-lg transition-all duration-300 font-semibold"
                      >
                        {t('navbar.login')}
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg transition-all duration-300 font-semibold"
                      >
                        {t('navbar.signUp')}
                      </Button>
                    </SignUpButton>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex flex-col space-y-2">
                    <Link to="/client/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white shadow-lg transition-all duration-300 font-semibold"
                      >
                        {t('navbar.dashboard')}
                      </Button>
                    </Link>
                    {showHandymanDashboard && (
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg transition-all duration-300 font-semibold"
                        onClick={() => {
                          window.open('/handyman/dashboard', '_blank');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {t('navbar.serviceDashboard')}
                      </Button>
                    )}
                    {showAdminDashboard && (
                      <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg transition-all duration-300 font-semibold"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
