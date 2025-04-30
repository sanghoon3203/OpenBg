import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import DashboardContent from './DashboardContent';
import RecommendedCoursesContent from './RecommendedCoursesContent';
import CommunityContent from './CommunityContent';
import PortfolioContent from './PortfolioContent';
import Sidebar from './Sidebar/Sidebar';
import { motion } from 'framer-motion';

const CombinedDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const initialTab = query.get('tab') || '대시보드';
  const [activeMenu, setActiveMenu] = useState(initialTab);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);

  // 로그인 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        navigate('/login');
      }
      setLoading(false); // 이걸 꼭 넣어야 렌더링이 열림
    });

    return () => unsubscribe();
  }, [navigate]);

  // 🧩 로딩 중일 때 출력
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 text-lg">
        로그인 상태 확인 중...
      </div>
    );
  }

  const renderContent = () => {
    switch (activeMenu) {
      case '대시보드':
        return <DashboardContent uid={uid} />;
      case '추천 강좌':
        return <RecommendedCoursesContent uid={uid} />;
      case '커뮤니티 활동':
        return <CommunityContent uid={uid} />;
      case '내 배지 포트폴리오':
        return <PortfolioContent uid={uid} />;
      default:
        return <DashboardContent uid={uid} />;
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
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          onLogout={() => {
            auth.signOut().then(() => navigate('/login'));
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
