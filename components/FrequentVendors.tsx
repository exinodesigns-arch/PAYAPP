
import React, { useState, useEffect, useCallback } from 'react'; // Removed useContext
import { Vendor, AppScreen } from '../types'; // Removed AuthContextType
import { VendorService } from '../services/vendorService';
// Removed AuthContext import
import Input from './Input';
import Button from './Button';
import Modal from './Modal';
import { DEFAULT_USER_ID } from '../constants';

interface FrequentVendorsProps {
  onNavigate: (screen: AppScreen, params?: { upiId?: string }) => void;
}

const FrequentVendors: React.FC<FrequentVendorsProps> = ({ onNavigate }) => {
  // const auth = useContext<AuthContextType | null>(AuthContext); // Removed AuthContext dependency
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);
  const [vendorName, setVendorName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [modalErrors, setModalErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  // if (!auth || !auth.user) { // Removed auth check
  //   return null;
  // }
  const userId = DEFAULT_USER_ID; // Use DEFAULT_USER_ID directly

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedVendors = await VendorService.getVendors(userId); // Uses DEFAULT_USER_ID
      setVendors(fetchedVendors);
    } catch (err) {
      setError('Failed to fetch frequent vendors.');
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]); // Only re-create if userId changes (which it won't, it's fixed)

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const validateModalFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!vendorName.trim()) newErrors.vendorName = 'Vendor Name is required.';
    if (!upiId.trim()) newErrors.upiId = 'UPI ID is required.';
    else if (!/^[a-zA-Z0-9.\-]+@[a-zA-Z0-9.\-]+$/.test(upiId.trim())) newErrors.upiId = 'Invalid UPI ID format.';
    setModalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (vendor?: Vendor) => {
    setCurrentVendor(vendor || null);
    setVendorName(vendor ? vendor.name : '');
    setUpiId(vendor ? vendor.upiId : '');
    setModalErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentVendor(null);
    setVendorName('');
    setUpiId('');
    setModalErrors({});
  };

  const handleSaveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateModalFields() || isSaving) return;

    setIsSaving(true);
    try {
      if (currentVendor) {
        // Update existing vendor
        const updated = await VendorService.updateVendor({ ...currentVendor, name: vendorName, upiId: upiId });
        setVendors(vendors.map(v => (v.id === updated.id ? updated : v)));
      } else {
        // Add new vendor
        const added = await VendorService.addVendor({ userId, name: vendorName, upiId: upiId }); // Uses DEFAULT_USER_ID
        setVendors([...vendors, added]);
      }
      handleCloseModal();
    } catch (err) {
      setError('Failed to save vendor.');
      console.error('Error saving vendor:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;

    try {
      await VendorService.deleteVendor(vendorId, userId); // Uses DEFAULT_USER_ID
      setVendors(vendors.filter(v => v.id !== vendorId));
    } catch (err) {
      setError('Failed to delete vendor.');
      console.error('Error deleting vendor:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center dark:text-gray-300">
        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-3">Loading vendors...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center text-red-600 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-grow p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Frequent Vendors</h2>

        <div className="flex justify-end mb-4">
          <Button onClick={() => handleOpenModal()} variant="primary">
            Add New Vendor
          </Button>
        </div>

        {vendors.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">No frequent vendors added yet.</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {vendors.map((vendor) => (
                <li key={vendor.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{vendor.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{vendor.upiId}</p>
                      {vendor.lastPaid && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Last Paid: {new Date(vendor.lastPaid).toLocaleDateString()}</p>
                      )}
                    </div>
                    <div className="flex space-x-2 mt-3 sm:mt-0">
                      <Button size="sm" onClick={() => onNavigate(AppScreen.PAYMENT_FORM, { upiId: vendor.upiId })}>
                        Pay
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleOpenModal(vendor)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteVendor(vendor.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={currentVendor ? 'Edit Vendor' : 'Add New Vendor'}
        >
          <form onSubmit={handleSaveVendor} className="p-4">
            <Input
              id="vendorNameModal"
              label="Vendor Name"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              error={modalErrors.vendorName}
              disabled={isSaving}
              required
            />
            <Input
              id="upiIdModal"
              label="UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              error={modalErrors.upiId}
              disabled={isSaving}
              required
            />
            <div className="flex justify-end space-x-4 mt-6">
              <Button type="button" variant="secondary" onClick={handleCloseModal} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" loading={isSaving} disabled={isSaving}>
                Save Vendor
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default FrequentVendors;
