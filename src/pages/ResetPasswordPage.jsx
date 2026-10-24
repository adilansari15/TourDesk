import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { resetPassword } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';

export const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth(); // If we want to auto-login them, but usually they just go to login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setGeneralError('');

    try {
      const response = await resetPassword(token, formData.password);
      if (response.success) {
        setSuccessMessage('Password reset successfully. You can now login with your new password.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      } else {
        setGeneralError(response.message || 'Error resetting password');
      }
    } catch (error) {
      setGeneralError(error.response?.data?.message || 'Server error. Link may be invalid or expired.');
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
              Reset Password
            </h1>
            <p className="mt-1 text-xs text-[#6b7280]">
              Enter your new password below
            </p>
          </div>

          {generalError && (
            <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 flex items-start space-x-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{generalError}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-md bg-green-50 border border-green-200 flex items-start space-x-2 text-green-700 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0 text-green-600 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-10 py-2 bg-white border text-sm rounded-md focus:outline-hidden focus:ring-1 focus:ring-indigo-600 ${
                      formErrors.password ? 'border-red-400' : 'border-slate-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-10 py-2 bg-white border text-sm rounded-md focus:outline-hidden focus:ring-1 focus:ring-indigo-600 ${
                      formErrors.confirmPassword ? 'border-red-400' : 'border-slate-300'
                    }`}
                  />
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="mt-5 text-center text-xs text-[#6b7280]">
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
