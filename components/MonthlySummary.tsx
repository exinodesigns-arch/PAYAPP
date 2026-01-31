
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Transaction, AppScreen } from '../types'; // Removed AuthContextType, TransactionCategory
import { TransactionService } from '../services/transactionService';
// Removed AuthContext import
import { ResponsiveContainer, Legend, Tooltip, BarChart, XAxis, YAxis, CartesianGrid, Bar, Cell } from 'recharts'; // Keeping PieChart for now for completeness, but not used.
import Dropdown from './Dropdown';
import { DEFAULT_USER_ID } from '../constants';

interface MonthlySummaryProps {
  onNavigate: (screen: AppScreen) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const MonthlySummary: React.FC<MonthlySummaryProps> = () => {
  // const auth = useContext<AuthContextType | null>(AuthContext); // Removed AuthContext dependency
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM

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
    } catch (err) {
      setError('Failed to fetch transactions for summary.');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]); // Only re-create if userId changes (which it won't, it's fixed)

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const aggregateByMonthAndCategory = (txns: Transaction[], month: string) => {
    const expensesByCategory: { [key: string]: number } = {};
    let totalExpenses = 0;

    txns.forEach((txn) => {
      if (txn.status === 'success' && txn.timestamp.startsWith(month)) {
        expensesByCategory[txn.category] = (expensesByCategory[txn.category] || 0) + txn.amount;
        totalExpenses += txn.amount;
      }
    });

    const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
      name: category,
      value: parseFloat(amount.toFixed(2)),
    }));

    return { chartData, totalExpenses: parseFloat(totalExpenses.toFixed(2)) };
  };

  const { chartData, totalExpenses } = aggregateByMonthAndCategory(transactions, selectedMonth);

  const getMonthOptions = useCallback(() => {
    const uniqueMonths = new Set<string>();
    transactions.forEach(txn => {
      if (txn.status === 'success') {
        uniqueMonths.add(txn.timestamp.slice(0, 7));
      }
    });
    const months = Array.from(uniqueMonths).sort().reverse(); // Latest month first
    if (!months.includes(new Date().toISOString().slice(0, 7))) {
      months.unshift(new Date().toISOString().slice(0, 7)); // Add current month if no transactions yet
    }
    return months.map(m => ({ value: m, label: new Date(m).toLocaleString('en-US', { year: 'numeric', month: 'long' }) }));
  }, [transactions]);


  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center dark:text-gray-300">
        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-3">Loading summary...</span>
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
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Monthly Spending Summary</h2>

        <div className="mb-6 flex justify-center">
          <Dropdown
            id="month-selector"
            label="Select Month"
            options={getMonthOptions()}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full md:w-auto"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300">Total Expenses for {new Date(selectedMonth).toLocaleString('en-US', { year: 'numeric', month: 'long' })}:</p>
          <p className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">₹{totalExpenses.toFixed(2)}</p>
        </div>

        {chartData.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">No spending recorded for this month.</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-gray-600" />
                <XAxis dataKey="name" stroke="#6b7280" className="dark:text-gray-300" />
                <YAxis stroke="#6b7280" className="dark:text-gray-300" />
                <Tooltip
                  formatter={(value: number) => `₹${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: 'var(--bg-color-tooltip)', border: 'none', borderRadius: '4px' }}
                  labelStyle={{ color: 'var(--text-color-tooltip-label)' }}
                  itemStyle={{ color: 'var(--text-color-tooltip-item)' }}
                />
                <Legend />
                <Bar dataKey="value" name="Amount" fill="#8884d8">
                  {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {/* Dynamic CSS variables for tooltip styling */}
      <style jsx>{`
        .recharts-tooltip-wrapper {
          --bg-color-tooltip: ${document.documentElement.classList.contains('dark') ? '#374151' : '#ffffff'};
          --text-color-tooltip-label: ${document.documentElement.classList.contains('dark') ? '#d1d5db' : '#374151'};
          --text-color-tooltip-item: ${document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937'};
        }
      `}</style>
    </div>
  );
};

export default MonthlySummary;
