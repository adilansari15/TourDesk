import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getEnquiries, deleteEnquiry } from '../services/enquiryService.js';
import {
  Plus,
  Compass,
  Calendar,
  Users,
  MapPin,
  Mail,
  Phone,
  Edit2,
  Trash2,
  ArrowRight,
  Inbox,
  AlertCircle,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getEnquiries();
      setEnquiries(data.enquiries || []);
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to load tour enquiries.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the enquiry for "${name}"?`
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to delete tour enquiry.';
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back, {user?.name || 'Travel Specialist'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tour Enquiry Management Platform Dashboard
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/enquiries"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/enquiries/new"
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Enquiry</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row: Total Enquiries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-md p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Total Enquiries
            </span>
            <div className="w-8 h-8 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {loading ? '—' : enquiries.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Active enquiries associated with your account
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Logged-in Account
            </span>
            <div className="w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-600">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-900 truncate">
            {user?.email}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Protected JWT Session (User ID: {user?._id?.slice(-6) || '—'})
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">
              Quick Action
            </span>
            <p className="text-xs text-slate-700 font-medium mt-1">
              Need to record a new client trip request?
            </p>
          </div>
          <Link
            to="/enquiries/new"
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 mt-3"
          >
            <span>+ Add new enquiry now</span>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 flex items-start space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Enquiries List Section */}
      <div className="bg-white border border-slate-200 rounded-md">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Recent Enquiries
            </h2>
            <p className="text-xs text-slate-500">
              Latest client enquiries assigned to your portfolio
            </p>
          </div>
          <Link
            to="/enquiries"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            See all ({enquiries.length})
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-2">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-slate-700">
              No tour enquiries logged yet
            </p>
            <p className="text-xs text-slate-400 mt-0.5 mb-3">
              Get started by adding your first travel booking enquiry.
            </p>
            <Link
              to="/enquiries/new"
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Enquiry</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Client</th>
                    <th className="px-5 py-3">Destination</th>
                    <th className="px-5 py-3">Travel Date</th>
                    <th className="px-5 py-3">Travelers</th>
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {enquiries.slice(0, 5).map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        {item.fullName}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.destination}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formatDate(item.travelDate)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        <div className="flex items-center space-x-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {item.travelers} {item.travelers === 1 ? 'person' : 'people'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[140px]">{item.email}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          <Link
                            to={`/enquiries/edit/${item._id}`}
                            className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item._id, item.fullName)}
                            disabled={deletingId === item._id}
                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-200">
              {enquiries.slice(0, 5).map((item) => (
                <div key={item._id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-xs">
                        {item.fullName}
                      </h4>
                      <p className="text-xs text-indigo-600 font-medium">
                        {item.destination}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Link
                        to={`/enquiries/edit/${item._id}`}
                        className="p-1 text-slate-600 hover:text-indigo-600 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id, item.fullName)}
                        disabled={deletingId === item._id}
                        className="p-1 text-slate-600 hover:text-red-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{formatDate(item.travelDate)}</span>
                    <span>
                      {item.travelers} {item.travelers === 1 ? 'traveler' : 'travelers'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
