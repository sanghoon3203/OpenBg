// src/components/CombinedDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; //
import DashboardContent from './DashboardContent'; //
import RecommendedCoursesContent from './RecommendedCoursesContent'; //
import CommunityContent from './CommunityContent'; //
import PortfolioContent from './PortfolioContent'; //
import Sidebar from './Sidebar/Sidebar'; //
import { motion } from 'framer-motion'; //

// App.jsx로부터 idToken과 user props를 받는다고 가정합니다.
const CombinedDashboard = ({ idToken, user }) => {
  const location = useLocation(); //
  const navigate = useNavigate(); //
  const query = new URLSearchParams(location.search); //
  const initialTab = query.get('tab') || '대시보드'; //
  const [activeMenu, setActiveMenu] = useState(initialTab); //
  const [uid, setUid] = useState(null); //
  const [loading, setLoading] = useState(true); //

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { // 'user'를 'currentUser'로 변경하여 prop과의 혼동 방지
      if (currentUser) {
        setUid(currentUser.uid); //
        // user prop은 App.jsx에서 내려오는 Firebase user 객체 전체이므로, uid만 필요하면 currentUser.uid 사용
      } else {
        navigate('/login'); //
      }
      setLoading(false); //
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 text-lg">
        로그인 상태 확인 중...
      </div>
    ); //
  }

  const renderContent = () => {
    switch (activeMenu) {
      case '대시보드':
        return <DashboardContent uid={uid} />; //
      case '맞춤 뱃지 추천': // 이 탭이 이제 추천 뱃지를 표시합니다.
        return <RecommendedCoursesContent uid={uid} idToken={idToken} />; // uid와 idToken 전달
      case '커뮤니티 활동':
        return <CommunityContent uid={uid} />; //
      case '내 배지 포트폴리오':
        return <PortfolioContent uid={uid} />; //
      default:
        return <DashboardContent uid={uid} />; //
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen font-sans bg-gradient-to-br from-purple-50 to-white"
    >
      <div className="flex h-screen">
        <Sidebar //
          activeMenu={activeMenu} //
          setActiveMenu={setActiveMenu} //
          onLogout={() => {
            auth.signOut().then(() => navigate('/login')); //
          }}
        />
        <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </motion.div>
  );
};

export default CombinedDashboard;