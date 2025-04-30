import React, { useState } from 'react';

 const CommunityContent = ({ idToken }) => {
  // 추후 커뮤니티 API가 있다면 useEffect로 데이터를 불러올 수 있음
  const [activities] = useState([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">커뮤니티 활동</h1>
        <button className="text-gray-500 text-sm">컨텐츠 추가하기</button>
      </div>
      
      {activities.length > 0 ? (
        activities.map((activity, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-bold">{activity.title}</h2>
            <p className="text-gray-500 text-sm">{activity.description}</p>
            <p className="text-xs text-gray-400 mt-4">{activity.date}</p>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm min-h-64">
          <p className="text-gray-400 text-center">아직 등록된 활동이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default CommunityContent; 

