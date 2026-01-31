
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  loading,
  ...props
}) => {
  let baseStyles = 'font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  
  if (size === 'sm') {
    baseStyles += ' px-3 py-1.5 text-sm';
  } else if (size === 'lg') {
    baseStyles += ' px-6 py-3 text-lg';
  } else { // md
    baseStyles += ' px-4 py-2 text-base';
  }

  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles = 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:ring-blue-600';
  } else if (variant === 'secondary') {
    variantStyles = 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-500';
  } else if (variant === 'danger') {
    variantStyles = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-red-600';
  } else if (variant === 'outline') {
    variantStyles = 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:border-blue-700 dark:text-blue-500 dark:hover:bg-gray-800 dark:focus:ring-blue-600';
  }

  const disabledStyles = disabled || loading ? 'opacity-60 cursor-not-allowed' : '';
  const loadingSpinner = loading ? (
    <span className="inline-flex items-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {children}
    </span>
  ) : (
    children
  );

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loadingSpinner}
    </button>
  );
};

export default Button;
