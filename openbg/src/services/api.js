import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000'; // 실제 API 도메인으로 교체

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
  axios.get(`${API_BASE}/badges`, { // 이 경로는 FastAPI 서버의 실제 뱃지 목록 경로에 따라야 합니다.
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
// userId 파라미터가 이제 Firestore의 user_id 필드 값을 의미하도록 합니다.
// user_doc_id는 Firebase Auth UID를 의미할 수 있으나, 현재 API 호출에서는 직접 사용되지 않습니다.
// API 경로에는 firestore_user_id (실제 문서 내 user_id 필드값)가 사용됩니다.
export const getBadgeRecommendations = (user_doc_id, idToken, firestore_user_id) =>
  axios.post(
    `${API_BASE}/api/recommendations/${firestore_user_id}`, // URL에 firestore_user_id 사용
    {}, // POST 요청 본문이 필요 없는 경우 빈 객체 전달
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
        // 필요시 'Content-Type': 'application/json' 추가
      },
    }
  );

// Main Page
export const getMainPage = () => axios.get(`${API_BASE}/main`);
