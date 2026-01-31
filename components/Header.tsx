
import React, { useContext, useState } from 'react';
import { AppScreen, ThemeContextType } from '../types'; // Removed AuthContextType
import { APP_NAME } from '../constants';
import { ThemeContext } from '../App'; // Removed AuthContext

interface HeaderProps {
  onNavigate: (screen: AppScreen) => void;
  currentPage: AppScreen;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  // const auth = useContext<AuthContextType | null>(AuthContext); // Removed AuthContext
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  const [showMenu, setShowMenu] = useState(false);

  // if (!auth) { // Removed auth check
  //   throw new Error("AuthContext must be used within an AuthProvider");
  // }
  if (!themeContext) {
    throw new Error("ThemeContext must be used within a ThemeProvider");
  }

  // const { logout, user } = auth; // Removed auth deconstruction
  const { theme, toggleTheme } = themeContext;

  // const handleLogout = () => { // Removed logout handler
  //   logout();
  //   setShowMenu(false);
  // };

  const menuItems = [
    { label: 'Home', screen: AppScreen.HOME },
    { label: 'Pay Vendor', screen: AppScreen.PAYMENT_FORM },
    { label: 'History', screen: AppScreen.TRANSACTION_HISTORY },
    { label: 'Summary', screen: AppScreen.MONTHLY_SUMMARY },
    { label: 'Vendors', screen: AppScreen.FREQUENT_VENDORS },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center">
        <h1 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
          {APP_NAME}
        </h1>
      </div>

      <nav className="hidden md:flex space-x-4">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.screen)}
            className={`px-3 py-1 rounded-md text-sm font-medium
              ${currentPage === item.screen
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }
              transition-colors duration-200`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="relative flex items-center space-x-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 4a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707A1 1 0 0114 6zM5.293 6.707a1 1 0 011.414-1.414l.707.707a1 1 0 11-1.414 1.414l-.707-.707zm0 6.586l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zm1.414 1.414a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM10 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm4.393-2.393a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* User Profile / Logout Dropdown (Simplified) */}
        {/* We can still have a placeholder for a user-like icon for aesthetic but without logout functionality */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="User menu"
          >
            <div className="h-8 w-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-blue-800 dark:text-blue-200 font-bold">
              P
            </div>
            <span className="hidden sm:inline text-sm font-medium">Public User</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50">
              <div className="block px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-600">
                Mode: <span className="font-semibold block break-all">Public (No Login)</span>
              </div>
              <button
                onClick={() => { onNavigate(AppScreen.HOME); setShowMenu(false); }} // Navigate to home as there is no profile screen
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                App Info
              </button>
              {/* No logout button */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
