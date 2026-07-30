import api from './api';

const AUTH_ENDPOINT = '/auth';

export const authService = {

  login: async (username, password) => {
    try {
      const response = await api.post(`${AUTH_ENDPOINT}/login`, {
        username,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getToken: () => localStorage.getItem('authToken'),

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};