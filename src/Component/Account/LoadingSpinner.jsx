import React from 'react';

const LoadingSpinner = ({ size = 8 }) => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div
        className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 border-blue-500 dark:border-blue-400`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default React.memo(LoadingSpinner);