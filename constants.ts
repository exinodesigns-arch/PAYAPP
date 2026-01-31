
import { PaymentPurpose, TransactionCategory, AppScreen } from './types';

export const APP_NAME = 'UPI PayTracker';

export const PAYMENT_PURPOSES: { value: PaymentPurpose; label: string }[] = [
  { value: PaymentPurpose.MATERIAL, label: 'Material' },
  { value: PaymentPurpose.SERVICE, label: 'Service' },
  { value: PaymentPurpose.TRANSPORT, label: 'Transport' },
  { value: PaymentPurpose.MAINTENANCE, label: 'Maintenance' },
  { value: PaymentPurpose.SUBSCRIPTION, label: 'Subscription' },
  { value: PaymentPurpose.OTHER, label: 'Other' },
];

export const TRANSACTION_CATEGORIES: { value: TransactionCategory; label: string }[] = [
  { value: TransactionCategory.BUSINESS_EXPENSE, label: 'Business Expense' },
  { value: TransactionCategory.PERSONAL_EXPENSE, label: 'Personal Expense' },
  { value: TransactionCategory.OFFICE, label: 'Office' },
  { value: TransactionCategory.MARKETING, label: 'Marketing' },
  { value: TransactionCategory.OPERATIONS, label: 'Operations' },
  { value: TransactionCategory.MISCELLANEOUS, label: 'Miscellaneous' },
];

export const DEFAULT_PAGE = AppScreen.HOME;

export const LOCAL_STORAGE_KEYS = {
  // USER_TOKEN: 'upi_paytracker_user_token', // Removed
  // USERS: 'upi_paytracker_users',           // Removed
  TRANSACTIONS: 'upi_paytracker_transactions',
  VENDORS: 'upi_paytracker_vendors',
  THEME: 'upi_paytracker_theme',
};

export const DEFAULT_USER_ID = 'public_user'; // A fixed ID for all public operations

export const MOCKED_PROJECT_TAGS = ['Project Alpha', 'Marketing Campaign Q3', 'Office Renovation', 'Personal Spendings'];
