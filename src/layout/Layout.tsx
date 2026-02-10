import React from 'react';
import { FaLink, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] opacity-50"></div>
      </div>

      {/* Header - Sticky with Glassmorphism */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center group gap-3">
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                <img
                  src="/icon.webp"
                  alt="Subs 4 Unlock"
                  className="relative w-9 h-9 sm:w-11 sm:h-11 object-contain rounded-full bg-slate-900 p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
                  Subs 4 Unlock
                </h1>
                <span className="hidden sm:block text-[10px] sm:text-xs text-slate-500 font-medium tracking-wider uppercase">
                  Content Locking Made Easy
                </span>
              </div>
            </Link>

            {/* Action Button */}
            <div className="flex items-center">
              <Link
                to="/"
                className="group relative inline-flex items-center justify-center px-5 py-2 sm:px-6 sm:py-2.5 overflow-hidden font-medium text-white transition-all duration-300 bg-purple-600 rounded-full hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 opacity-100 group-hover:opacity-90 transition-opacity"></span>
                <span className="relative flex items-center gap-2 text-sm sm:text-base">
                  <FaLink className="text-white/90 group-hover:rotate-45 transition-transform duration-300" />
                  <span>Create Link</span>
                </span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-28">
        <div className="animate-fade-in-up">
           {children}
        </div>
      </main>

      {/* Modern Footer with Navigation */}
      <footer className="border-t border-white/5 bg-slate-900/40 backdrop-blur-md pt-10 pb-8 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Copyright & Credits */}
            <div className="text-center md:text-left">
              <p className="text-slate-400 text-sm font-medium">
                &copy; {new Date().getFullYear()} Subs 4 Unlock. All rights reserved.
              </p>
              <p className="text-slate-600 text-xs mt-1 flex items-center justify-center md:justify-start gap-1">
                Made with <FaHeart className="text-red-500 w-3 h-3" /> by Agung Developer
              </p>
            </div>

            {/* Footer Navigation */}
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              <Link 
                to="/about-us" 
                className="text-sm text-slate-400 hover:text-purple-400 transition-colors duration-200"
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="text-sm text-slate-400 hover:text-purple-400 transition-colors duration-200"
              >
                Contact
              </Link>
              <Link 
                to="/privacy-policy" 
                className="text-sm text-slate-400 hover:text-purple-400 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms-and-conditions" 
                className="text-sm text-slate-400 hover:text-purple-400 transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
            </nav>

          </div>
        </div>
      </footer>

    </div>
  );
};

export default Layout;