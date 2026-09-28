import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEnquiries, deleteEnquiry } from '../services/enquiryService.js';
import {
  Plus,
  Calendar,
  Users,
  MapPin,
  Mail,
  Phone,
  Edit2,
  Trash2,
  AlertCircle,
  Inbox,
} from 'lucide-react';

export const EnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchList = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getEnquiries();
      setEnquiries(data.enquiries || []);
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to fetch tour enquiries.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the enquiry for "${name}"? This action cannot be undone.`
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Tour Enquiries
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage customer travel bookings, contact details, and tour requests.
          </p>
        </div>

        <Link
          to="/enquiries/new"
          className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Enquiry</span>
        </Link>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 flex items-start space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-md p-12 text-center">
          <p className="text-sm text-slate-500">Loading tour enquiries...</p>
        </div>
      ) : enquiries.length === 0 ? (
        /* Empty state */
        <div className="bg-white border border-slate-200 rounded-md p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No enquiries found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            You haven't added any tour enquiries yet. Create your first enquiry to start managing travel bookings.
          </p>
          <Link
            to="/enquiries/new"
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Enquiry</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View (hidden on small screens) */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">
                      Client
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Destination
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Travel Date
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Travelers
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Contact
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {enquiries.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">
                          {item.fullName}
                        </div>
                        {item.message && (
                          <div
                            className="text-slate-500 text-[11px] truncate max-w-xs mt-0.5"
                            title={item.message}
                          >
                            "{item.message}"
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-800">
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.destination}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formatDate(item.travelDate)}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        <div className="flex items-center space-x-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {item.travelers} {item.travelers === 1 ? 'person' : 'people'}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{item.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{item.phone}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          <Link
                            to={`/enquiries/edit/${item._id}`}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                            title="Edit Enquiry"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item._id, item.fullName)}
                            disabled={deletingId === item._id}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50 cursor-pointer"
                            title="Delete Enquiry"
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
          </div>

          {/* Mobile Card View (hidden on md and above) */}
          <div className="md:hidden space-y-4">
            {enquiries.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-slate-200 rounded-md p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {item.fullName}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs text-indigo-600 font-medium mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{item.destination}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Link
                      to={`/enquiries/edit/${item._id}`}
                      className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id, item.fullName)}
                      disabled={deletingId === item._id}
                      className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 py-2.5">
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(item.travelDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {item.travelers} {item.travelers === 1 ? 'traveler' : 'travelers'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{item.email}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{item.phone}</span>
                  </div>
                </div>

                {item.message && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 italic">
                    "{item.message}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EnquiriesPage;
