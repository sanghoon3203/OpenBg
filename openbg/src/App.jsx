// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AuthPage from './components/AuthPage';
import QnaPage from './components/QnaPage';
import CombinedDashboard from './components/CombinedDashboard';
import OpenBadgeMainPage from './components/OpenBadgeMainPage';

const AnimatedRoutes = ({ idToken, setIdToken }) => {
  const location = useLocation();
  return (
    <AnimatePresence exitBeforeEnter>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<OpenBadgeMainPage />} />
        <Route path="/qna" element={<QnaPage />} />
        <Route path="/login" element={<AuthPage onAuthSuccess={setIdToken} />} />
        <Route
          path="/dashboard"
          element={
            idToken ? (
              <CombinedDashboard idToken={idToken} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  // 테스트용 하드코딩 idToken (실제 서비스에서는 null로 시작)
  const [idToken, setIdToken] = useState("hardcoded-id-token");

  return (
    <Router>
      {/* AnimatedRoutes 내부에서 페이지 전환 애니메이션 적용 */}
      <AnimatedRoutes idToken={idToken} setIdToken={setIdToken} />
    </Router>
  );
};

export default App;
