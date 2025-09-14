import React from 'react';

const LoadingProgressBar = ({ 
  progress = 0, 
  className = '', 
  showPercentage = true, 
  label = '',
  size = 'default',
  variant = 'blue'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'h-1';
      case 'large': return 'h-4';
      default: return 'h-2';
    }
  };

  const getColorClasses = () => {
    switch (variant) {
      case 'green': return 'bg-green-600';
      case 'red': return 'bg-red-600';
      case 'yellow': return 'bg-yellow-600';
      default: return 'bg-blue-600';
    }
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${getSizeClasses()}`}>
        <div 
          className={`${getSizeClasses()} ${getColorClasses()} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingProgressBar;
