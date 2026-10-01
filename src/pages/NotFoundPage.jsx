import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full text-center">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-md flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h1 className="text-5xl font-semibold text-slate-900 tracking-tight">404</h1>
        <h2 className="mt-2 text-lg font-semibold text-slate-800">Page Not Found</h2>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          The requested page or route does not exist. Please check the URL or return to the dashboard.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go to Dashboard</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
