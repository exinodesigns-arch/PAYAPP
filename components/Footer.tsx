
import React from 'react';
import { AppScreen } from '../types';

interface FooterProps {
  onNavigate: (screen: AppScreen) => void;
  currentPage: AppScreen;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, currentPage }) => {
  const navItems = [
    { label: 'Home', screen: AppScreen.HOME, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { label: 'Pay', screen: AppScreen.PAYMENT_FORM, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
    { label: 'History', screen: AppScreen.TRANSACTION_HISTORY, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )},
    { label: 'Summary', screen: AppScreen.MONTHLY_SUMMARY, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { label: 'Vendors', screen: AppScreen.FREQUENT_VENDORS, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2-2H7a2 2 0 00-2 2H3a2 2 0 00-2 2v12a2 2 0 002 2h14zm-7-2h4m-4-7V5h4v6m-4 0a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z" />
      </svg>
    )},
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <footer className="md:hidden sticky bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 p-2 z-40 transition-colors duration-300">
        <nav className="flex justify-around items-center">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.screen)}
              className={`flex flex-col items-center p-2 rounded-lg text-xs font-medium
                ${currentPage === item.screen
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700'
                  : 'text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300'
                }
                transition-colors duration-200`}
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
      </footer>

      {/* Desktop/Larger screens Footer */}
      <footer className="hidden md:block bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-4 text-center mt-auto transition-colors duration-300">
        <p>&copy; {new Date().getFullYear()} {new Date().getFullYear()} UPI PayTracker. All rights reserved.</p>
        <p className="text-sm mt-1">
          This is a simulated application for demonstration purposes. Payments are not real.
        </p>
      </footer>
    </>
  );
};

export default Footer;
