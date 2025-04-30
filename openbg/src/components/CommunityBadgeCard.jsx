import React from 'react';

const CommunityBadgeCard = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">정보처리기사</h2>
          <p className="text-gray-500 text-sm">주최기관: 한국산업인력공단</p>
        </div>
        <div className="w-16 h-16 bg-gray-200"></div>
      </div>
      <p className="text-xs text-gray-400 mt-4">취득 날짜: 25/01/25</p>
    </div>
  );
};

export default CommunityBadgeCard;
