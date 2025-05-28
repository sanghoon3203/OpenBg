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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg font-medium text-gray-800">잠시만 기다려주세요</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="text-center p-6">
          <p className="text-2xl font-bold text-gray-800 mb-2">정보를 찾을 수 없습니다</p>
          <p className="text-gray-600">사용자 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const SectionTitle = ({ children }) => (
    <h2 className="text-xl font-bold text-gray-900 mb-6">{children}</h2>
  );

  const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );

  const InfoRow = ({ label, value, isEditMode = false, name = "", onChange = null, inputType = "text" }) => (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">{label}</span>
        {isEditMode ? (
          <input
            type={inputType}
            name={name}
            value={value || ''}
            onChange={onChange}
            className="w-1/2 text-right focus:outline-none text-gray-900 font-medium rounded-lg px-3 py-2 border border-gray-200 focus:border-blue-500"
          />
        ) : (
          <span className="text-gray-900 font-medium">{value || '미설정'}</span>
        )}
      </div>
    </div>
  );

  const Toggle = ({ label, description, name, checked, onChange, disabled = false }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div>
        <h4 className="text-gray-900 font-medium">{label}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="relative inline-block w-14 align-middle select-none">
        <input
          type="checkbox"
          id={`toggle-${name}`}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <label
          htmlFor={`toggle-${name}`}
          className={`block overflow-hidden h-8 rounded-full cursor-pointer ${disabled ? 'opacity-50' : ''}`}
        >
          <span
            className={`absolute left-0 top-0 bottom-0 right-0 block rounded-full transition-all duration-300 ease-in-out ${
              checked ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`block bg-white rounded-full h-6 w-6 mt-1 shadow transform transition-transform duration-300 ease-in-out ${
                checked ? 'translate-x-7 ml-1' : 'translate-x-1'
              }`}
            ></span>
          </span>
        </label>
      </div>
    </div>
  );

  const TabButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`py-4 px-6 border-b-2 font-medium transition-all duration-300 ${
        active ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-400 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );

  return (
<div className="min-h-screen bg-transparent" // font-sans 클래스 제거
      style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }} // 직접 폰트 지정
    >      <div className="max-w-5xl mx-auto pt-8 pb-16 px-4">
        {/* 헤더 프로필 섹션 */}
        <Card className="mb-6">
          <div className="flex flex-col items-center text-center py-3">
            <div className="w-20 h-20 rounded-full bg-gray-100 mb-4 overflow-hidden flex items-center justify-center">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt="프로필" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-gray-400">
                  {profile.displayName?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.displayName || '사용자'}</h1>
            <p className="text-gray-500 mb-4">{profile.email}</p>
            
            {isEditing ? (
              <div className="flex space-x-3 mt-2">
                <button
                  onClick={saveProfile}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors"
                >
                  저장하기
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setUpdatedProfile(profile);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors"
              >
                프로필 수정
              </button>
            )}
          </div>
        </Card>

        {/* 탭 메뉴 */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex">
            <TabButton 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')}
            >
              기본 정보
            </TabButton>
            <TabButton 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')}
            >
              설정
            </TabButton>
            <TabButton 
              active={activeTab === 'activity'} 
              onClick={() => setActiveTab('activity')}
            >
              활동 내역
            </TabButton>
          </div>
        </div>

        {/* 컨텐츠 섹션 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card>
              <SectionTitle>기본 정보</SectionTitle>
              <InfoRow 
                label="이름" 
                value={profile.displayName} 
                isEditMode={isEditing}
                name="displayName"
                onChange={handleInputChange}
              />
              <InfoRow 
                label="이메일" 
                value={profile.email} 
              />
              <InfoRow 
                label="직업" 
                value={profile.job} 
                isEditMode={isEditing}
                name="job"
                onChange={handleInputChange}
              />
              <InfoRow 
                label="소속" 
                value={profile.affiliation} 
                isEditMode={isEditing}
                name="affiliation"
                onChange={handleInputChange}
              />
              <InfoRow 
                label="관심분야" 
                value={profile.interests} 
                isEditMode={isEditing}
                name="interests"
                onChange={handleInputChange}
              />
            </Card>

            <Card>
              <SectionTitle>계정 정보</SectionTitle>
              <InfoRow 
                label="계정 ID" 
                value={uid} 
              />
              <InfoRow 
                label="가입일" 
                value={profile.createdAt ? new Date(profile.createdAt.toDate()).toLocaleDateString() : '정보 없음'} 
              />
              <InfoRow 
                label="마지막 로그인" 
                value={profile.lastLogin ? new Date(profile.lastLogin.toDate()).toLocaleString() : '정보 없음'} 
              />
              <div className="py-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">계정 상태</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    활성
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <SectionTitle>앱 설정</SectionTitle>
            
              
              <Toggle 
                label="다크 모드" 
                description="어두운 테마로 앱을 사용합니다" 
                name="settings.dark_mode" 
                checked={isEditing ? updatedProfile.settings?.dark_mode : profile.settings?.dark_mode} 
                onChange={() => isEditing && handleToggleChange('settings.dark_mode')}
                disabled={!isEditing}
              />
              
              <Toggle 
                label="알림 설정" 
                description="앱 알림을 받습니다" 
                name="settings.notifications" 
                checked={isEditing ? updatedProfile.settings?.notifications : profile.settings?.notifications} 
                onChange={() => isEditing && handleToggleChange('settings.notifications')}
                disabled={!isEditing}
              />
            </Card>

            <Card>
              <SectionTitle>개인정보 설정</SectionTitle>
              
              <Toggle 
                label="프로필 공개 설정" 
                description="내 프로필을 다른 사용자에게 공개합니다" 
                name="settings.public_profile" 
                checked={isEditing ? updatedProfile.settings?.public_profile : profile.settings?.public_profile} 
                onChange={() => isEditing && handleToggleChange('settings.public_profile')}
                disabled={!isEditing}
              />
            </Card>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <Card>
              <SectionTitle>활동 내역</SectionTitle>
              
              <div className="flex items-center justify-center py-12 text-center">
                <div>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-900 font-medium mb-1">활동 내역이 없습니다</p>
                  <p className="text-gray-500 text-sm">앱을 사용하면 여기에 활동이 표시됩니다.</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;