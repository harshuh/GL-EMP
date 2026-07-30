import api from './api';

const DEPARTMENT_ENDPOINT = '/departments';

export const departmentService = {

  getAll: async () => {
    try {
      const response = await api.get(DEPARTMENT_ENDPOINT);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`${DEPARTMENT_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (departmentData) => {
    try {
      const response = await api.post(DEPARTMENT_ENDPOINT, departmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  update: async (id, departmentData) => {
    try {
      const response = await api.put(`${DEPARTMENT_ENDPOINT}/${id}`, departmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`${DEPARTMENT_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};