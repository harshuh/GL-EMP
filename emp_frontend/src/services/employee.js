import api from './api';

const EMPLOYEE_ENDPOINT = '/employees';

export const employeeService = {

  getAll: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await api.get(EMPLOYEE_ENDPOINT, {
        params: { pageNumber, pageSize }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`${EMPLOYEE_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (employeeData) => {
    try {
      const response = await api.post(EMPLOYEE_ENDPOINT, employeeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  update: async (id, employeeData) => {
    try {
      const response = await api.put(`${EMPLOYEE_ENDPOINT}/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`${EMPLOYEE_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  searchByName: async (name) => {
    try {
      const response = await api.get(`${EMPLOYEE_ENDPOINT}/search`, {
        params: { name }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getByDepartment: async (departmentId) => {
    try {
      const response = await api.get(`${EMPLOYEE_ENDPOINT}/department/${departmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getActive: async () => {
    try {
      const response = await api.get(`${EMPLOYEE_ENDPOINT}/status/active`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`${EMPLOYEE_ENDPOINT}/${id}/status`, {
        status
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  filter: async (filters) => {
    try {
      const response = await api.get(`${EMPLOYEE_ENDPOINT}/filter`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};