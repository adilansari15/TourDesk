import api from './api.js';

/**
 * Tour Enquiry API Service
 * Communicates with /api/enquiries endpoints using configured Axios client with JWT auth
 */

export const createEnquiry = async (enquiryData) => {
  const response = await api.post('/enquiries', enquiryData);
  return response.data;
};

export const getEnquiries = async () => {
  const response = await api.get('/enquiries');
  return response.data;
};

export const getEnquiry = async (id) => {
  const response = await api.get(`/enquiries/${id}`);
  return response.data;
};

export const updateEnquiry = async (id, enquiryData) => {
  const response = await api.put(`/enquiries/${id}`, enquiryData);
  return response.data;
};

export const deleteEnquiry = async (id) => {
  const response = await api.delete(`/enquiries/${id}`);
  return response.data;
};

export default {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
};
