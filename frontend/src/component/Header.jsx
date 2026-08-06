import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100" id="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a className="flex items-center gap-2" href="#">
              <img
                src="src/assets/logo.png"
                alt="Post Bridge Logo"
                className="h-8 w-auto"
              />
              <span className="font-bold text-xl text-navy tracking-tight">post bridge</span>
            </a>
          </div>
          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-500">
            <a className="hover:text-gray-900 transition-colors" href="#">Reviews</a>
            <a className="hover:text-gray-900 transition-colors" href="#">Features</a>
            <a className="hover:text-gray-900 transition-colors" href="#">Platforms</a>
            <div className="relative group"></div>
          </nav>
          {/* Login Button */}
          <div className="hidden md:flex items-center">
            <Link
              className="px-6 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
              to='/sign-in'
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
