import client from './client.js';

export const transactionApi = {
  add: async (companyId, data) => {
    const response = await client.post(`/transaction/${companyId}`, data);
    return response.data;
  },
  delete: async (transactionId) => {
    const response = await client.delete(`/transaction/${transactionId}`);
    return response.data;
  }
};

export default transactionApi;