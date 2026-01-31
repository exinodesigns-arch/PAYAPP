
import React from 'react'; // Removed useContext and AuthContextType
import Button from './Button';
import { AppScreen } from '../types'; // Removed AuthContextType
// Removed AuthContext import

interface HomeScreenProps {
  onNavigate: (screen: AppScreen, params?: { upiId?: string }) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  // const auth = useContext<AuthContextType | null>(AuthContext); // Removed AuthContext dependency

  // if (!auth || !auth.user) { // Removed auth check, as app is always public
  //   console.error("User not authenticated in HomeScreen.");
  //   return null;
  // }

  const handleScanQR = () => {
    // Simulate QR code scanning for web. In a real mobile app, this would open the camera.
    // For this demo, we'll just navigate to the payment form and assume the user would manually input or paste the UPI ID from a QR.
    alert('QR Code scanning is simulated. Please proceed to "Enter UPI ID" to manually input vendor details or a UPI ID for payment.');
    onNavigate(AppScreen.PAYMENT_FORM);
  };

  const handleEnterUpiId = () => {
    onNavigate(AppScreen.PAYMENT_FORM);
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-800 rounded-lg shadow-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Welcome to PayTracker!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">What would you like to do today?</p>

        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full py-4 text-xl"
            onClick={handleScanQR}
          >
            Scan UPI QR Code
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full py-4 text-xl"
            onClick={handleEnterUpiId}
          >
            Enter UPI ID Manually
          </Button>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm">
          <p>Quick access:</p>
          <div className="flex justify-center space-x-4 mt-2">
            <button onClick={() => onNavigate(AppScreen.TRANSACTION_HISTORY)} className="text-blue-600 dark:text-blue-400 hover:underline">
              View History
            </button>
            <button onClick={() => onNavigate(AppScreen.MONTHLY_SUMMARY)} className="text-blue-600 dark:text-blue-400 hover:underline">
              Monthly Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
