import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import BadgeCard from './BadgeCard';

const PortfolioContent = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletExists, setWalletExists] = useState(false);
  const [showAddBadgeForm, setShowAddBadgeForm] = useState(false);
  const [newBadgeUrl, setNewBadgeUrl] = useState('');
  const user = auth.currentUser;

  // 뱃지 데이터 불러오기
  const fetchBadges = async () => {
    if (!user) return;
    const badgeRef = collection(db, 'users', user.uid, 'badges');
    const snapshot = await getDocs(badgeRef);

    if (snapshot.empty) {
      setWalletExists(false);
    } else {
      setWalletExists(true);
      const fetched = snapshot.docs.map(doc => ({ badgeId: doc.id, ...doc.data() }));
      setBadges(fetched);
    }

    setLoading(false);
  };

  // 최초 실행
  useEffect(() => {
    fetchBadges();
  }, [user]);

  // 지갑 생성 (더미 뱃지 넣기)
  const createWallet = async () => {
    if (!user) return;

    const dummyBadge = {
      badge_url: '',
      id: `dummy-${Date.now()}`,
      type: 'Assertion',
      name: '지갑이 생성되었습니다.',
      description: 'OpenBadge 시스템에 의해 지갑이 생성되었습니다.',
      issuer: 'OpenBadge 시스템',
      issuedOn: new Date().toISOString().split('T')[0],
      addedAt: new Date().toISOString(),
      image: '', // 기본 이미지 없음
      skills: [],
      alignment: [],
      recipient: {
        type: 'email',
        identity: user?.email || 'unknown@example.com',
        hashed: false
      },
      verification: {
        type: 'HostedBadge'
      }
    };
    

    const badgeRef = collection(db, 'users', user.uid, 'badges');
    await addDoc(badgeRef, dummyBadge);
    fetchBadges(); // 지갑 생성 후 다시 fetch
  };

  const handleDeleteBadge = async (badgeId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'users', user.uid, 'badges', badgeId));
      setBadges(badges.filter(b => b.badgeId !== badgeId));
    }
  };

  const handleAddBadge = () => {
    setShowAddBadgeForm(true);
  };

  const handleAddBadgeSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(newBadgeUrl);
      if (!res.ok) throw new Error('URL 접근 실패');
      const badgeJson = await res.json();
  
      // Open Badges v2.0 기반 데이터 추출
      const badgeData = {
        badge_url: newBadgeUrl,
        id: badgeJson.id || newBadgeUrl,
        type: badgeJson.type || 'Assertion',
        name: badgeJson.badge?.name || '이름 없음',
        description: badgeJson.badge?.description || '',
        issuer: badgeJson.badge?.issuer?.name || '기관 미상',
        issuedOn: badgeJson.issuedOn?.split('T')[0] || '',
        image: badgeJson.image || '',
        skills: badgeJson.badge?.skills || [],
        alignment: badgeJson.badge?.alignment || [],
        recipient: badgeJson.recipient || {},
        verification: badgeJson.verification || {},
        addedAt: new Date().toISOString(),
      };
  
      const badgeRef = collection(db, 'users', user.uid, 'badges');
      const docRef = await addDoc(badgeRef, badgeData);
      setBadges([...badges, { ...badgeData, badgeId: docRef.id }]);
      setShowAddBadgeForm(false);
      setNewBadgeUrl('');
    } catch (err) {
      alert('뱃지를 불러오는 데 실패했습니다. URL을 확인해주세요.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="ml-3 text-gray-600">로딩중...</p>
      </div>
    );
  }

  if (!walletExists) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">아직 배지 지갑이 없습니다.</h2>
        <button
          onClick={createWallet}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg shadow"
        >
          배지 지갑 생성하기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">내 배지 포트폴리오</h2>
        <button 
          onClick={handleAddBadge}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm transition duration-300"
        >
          + 새 배지 추가
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map(badge => (
          <BadgeCard
            key={badge.badgeId}
            title={badge.name}
            issuer={badge.issuer}
            date={badge.issuedOn}
            skills={badge.skills}
            onDelete={() => handleDeleteBadge(badge.badgeId)}
          />
        ))}

        <BadgeCard 
          isEmptyCard={true}
          onAdd={handleAddBadge}
        />
      </div>

      {showAddBadgeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">뱃지 URL 등록</h3>
              <button 
                onClick={() => setShowAddBadgeForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddBadgeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">뱃지 JSON URL</label>
                <input
                  type="url"
                  value={newBadgeUrl}
                  onChange={(e) => setNewBadgeUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="https://example.com/badge123.json"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddBadgeForm(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                >
                  취소
                </button>

                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg"
                >
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioContent;
