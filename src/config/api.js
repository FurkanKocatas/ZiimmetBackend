const BASE_URL = 'http://localhost:5000/api';

export const API = {
  assignments: {
    getAll: () => fetch(`${BASE_URL}/assignments`),
    create: (data) => fetch(`${BASE_URL}/assignments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    }),
  },
  auth: {
    login: (credentials) => fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }),
    register: (userData) => fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
  }
};