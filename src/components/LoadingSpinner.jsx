import React from 'react';

export const LoadingSpinner = ({ message = 'Verifying authentication...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      {message && (
        <p className="mt-4 text-sm font-medium text-slate-600 tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
