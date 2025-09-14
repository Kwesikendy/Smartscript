import React from 'react';

const LoadingSpinner = ({ size = 'default', className = '', text = '' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'h-4 w-4';
      case 'large': return 'h-8 w-8';
      default: return 'h-6 w-6';
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${getSizeClasses()} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
