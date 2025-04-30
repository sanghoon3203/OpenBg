import React from 'react';
import DashboardContent from './DashboardContent.jsx';
import ProfileContent from './ProfileContent';
import RecommendedCoursesContent from './RecommendedCoursesContent';
import CommunityContent from './CommunityContent';
import PortfolioContent from './PortfolioContent';

const MainContent = ({ activeMenu, idToken }) => {
  const renderContent = () => {
    switch (activeMenu) {
      case '대시보드':
        return <DashboardContent idToken={idToken} />;
      case '프로필':
        return <ProfileContent idToken={idToken} />;
      case '추천 강좌':
        return <RecommendedCoursesContent idToken={idToken} />;
      case '커뮤니티 활동':
        return <CommunityContent idToken={idToken} />;
      case '내 배지 포트폴리오':
        return <PortfolioContent idToken={idToken} />;
      default:
        return <DashboardContent idToken={idToken} />;
    }
  };
  
  return (
    <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
      {renderContent()}
    </div>
  );
};

export default MainContent;
