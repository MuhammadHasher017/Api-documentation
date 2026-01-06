'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className={`relative z-10 text-center px-4 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Logo/Icon */}
        <div className="mb-8 inline-block">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center transform hover:rotate-6 transition-transform duration-300">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
          Doc PDF
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 mb-4 font-light">
          Dynamic PDF Generation
        </p>
        <p className="text-base md:text-lg text-gray-500 mb-12 max-w-md mx-auto">
          Transform your JSON configurations into beautiful, professional PDFs
        </p>

        {/* CTA Button */}
        <Link href="/atlas-api-doc">
          <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <span className="relative z-10 flex items-center">
              Get Started
              <svg 
                className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          </button>
        </Link>

        {/* Features badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md text-sm text-gray-700 hover:shadow-lg transition-shadow">
            ⚡ Fast Generation
          </div>
          <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md text-sm text-gray-700 hover:shadow-lg transition-shadow">
            🎨 Customizable
          </div>
          <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md text-sm text-gray-700 hover:shadow-lg transition-shadow">
            📄 JSON-Driven
          </div>
        </div>
      </div>
    </div>
  );
}