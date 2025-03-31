import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/api/users/register`, userData, {  // Updated to include /api/users/register
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
}

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/api/users/login`, userData, {  // Updated to include /api/users/login
    headers: {
      'Content-Type':'application/json'
    }
  });

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
}

// Logout user
const logout = () => localStorage.removeItem('user');

const authService = {
  register,
  logout,
  login
}

export default authService;
