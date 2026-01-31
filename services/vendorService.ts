
import { Vendor } from '../types';
import { LOCAL_STORAGE_KEYS, DEFAULT_USER_ID } from '../constants';
import { LocalStorageService } from './localStorageService';

const generateId = (): string => `vendor_${Math.random().toString(36).substring(2, 11)}`;

export const VendorService = {
  getVendors: async (userId: string = DEFAULT_USER_ID): Promise<Vendor[]> => { // Default to public user ID
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API call delay
    const allVendors = LocalStorageService.get<Vendor[]>(LOCAL_STORAGE_KEYS.VENDORS) || [];
    return allVendors.filter(vendor => vendor.userId === userId);
  },

  addVendor: async (newVendor: Omit<Vendor, 'id' | 'lastPaid'>): Promise<Vendor> => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call delay
    const allVendors = LocalStorageService.get<Vendor[]>(LOCAL_STORAGE_KEYS.VENDORS) || [];
    const vendor: Vendor = {
      ...newVendor,
      userId: newVendor.userId || DEFAULT_USER_ID, // Ensure userId is set, default to public
      id: generateId(),
      lastPaid: new Date().toISOString(),
    };
    allVendors.push(vendor);
    LocalStorageService.set(LOCAL_STORAGE_KEYS.VENDORS, allVendors);
    return vendor;
  },

  updateVendor: async (updatedVendor: Vendor): Promise<Vendor> => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call delay
    let allVendors = LocalStorageService.get<Vendor[]>(LOCAL_STORAGE_KEYS.VENDORS) || [];
    allVendors = allVendors.map(v => v.id === updatedVendor.id ? updatedVendor : v);
    LocalStorageService.set(LOCAL_STORAGE_KEYS.VENDORS, allVendors);
    return updatedVendor;
  },

  deleteVendor: async (vendorId: string, userId: string = DEFAULT_USER_ID): Promise<void> => { // Default to public user ID
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call delay
    let allVendors = LocalStorageService.get<Vendor[]>(LOCAL_STORAGE_KEYS.VENDORS) || [];
    allVendors = allVendors.filter(v => v.id !== vendorId || v.userId !== userId);
    LocalStorageService.set(LOCAL_STORAGE_KEYS.VENDORS, allVendors);
  },
};
