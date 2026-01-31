
import { Transaction } from '../types';
import { LOCAL_STORAGE_KEYS, DEFAULT_USER_ID } from '../constants';
import { LocalStorageService } from './localStorageService';

const generateId = (): string => `txn_${Math.random().toString(36).substring(2, 11)}`;

export const TransactionService = {
  getTransactions: async (userId: string = DEFAULT_USER_ID): Promise<Transaction[]> => { // Default to public user ID
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call delay
    const allTransactions = LocalStorageService.get<Transaction[]>(LOCAL_STORAGE_KEYS.TRANSACTIONS) || [];
    return allTransactions.filter(txn => txn.userId === userId);
  },

  addTransaction: async (newTransaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>): Promise<Transaction> => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call delay for payment processing
    const allTransactions = LocalStorageService.get<Transaction[]>(LOCAL_STORAGE_KEYS.TRANSACTIONS) || [];

    // Simulate UPI intent success/failure randomly for demonstration
    const isSuccess = Math.random() > 0.1; // 90% success rate
    const status = isSuccess ? 'success' : 'failed';

    const transaction: Transaction = {
      ...newTransaction,
      userId: newTransaction.userId || DEFAULT_USER_ID, // Ensure userId is set, default to public
      id: generateId(),
      timestamp: new Date().toISOString(),
      status,
    };
    allTransactions.push(transaction);
    LocalStorageService.set(LOCAL_STORAGE_KEYS.TRANSACTIONS, allTransactions);
    return transaction;
  },

  // In a real app, you might have update/delete methods.
  // For this app, only add and get are needed for the specified features.
};
