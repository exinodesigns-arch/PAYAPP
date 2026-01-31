
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Transaction, AppScreen } from '../types'; // Removed AuthContextType
import { TransactionService } from '../services/transactionService';
// Removed AuthContext import
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import { TRANSACTION_CATEGORIES, DEFAULT_USER_ID } from '../constants'; // Added DEFAULT_USER_ID

interface TransactionHistoryProps {
  onNavigate: (screen: AppScreen) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = () => {
  // const auth = useContext<AuthContextType | null>(AuthContext); // Removed AuthContext dependency
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterVendor, setFilterVendor] = useState<string>('');
  const [filterProject, setFilterProject] = useState<string>('');

  // if (!auth || !auth.user) { // Removed auth check
  //   return null;
  // }
  const userId = DEFAULT_USER_ID; // Use DEFAULT_USER_ID directly

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTransactions = await TransactionService.getTransactions(userId); // Uses DEFAULT_USER_ID
      setTransactions(fetchedTransactions);
      setFilteredTransactions(fetchedTransactions); // Initially, display all
    } catch (err) {
      setError('Failed to fetch transactions.');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]); // Only re-create if userId changes (which it won't, it's fixed)

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // Fetch transactions on component mount

  // Apply filters
  useEffect(() => {
    let tempTransactions = transactions;

    if (filterDateFrom) {
      const fromDate = new Date(filterDateFrom).setHours(0, 0, 0, 0);
      tempTransactions = tempTransactions.filter(txn => new Date(txn.timestamp).getTime() >= fromDate);
    }
    if (filterDateTo) {
      const toDate = new Date(filterDateTo).setHours(23, 59, 59, 999);
      tempTransactions = tempTransactions.filter(txn => new Date(txn.timestamp).getTime() <= toDate);
    }
    if (filterCategory) {
      tempTransactions = tempTransactions.filter(txn => txn.category === filterCategory);
    }
    if (filterVendor) {
      tempTransactions = tempTransactions.filter(txn =>
        txn.vendorName.toLowerCase().includes(filterVendor.toLowerCase())
      );
    }
    if (filterProject) {
      tempTransactions = tempTransactions.filter(txn =>
        txn.projectTag.toLowerCase().includes(filterProject.toLowerCase())
      );
    }

    setFilteredTransactions(tempTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }, [transactions, filterDateFrom, filterDateTo, filterCategory, filterVendor, filterProject]);

  const exportToCsv = () => {
    if (filteredTransactions.length === 0) {
      alert('No transactions to export.');
      return;
    }

    const headers = [
      'ID', 'Timestamp', 'Vendor Name', 'UPI ID', 'Amount', 'Purpose',
      'Purpose Description', 'Category', 'Project/Tag', 'Notes', 'Status'
    ];
    const rows = filteredTransactions.map(txn => [
      txn.id,
      new Date(txn.timestamp).toLocaleString(),
      txn.vendorName,
      txn.upiId || 'N/A',
      txn.amount.toFixed(2),
      txn.purpose,
      txn.purposeDescription || '',
      txn.category,
      txn.projectTag,
      txn.notes || '',
      txn.status
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')); // CSV escape double quotes

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center dark:text-gray-300">
        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-3">Loading transactions...</span>
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

  const uniqueVendors = Array.from(new Set(transactions.map(txn => txn.vendorName)));
  const uniqueProjects = Array.from(new Set(transactions.map(txn => txn.projectTag)));

  return (
    <div className="flex-grow p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Transaction History</h2>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            id="filterDateFrom"
            label="Date From"
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
          />
          <Input
            id="filterDateTo"
            label="Date To"
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
          />
          <Dropdown
            id="filterCategory"
            label="Category"
            options={[{ value: '', label: 'All Categories' }, ...TRANSACTION_CATEGORIES]}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          />
          <Dropdown
            id="filterVendor"
            label="Vendor"
            options={[{ value: '', label: 'All Vendors' }, ...uniqueVendors.map(v => ({ value: v, label: v }))]}
            value={filterVendor}
            onChange={(e) => setFilterVendor(e.target.value)}
          />
          <Dropdown
            id="filterProject"
            label="Project"
            options={[{ value: '', label: 'All Projects' }, ...uniqueProjects.map(p => ({ value: p, label: p }))]}
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
          />
          <div className="md:col-span-2 lg:col-span-1 flex items-end">
            <Button onClick={exportToCsv} className="w-full" variant="outline">
              Export to CSV
            </Button>
          </div>
        </div>

        {/* Transaction List */}
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">No transactions found for the selected filters.</p>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(txn.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {txn.vendorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      ₹{txn.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {txn.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {txn.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${txn.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          txn.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}
                      >
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
