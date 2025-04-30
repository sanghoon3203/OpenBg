import axios from 'axios';

const API_BASE = 'https://your-api-domain.com'; // 실제 API 도메인으로 교체

// Auth & User
export const signup = (data) => axios.post(`${API_BASE}/auth/signup`, data);
export const login = (data) => axios.post(`${API_BASE}/auth/login`, data);
export const logout = (data) => axios.post(`${API_BASE}/auth/logout`, data);
export const getUserInfo = (idToken) =>
  axios.get(`${API_BASE}/auth/userinfo`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

// Badge Wallet
export const getBadges = (idToken) =>
  axios.get(`${API_BASE}/badges`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
export const getBadgeDetail = (idToken, badgeId) =>
  axios.get(`${API_BASE}/badges/${badgeId}`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
export const addBadge = (idToken, data) =>
  axios.post(`${API_BASE}/badges`, data, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
export const deleteBadge = (idToken, badgeId) =>
  axios.delete(`${API_BASE}/badges/${badgeId}`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

// Dashboard
export const getDashboard = (idToken) =>
  axios.get(`${API_BASE}/dashboard`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
export const updateProfile = (idToken, data) =>
  axios.put(`${API_BASE}/dashboard/profile`, data, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
export const updateSettings = (idToken, data) =>
  axios.put(`${API_BASE}/dashboard/settings`, data, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

// Recommendation
export const getRecommendations = (idToken) =>
  axios.get(`${API_BASE}/recommendations`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

// Main Page
export const getMainPage = () => axios.get(`${API_BASE}/main`);
