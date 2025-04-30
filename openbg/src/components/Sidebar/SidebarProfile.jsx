import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const SidebarProfile = ({ onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          // Firestore에 데이터가 없을 경우 Auth 정보 사용
          setProfile({
            displayName: user.displayName || '사용자',
            email: user.email,
            photoURL: user.photoURL,
          });
        }
      } catch (error) {
        console.error("프로필 정보를 불러오는 데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout(); // 상위 컴포넌트에서 로그아웃 처리
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  // 로딩 상태 UI
  if (loading) {
    return (
      <div className="flex items-center mb-6 justify-between animate-pulse">
        <div className="flex items-center">
          <div className="bg-indigo-400 w-16 h-16 rounded-full"></div>
          <div className="ml-4">
            <div className="h-5 bg-gray-300 rounded w-24 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  // 프로필 정보가 없는 경우
  if (!profile) return null;

  return (
    <div className="flex items-center mb-6 justify-between">
      <div className="flex items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
          {profile.photoURL ? (
            <img 
              src={profile.photoURL} 
              alt="프로필" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl">
              {profile.displayName?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold">{profile.displayName}</h2>
          <p className="text-gray-400 text-sm">{profile.email}</p>
        </div>
      </div>
  
    </div>
  );
};

export default SidebarProfile;