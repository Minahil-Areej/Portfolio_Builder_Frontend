import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`;

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Set the correct header for file upload
    },
  });
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

// Send password reset email
const sendPasswordResetEmail = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

// Reset password
const resetPassword = async (token, password) => {
  const response = await axios.post(`${API_URL}/reset-password/${token}`, { password }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

// Get all assessors
const getAssessors = async () => {
  const response = await axios.get(`${API_URL}/assessors`);
  return response.data;
};

// Assign assessor to student
const assignAssessor = async (studentId, assessorId) => {
  const response = await axios.put(`${API_URL}/assign-assessor/${studentId}`, 
    { assessorId },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};

export default {
  register,
  login,
  sendPasswordResetEmail,
  resetPassword,
  getAssessors,
  assignAssessor,
};
