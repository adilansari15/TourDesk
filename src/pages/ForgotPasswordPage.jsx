import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { forgotPassword } from '../services/authService.js';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState(''); // Just for development since there is no email configured
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setResetToken('');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      setError('Email is required');
      return;
    } else if (!emailRegex.test(email)) {
      setError('Please provide a valid email');
      return;
    }

    setSubmitting(true);
    try {
      const response = await forgotPassword(email.trim());
      if (response.success) {
        setMessage('Reset link sent to your email.');
        // For development purpose, expose the token directly if email configuration is absent
        if (response.data) {
          setResetToken(response.data);
        }
      } else {
        setError(response.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-[#fafafa]">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-md border border-slate-200 shadow-xs">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[#111111] tracking-tight">
              Forgot Password
            </h1>
            <p className="mt-1 text-xs text-[#6b7280]">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 flex items-start space-x-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-5 p-3 rounded-md bg-green-50 border border-green-200 flex items-start space-x-2 text-green-700 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0 text-green-600 mt-0.5" />
              <div className="flex flex-col">
                <span>{message}</span>
                {resetToken && (
                  <div className="mt-2 text-xs">
                    <p className="font-semibold text-gray-700">Development Mode:</p>
                    <p>Normally this would be sent to your email.</p>
                    <Link to={`/reset-password/${resetToken}`} className="text-indigo-600 underline">
                      Click here to reset your password
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 text-sm rounded-md focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-[#6b7280]">
            Remember your password?{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
