import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase'; // firebase 설정 파일 경로는 실제 프로젝트에 맞게 확인해주세요.
import { doc, getDoc } from 'firebase/firestore';

const SidebarProfile = ({ onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // 초기 로딩 상태 true

  useEffect(() => {
    // onAuthStateChanged는 unsubscribe 함수를 반환하므로, 이를 호출하여 cleanup 처리
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // 사용자가 로그인한 경우
        setLoading(true); // 프로필 정보 가져오기 전 로딩 시작
        try {
          const docRef = doc(db, 'users', user.uid);
          const snap = await getDoc(docRef);

          if (snap.exists()) {
            const userData = snap.data();
            setProfile({
              ...userData, // Firestore의 기존 데이터
              // displayName을 일관되게 설정 (Firestore의 displayName, 없으면 name, 그것도 없으면 Auth의 displayName 순으로)
              displayName: userData.displayName || userData.name || user.name || '사용자',
              email: userData.email || user.email, // Firestore 우선, 없으면 Auth
              photoURL: userData.photoURL || user.photoURL, // Firestore 우선, 없으면 Auth
            });
          } else {
            // Firestore에 사용자 문서가 없을 경우 Auth 정보로 프로필 설정
            setProfile({
              displayName: user.name || '사용자',
              email: user.email,
              photoURL: user.photoURL,
            });
          }
        } catch (error) {
          console.error("프로필 정보를 불러오는 데 실패했습니다:", error);
          setProfile(null); // 오류 발생 시 프로필 정보 없음으로 처리
        } finally {
          setLoading(false);
        }
      } else {
        // 사용자가 로그아웃했거나 없는 경우
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
  }, []); // 빈 의존성 배열로 마운트 시 1회만 실행

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (onLogout) { // onLogout prop이 전달된 경우에만 호출
        onLogout();
      }
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
        {/* 로그아웃 버튼 영역은 로딩 중에도 필요하다면 추가할 수 있습니다. */}
      </div>
    );
  }

  // 프로필 정보가 없는 경우 (로그아웃 상태 등)
  if (!profile) {
    // 로그아웃 상태에서는 프로필 정보 대신 로그인 버튼 등을 보여줄 수 있습니다.
    // 여기서는 null을 반환하여 아무것도 표시하지 않거나,
    // 또는 로그인 유도 메시지를 표시할 수 있습니다.
    // 예: <p>로그인이 필요합니다.</p>
    return null;
  }

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
              {profile.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-gray-400 text-sm">{profile.email}</p>
        </div>
      </div>
      {/* 로그아웃 버튼은 SidebarProfile 컴포넌트의 책임이 아닐 수 있습니다.
        만약 이 컴포넌트 내에 로그아웃 버튼이 필요하다면 아래와 같이 추가할 수 있습니다.
        <button onClick={handleLogout} className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button> 
        하지만 현재 코드는 onLogout prop을 통해 상위에서 처리하므로, 버튼은 여기에 없을 가능성이 높습니다.
      */}
    </div>
  );
};

export default SidebarProfile;