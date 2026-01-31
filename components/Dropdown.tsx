
import React from 'react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  id: string;
  options: DropdownOption[];
  placeholder?: string;
  error?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ label, id, options, placeholder, error, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                    sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600
                    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
                    ${props.disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}
                    ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled selected={!props.value} className="text-gray-400 dark:text-gray-500">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Dropdown;
