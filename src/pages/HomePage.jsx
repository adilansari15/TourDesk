import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Compass, ShieldCheck, ClipboardList, ArrowRight, UserCheck } from 'lucide-react';

export const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white flex flex-col justify-between">
      {/* Hero Section */}
      <section className="pt-16 pb-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 mb-6">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Tour Enquiry Management Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-tight">
            Manage Tour Bookings & Customer Enquiries
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Authenticated CRUD platform for travel specialists to create, view, edit, and track client tour enquiries, built with MongoDB Atlas, Express, React, and Node.js.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-md text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Go to Dashboard ({user?.name})</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>

                <Link
                  to="/enquiries"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-md text-xs font-medium bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 transition"
                >
                  <ClipboardList className="w-4 h-4 text-slate-500" />
                  <span>View All Enquiries</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-md text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  <span>Sign In to Access Enquiries</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-md text-xs font-medium bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 transition"
                >
                  <span>Create Account</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Architecture Cards */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-md border border-slate-200 bg-white">
            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-indigo-600 mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Task 1: Secure Auth</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              JWT authentication with salted bcrypt passwords, protected Express route guards, and Axios Bearer interceptors.
            </p>
          </div>

          <div className="p-6 rounded-md border border-slate-200 bg-white">
            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-indigo-600 mb-3">
              <ClipboardList className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Task 2: Tour CRUD</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Create, read, update, and delete tour enquiries with destination, dates, travelers, contact, and user references.
            </p>
          </div>

          <div className="p-6 rounded-md border border-slate-200 bg-white">
            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-indigo-600 mb-3">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">User Scoped Access</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Strict database-level user isolation ensuring specialists can only view, modify, or delete their own enquiries.
            </p>
          </div>
        </div>
      </section>

      <div className="py-4"></div>
    </div>
  );
};

export default HomePage;
