
export interface User {
  id: string;
  // phoneNumber: string; // Not applicable for public user
  // email?: string;     // Not applicable for public user
  name?: string; // Optional name for a generic public user
}

export enum PaymentPurpose {
  MATERIAL = 'Material',
  SERVICE = 'Service',
  TRANSPORT = 'Transport',
  MAINTENANCE = 'Maintenance',
  SUBSCRIPTION = 'Subscription',
  OTHER = 'Other',
}

export enum TransactionCategory {
  BUSINESS_EXPENSE = 'Business Expense',
  PERSONAL_EXPENSE = 'Personal Expense',
  OFFICE = 'Office',
  MARKETING = 'Marketing',
  OPERATIONS = 'Operations',
  MISCELLANEOUS = 'Miscellaneous',
}

export interface Transaction {
  id: string;
  userId: string;
  vendorName: string;
  upiId?: string; // Optional if scanned from QR
  purpose: PaymentPurpose;
  purposeDescription?: string; // Required if purpose is 'Other'
  category: TransactionCategory;
  projectTag: string;
  amount: number;
  notes?: string;
  invoiceReference?: string;
  timestamp: string; // ISO 8601 string
  status: 'success' | 'failed' | 'pending';
}

export interface Vendor {
  id: string;
  userId: string;
  name: string;
  upiId: string;
  lastPaid?: string; // ISO 8601 string
}

export enum AppScreen {
  // AUTH = 'AUTH', // No longer needed
  HOME = 'HOME',
  PAYMENT_FORM = 'PAYMENT_FORM',
  TRANSACTION_HISTORY = 'TRANSACTION_HISTORY',
  MONTHLY_SUMMARY = 'MONTHLY_SUMMARY',
  FREQUENT_VENDORS = 'FREQUENT_VENDORS',
  // PROFILE = 'PROFILE', // Removed as there's no user profile management
}

export type Theme = 'light' | 'dark';

// Context types
// AuthContextType removed as authentication is no longer needed.

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
