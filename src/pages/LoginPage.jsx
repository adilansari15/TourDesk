import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const { login, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const origin = location.state?.from?.pathname || '/dashboard';
      navigate(origin, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
      clearError();
    }
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please provide a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setGeneralError('');

    const result = await login(formData.email.trim(), formData.password);
    setSubmitting(false);

    if (result.success) {
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } else {
      setGeneralError(result.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-[#fafafa]">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-md border border-slate-200 shadow-xs">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[#111111] tracking-tight">
              Sign In
            </h1>
            <p className="mt-1 text-xs text-[#6b7280]">
              Enter your credentials to access your protected dashboard
            </p>
          </div>

          {generalError && (
            <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 flex items-start space-x-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{generalError}</span>
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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full pl-9 pr-3 py-2 bg-white border text-sm rounded-md focus:outline-hidden focus:ring-1 focus:ring-indigo-600 ${
                    formErrors.email ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-[#6b7280]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
