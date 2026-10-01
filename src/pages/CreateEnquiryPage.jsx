import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createEnquiry } from '../services/enquiryService.js';
import { ArrowLeft, Send } from 'lucide-react';

export const CreateEnquiryPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    destination: '',
    travelDate: '',
    travelers: 1,
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'travelers' ? (value === '' ? '' : Number(value)) : value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.destination.trim() ||
      !formData.travelDate
    ) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.travelers < 1) {
      setError('Number of travelers must be at least 1');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await createEnquiry(formData);
      navigate('/enquiries');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Failed to submit tour enquiry. Please check your details and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full">
      <div className="mb-6">
        <Link
          to="/enquiries"
          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Enquiries
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Create Tour Enquiry
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Submit details for an upcoming travel tour enquiry.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-md p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-3.5 rounded-md bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>

            <div>
              <label
                htmlFor="destination"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Destination <span className="text-red-500">*</span>
              </label>
              <input
                id="destination"
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Tokyo, Japan"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="travelDate"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Travel Date <span className="text-red-500">*</span>
              </label>
              <input
                id="travelDate"
                type="date"
                name="travelDate"
                value={formData.travelDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>

            <div>
              <label
                htmlFor="travelers"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                Number of Travelers <span className="text-red-500">*</span>
              </label>
              <input
                id="travelers"
                type="number"
                name="travelers"
                min="1"
                value={formData.travelers}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Additional Message / Special Requirements{' '}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder="Any dietary restrictions, preferred hotels, or itinerary notes..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100">
            <Link
              to="/enquiries"
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md border border-slate-300 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Submitting...' : 'Submit Enquiry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEnquiryPage;
