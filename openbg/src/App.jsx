// src/App.jsx
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import AuthPage from './components/AuthPage';
import QnAPage from './components/QnaPage';
import CombinedDashboard from './components/CombinedDashboard';
import OpenBadgeMainPage from './components/OpenBadgeMainPage';
import RegisterPage from './components/RegisterPage';

const AnimatedRoutes = ({ idToken, setIdToken, user }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <OpenBadgeMainPage idToken={idToken} setIdToken={setIdToken} user={user} />
          }
        />
        <Route
          path="/qna"
          element={
            idToken ? (
              <QnAPage idToken={idToken} user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            <AuthPage
              onAuthSuccess={(token) => {
                localStorage.setItem('idToken', token);
                setIdToken(token);
              }}
            />
          }
        />
        <Route
          path="/register"
          element={
            <RegisterPage
              onAuthSuccess={(token) => {
                localStorage.setItem('idToken', token);
                setIdToken(token);
              }}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            idToken ? (
              <CombinedDashboard idToken={idToken} user={user} />
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
  const [idToken, setIdToken] = useState(() => localStorage.getItem('idToken'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <AnimatedRoutes idToken={idToken} setIdToken={setIdToken} user={user} />
    </Router>
  );
};

export default App;
