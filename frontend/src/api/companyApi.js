import client from './client.js';

export const companyApi = {
  // Get all companies with filters
  getAll: async (search = '', status = 'All', sort = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (sort) params.append('sort', sort);
    
    const response = await client.get(`/company?${params.toString()}`);
    return response.data;
  },

  // Get single company
  getById: async (id) => {
    const response = await client.get(`/company/${id}`);
    return response.data;
  },

  // Create new company
  create: async (data) => {
    const response = await client.post('/company', data);
    return response.data;
  },

  // Update company
  update: async (id, data) => {
    const response = await client.put(`/company/${id}`, data);
    return response.data;
  },

  // Delete company
  delete: async (id) => {
    const response = await client.delete(`/company/${id}`);
    return response.data;
  },

  // Get dashboard statistics
  getStats: async () => {
    const response = await client.get('/company/stats');
    return response.data;
  }
};

export default companyApi;