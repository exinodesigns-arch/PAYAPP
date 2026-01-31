
import React, { useState, useEffect, createContext, useCallback } from 'react';
import { User, AppScreen, Theme, ThemeContextType } from './types'; // Removed AuthContextType
// Removed AuthService import
import { DEFAULT_PAGE, LOCAL_STORAGE_KEYS, DEFAULT_USER_ID } from './constants'; // Added DEFAULT_USER_ID
// Removed AuthScreen import
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './components/HomeScreen';
import PaymentForm from './components/PaymentForm';
import TransactionHistory from './components/TransactionHistory';
import MonthlySummary from './components/MonthlySummary';
import FrequentVendors from './components/FrequentVendors';

// AuthContext removed as authentication is no longer needed.
// export const AuthContext = createContext<AuthContextType | null>(null);
export const ThemeContext = createContext<ThemeContextType | null>(null);

const App: React.FC = () => {
  // User is now a constant public user, no login needed
  const [user] = useState<User>({ id: DEFAULT_USER_ID, name: 'Public User' });
  // Removed isLoading state related to authentication
  const [currentPage, setCurrentPage] = useState<AppScreen>(DEFAULT_PAGE);
  const [paymentFormUpiId, setPaymentFormUpiId] = useState<string | undefined>(undefined);
  const [theme, setTheme] = useState<Theme>('light');

  // Theme Management
  useEffect(() => {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // Authentication Management removed. No checkAuth, login, signup, logout functions.

  // AuthContextValue removed

  const themeContextValue = {
    theme,
    toggleTheme,
  };

  const handleNavigate = useCallback((screen: AppScreen, params?: { upiId?: string }) => {
    if (screen === AppScreen.PAYMENT_FORM && params?.upiId) {
      setPaymentFormUpiId(params.upiId);
    } else {
      setPaymentFormUpiId(undefined); // Clear if not navigating to PaymentForm with UPI ID
    }
    setCurrentPage(screen);
  }, []);

  // Removed initial loading state for authentication, app now loads directly.
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
  //       <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  //         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  //         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  //       </svg>
  //       <span className="ml-4 text-xl text-gray-700 dark:text-gray-300">Loading app...</span>
  //     </div>
  //   );
  // }

  return (
    // AuthContext.Provider removed
    <ThemeContext.Provider value={themeContextValue}>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        {/* user always exists as public user */}
        <>
          <Header onNavigate={handleNavigate} currentPage={currentPage} />
          <main className="flex-grow flex flex-col">
            {currentPage === AppScreen.HOME && <HomeScreen onNavigate={handleNavigate} />}
            {currentPage === AppScreen.PAYMENT_FORM && <PaymentForm onNavigate={handleNavigate} initialUpiId={paymentFormUpiId} />}
            {currentPage === AppScreen.TRANSACTION_HISTORY && <TransactionHistory onNavigate={handleNavigate} />}
            {currentPage === AppScreen.MONTHLY_SUMMARY && <MonthlySummary onNavigate={handleNavigate} />}
            {currentPage === AppScreen.FREQUENT_VENDORS && <FrequentVendors onNavigate={handleNavigate} />}
            {/* Removed Profile screen, as there's no user profile management */}
          </main>
          <Footer onNavigate={handleNavigate} currentPage={currentPage} />
        </>
        {/* AuthScreen removed */}
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
