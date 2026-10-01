import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EnquiriesPage from './pages/EnquiriesPage.jsx';
import CreateEnquiryPage from './pages/CreateEnquiryPage.jsx';
import EditEnquiryPage from './pages/EditEnquiryPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      <Navbar />

      <main className="flex-1 flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes (Require JWT Auth) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enquiries"
            element={
              <ProtectedRoute>
                <EnquiriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enquiries/new"
            element={
              <ProtectedRoute>
                <CreateEnquiryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enquiries/edit/:id"
            element={
              <ProtectedRoute>
                <EditEnquiryPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Task 2: Tour Enquiry Management Platform (MERN Stack)</span>
          <span>MongoDB Atlas • Express • React • Node • JWT Authentication</span>
        </div>
      </footer>
    </div>
  );
}
