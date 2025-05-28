import React, { useEffect, useState } from 'react';
import { Medal } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const BadgeOverview = () => {
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    const fetchBadgeCount = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const badgesRef = collection(db, 'users', user.uid, 'badges');
      const snapshot = await getDocs(badgesRef);
      setBadgeCount(snapshot.size); // 도큐먼트 개수 = 뱃지 수
    };

    fetchBadgeCount();
  }, []);

  return (
    <div className="flex items-center mb-6">
      <Medal className="text-yellow-300 mr-2" size={40} />
      <span className="font-bold text-[24px]"  
            style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }} // 직접 폰트 지정
            >나의 배지</span>

      <span className="ml-auto bg-orange-500 text-white px-2 py-1 rounded-md text-sm">
        {badgeCount}
      </span>
    </div>
  );
};

export default BadgeOverview;
