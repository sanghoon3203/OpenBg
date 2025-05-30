import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore'; // collection, getDocs 추가

const DashboardContent = ({ uid }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [acquiredBadges, setAcquiredBadges] = useState([]); // 획득한 뱃지를 위한 상태 추가

  useEffect(() => {
    const fetchUserDataAndBadges = async () => {
      if (!uid) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // 사용자 프로필 정보 가져오기
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setProfile(userData);
          setUpdatedProfile(userData);

          // 사용자 뱃지 정보 가져오기 (users/{uid}/badges 컬렉션)
          const badgesColRef = collection(db, 'users', uid, 'badges');
          const badgesSnapshot = await getDocs(badgesColRef);
          const badgesData = badgesSnapshot.docs.map(doc => doc.data().name || doc.id); // 각 뱃지 문서의 'name' 필드를 사용, 없으면 ID를 사용
          setAcquiredBadges(badgesData);

        } else {
          setProfile(null); // 사용자를 찾을 수 없는 경우
          console.log("사용자 문서를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("사용자 정보 또는 뱃지를 불러오는 데 실패했습니다:", err);
        setProfile(null); // 오류 발생 시 프로필 초기화
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndBadges();
  }, [uid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({
      ...updatedProfile,
      [name]: value
    });
  };

  const handleArrayInputChange = (name, value) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setUpdatedProfile({
      ...updatedProfile,
      [name]: arrayValue
    });
  };

  const saveProfile = async () => {
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, updatedProfile);
      setProfile(updatedProfile); // 로컬 프로필 상태도 업데이트
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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
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
          inputType === "select" ? (
            <select
              name={name}
              value={value || ''}
              onChange={onChange}
              className="w-1/2 text-right focus:outline-none text-gray-900 font-medium rounded-lg px-3 py-2 border border-gray-200 focus:border-indigo-500"
            >
              <option value="">선택하세요</option>
              <option value="Beginner">초급</option>
              <option value="Intermediate">중급</option>
              <option value="Advanced">고급</option>
              <option value="Expert">전문가</option>
            </select>
          ) : inputType === "education" ? (
            <select
              name={name}
              value={value || ''}
              onChange={onChange}
              className="w-1/2 text-right focus:outline-none text-gray-900 font-medium rounded-lg px-3 py-2 border border-gray-200 focus:border-indigo-500"
            >
              <option value="">선택하세요</option>
              <option value="고등학교">고등학교</option>
              <option value="전문대학">전문대학</option>
              <option value="대학교">대학교</option>
              <option value="대학원">대학원</option>
              <option value="기타">기타</option>
            </select>
          ) : inputType === "engagement" ? (
            <select
              name={name}
              value={value || ''}
              onChange={onChange}
              className="w-1/2 text-right focus:outline-none text-gray-900 font-medium rounded-lg px-3 py-2 border border-gray-200 focus:border-indigo-500"
            >
              <option value="">선택하세요</option>
              <option value="Low">낮음</option>
              <option value="Medium">보통</option>
              <option value="High">높음</option>
            </select>
          ) : (
            <input
              type={inputType}
              name={name}
              value={value || ''}
              onChange={onChange}
              className="w-1/2 text-right focus:outline-none text-gray-900 font-medium rounded-lg px-3 py-2 border border-gray-200 focus:border-indigo-500"
            />
          )
        ) : (
          <span className="text-gray-900 font-medium">{value || '미설정'}</span>
        )}
      </div>
    </div>
  );

  const ArrayInfoRow = ({ label, value, isEditMode = false, name = "", onChange = null }) => (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex justify-between items-start">
        <span className="text-gray-500 text-sm mt-2">{label}</span>
        {isEditMode ? (
          <textarea
            name={name}
            value={Array.isArray(value) ? value.join(', ') : ''}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder="쉼표로 구분하여 입력하세요"
            className="w-1/2 text-right focus:outline-none text-gray-900 font-medium rounded-lg px-3 py-2 border border-gray-200 focus:border-indigo-500 min-h-[80px] resize-none"
          />
        ) : (
          <div className="text-right w-1/2">
            {Array.isArray(value) && value.length > 0 ? (
              <div className="flex flex-wrap gap-1 justify-end">
                {value.map((item, index) => (
                  <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-900 font-medium">미설정</span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const TabButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`py-4 px-6 border-b-2 font-medium transition-all duration-300 ${
        active ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-gray-400 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );

  const getCompetencyLevelText = (level) => {
    const levels = {
      'Beginner': '초급',
      'Intermediate': '중급',
      'Advanced': '고급',
      'Expert': '전문가'
    };
    return levels[level] || level;
  };

  const getEngagementText = (level) => {
    const levels = {
      'Low': '낮음',
      'Medium': '보통',
      'High': '높음'
    };
    return levels[level] || level;
  };

  return (
    <div className="min-h-screen bg-transparent"
      style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      <div className="max-w-5xl mx-auto pt-8 pb-16 px-4">
        {/* 헤더 프로필 섹션 */}
        <Card className="mb-6">
          <div className="flex flex-col items-center text-center py-3">
            <div className="w-20 h-20 rounded-full bg-gray-100 mb-4 overflow-hidden flex items-center justify-center">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt="프로필" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-gray-400">
                  {profile.name?.charAt(0) || profile.name?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {profile.name || profile.name || '사용자'}
            </h1>
            <p className="text-gray-500 mb-4">{profile.email}</p>
            
            {isEditing ? (
              <div className="flex space-x-3 mt-2">
                <button
                  onClick={saveProfile}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium text-sm hover:bg-indigo-600 transition-colors"
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
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium text-sm transition-colors"
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
              active={activeTab === 'skills'} 
              onClick={() => setActiveTab('skills')}
            >
              스킬 & 관심사
            </TabButton>
            {/* 활동 내역 탭 삭제 */}
          </div>
        </div>

        {/* 컨텐츠 섹션 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card>
              <SectionTitle>기본 정보</SectionTitle>
              <InfoRow 
                label="이름" 
                value={updatedProfile.name || updatedProfile.name} // 수정 중일때 updatedProfile 사용
                isEditMode={isEditing}
                name="name" // Firestore 필드명에 맞게 (또는 name)
                onChange={handleInputChange}
              />
              <InfoRow 
                label="이메일" 
                value={profile.email} // 이메일은 일반적으로 수정 불가
              />
              <InfoRow 
                label="직업" 
                value={updatedProfile.job} 
                isEditMode={isEditing}
                name="job"
                onChange={handleInputChange}
              />
              <InfoRow 
                label="소속" 
                value={updatedProfile.affiliation} 
                isEditMode={isEditing}
                name="affiliation"
                onChange={handleInputChange}
              />
              <InfoRow 
                label="목표" 
                value={updatedProfile.goal} 
                isEditMode={isEditing}
                name="goal"
                onChange={handleInputChange}
              />
              <InfoRow 
                label="학력" 
                value={updatedProfile.education_level} 
                isEditMode={isEditing}
                name="education_level"
                onChange={handleInputChange}
                inputType="education"
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
                value={profile.createdAt?.toDate ? new Date(profile.createdAt.toDate()).toLocaleDateString() : '정보 없음'} 
              />
              <InfoRow 
                label="마지막 로그인" 
                value={profile.lastLogin?.toDate ? new Date(profile.lastLogin.toDate()).toLocaleString() : '정보 없음'} 
              />
              <InfoRow 
                label="참여도" 
                value={isEditing ? updatedProfile.engagement_metrics : getEngagementText(profile.engagement_metrics)} 
                isEditMode={isEditing}
                name="engagement_metrics"
                onChange={handleInputChange}
                inputType="engagement"
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

        {activeTab === 'skills' && (
          <div className="space-y-6">
            <Card>
              <SectionTitle>스킬 & 관심사</SectionTitle>
              
              <ArrayInfoRow 
                label="관심분야" 
                value={updatedProfile.interests} 
                isEditMode={isEditing}
                name="interests"
                onChange={handleArrayInputChange}
              />
              
              <ArrayInfoRow 
                label="보유 스킬" 
                value={updatedProfile.skills} 
                isEditMode={isEditing}
                name="skills"
                onChange={handleArrayInputChange}
              />
              
              <InfoRow 
                label="실력 수준" 
                value={isEditing ? updatedProfile.competency_level : getCompetencyLevelText(profile.competency_level)}
                isEditMode={isEditing}
                name="competency_level"
                onChange={handleInputChange}
                inputType="select"
              />
            </Card>

            <Card>
              <SectionTitle>획득 뱃지</SectionTitle>
              <div className="py-4">
                {/* profile.acquired_badges 대신 acquiredBadges 상태 사용 */}
                {Array.isArray(acquiredBadges) && acquiredBadges.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {acquiredBadges.map((badgeName, index) => (
                      <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                          <span className="text-yellow-800 text-sm font-bold">🏆</span>
                        </div>
                        {/* badge가 객체가 아닌 문자열(이름)이라고 가정 */}
                        <span className="text-yellow-800 font-medium text-sm">{badgeName}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <p className="text-gray-500">아직 획득한 뱃지가 없습니다</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* 활동 내역 섹션 (activeTab === 'activity') 전체 삭제 */}
      </div>
    </div>
  );
};

export default DashboardContent;