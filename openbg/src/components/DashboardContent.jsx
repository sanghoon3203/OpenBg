import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const DashboardContent = ({ uid }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!uid) return;
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setProfile(userData);
          setUpdatedProfile(userData);
        }
      } catch (err) {
        console.error("사용자 정보를 불러오는 데 실패했습니다:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [uid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUpdatedProfile({
        ...updatedProfile,
        [parent]: {
          ...updatedProfile[parent],
          [child]: value
        }
      });
    } else {
      setUpdatedProfile({
        ...updatedProfile,
        [name]: value
      });
    }
  };

  const handleToggleChange = (name) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUpdatedProfile({
        ...updatedProfile,
        [parent]: {
          ...updatedProfile[parent],
          [child]: !updatedProfile[parent][child]
        }
      });
    } else {
      setUpdatedProfile({
        ...updatedProfile,
        [name]: !updatedProfile[name]
      });
    }
  };

  const saveProfile = async () => {
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, updatedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
      alert("프로필이 성공적으로 업데이트되었습니다!");
    } catch (err) {
      console.error("프로필 업데이트 실패:", err);
      alert("프로필 업데이트에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg font-medium text-gray-700">로딩 중...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-bold">오류</p>
          <p>사용자 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                {profile.photoURL ? (
                  <img src={profile.photoURL} alt="프로필" className="h-full w-full object-cover" />
                ) : (
                  profile.displayName?.charAt(0) || "U"
                )}
              </div>
            </div>
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{profile.displayName || '사용자'}</h1>
              <p className="text-lg text-gray-600">{profile.email}</p>
              <p className="text-sm text-gray-500">가입일: {profile.createdAt ? new Date(profile.createdAt.toDate()).toLocaleDateString() : '정보 없음'}</p>
              <div className="mt-3">
                {isEditing ? (
                  <div className="flex gap-2 justify-center md:justify-start">
                    <button
                      onClick={saveProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      저장하기
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setUpdatedProfile(profile);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    프로필 수정
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex overflow-x-auto">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium border-b-2 focus:outline-none ${
                activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              개요
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium border-b-2 focus:outline-none ${
                activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              설정
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium border-b-2 focus:outline-none ${
                activeTab === 'activity' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('activity')}
            >
              활동
            </button>
          </div>
        </div>

        {/* 컨텐츠 섹션 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">사용자 정보</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">기본 정보</h3>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">이름</label>
                        <input
                          type="text"
                          name="displayName"
                          value={updatedProfile.displayName || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">직업</label>
                        <input
                          type="text"
                          name="occupation"
                          value={updatedProfile.occupation || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">위치</label>
                        <input
                          type="text"
                          name="location"
                          value={updatedProfile.location || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p><span className="font-medium text-gray-700">이름:</span> {profile.displayName || '미설정'}</p>
                      <p><span className="font-medium text-gray-700">이메일:</span> {profile.email}</p>
                      <p><span className="font-medium text-gray-700">직업:</span> {profile.occupation || '미설정'}</p>
                      <p><span className="font-medium text-gray-700">위치:</span> {profile.location || '미설정'}</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">시스템 정보</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium text-gray-700">계정 ID:</span>
                      <span className="ml-2 px-2 py-1 bg-gray-200 rounded-md text-xs font-mono">{uid}</span>
                    </p>
                    <p><span className="font-medium text-gray-700">마지막 로그인:</span> {profile.lastLogin ? new Date(profile.lastLogin.toDate()).toLocaleString() : '정보 없음'}</p>
                    <p>
                      <span className="font-medium text-gray-700">계정 상태:</span>
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        활성
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">설정</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">앱 설정</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">언어 설정</h4>
                        <p className="text-sm text-gray-500">앱에서 사용할 언어를 선택하세요</p>
                      </div>
                      {isEditing ? (
                        <select
                          name="settings.language"
                          value={updatedProfile.settings?.language || ''}
                          onChange={handleInputChange}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="ko">한국어</option>
                          <option value="en">English</option>
                          <option value="ja">日本語</option>
                          <option value="zh">中文</option>
                        </select>
                      ) : (
                        <span className="text-gray-700">{profile.settings?.language || '미설정'}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">다크 모드</h4>
                        <p className="text-sm text-gray-500">어두운 테마로 앱을 사용합니다</p>
                      </div>
                      {isEditing ? (
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                          <input
                            type="checkbox"
                            name="settings.dark_mode"
                            id="dark-mode-toggle"
                            checked={updatedProfile.settings?.dark_mode || false}
                            onChange={() => handleToggleChange('settings.dark_mode')}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            htmlFor="dark-mode-toggle"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              updatedProfile.settings?.dark_mode ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                          ></label>
                        </div>
                      ) : (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          profile.settings?.dark_mode ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {profile.settings?.dark_mode ? '활성화' : '비활성화'}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">알림 설정</h4>
                        <p className="text-sm text-gray-500">앱 알림을 받습니다</p>
                      </div>
                      {isEditing ? (
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                          <input
                            type="checkbox"
                            name="settings.notifications"
                            id="notifications-toggle"
                            checked={updatedProfile.settings?.notifications || false}
                            onChange={() => handleToggleChange('settings.notifications')}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            htmlFor="notifications-toggle"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              updatedProfile.settings?.notifications ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                          ></label>
                        </div>
                      ) : (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          profile.settings?.notifications ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {profile.settings?.notifications ? '활성화' : '비활성화'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">개인정보</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">프로필 공개 설정</h4>
                        <p className="text-sm text-gray-500">내 프로필을 다른 사용자에게 공개합니다</p>
                      </div>
                      {isEditing ? (
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                          <input
                            type="checkbox"
                            name="settings.public_profile"
                            id="public-profile-toggle"
                            checked={updatedProfile.settings?.public_profile || false}
                            onChange={() => handleToggleChange('settings.public_profile')}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            htmlFor="public-profile-toggle"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              updatedProfile.settings?.public_profile ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                          ></label>
                        </div>
                      ) : (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          profile.settings?.public_profile ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {profile.settings?.public_profile ? '활성화' : '비활성화'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">활동 내역</h2>
              
              {/* 이 부분은 실제 데이터가 있을 경우 연결해야 합니다 */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      아직 활동 내역이 없습니다. 앱을 사용하면 여기에 활동이 표시됩니다.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 활동 내역 샘플 */}
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="text-sm text-gray-500">2023년 12월 3일 11:23</p>
                  <p className="font-medium">로그인 성공</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="text-sm text-gray-500">2023년 12월 1일 15:45</p>
                  <p className="font-medium">프로필 업데이트</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="text-sm text-gray-500">2023년 11월 28일 09:12</p>
                  <p className="font-medium">로그인 성공</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS 스타일 */}
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #3b82f6;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3b82f6;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          border-color: #ccc;
          transition: all 0.3s;
        }
        .toggle-label {
          width: 100%;
          transition: background-color 0.3s;
        }
      `}</style>
    </div>
  );
};

export default DashboardContent;