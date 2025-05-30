import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from '../firebase'; // auth와 db를 한 줄로 가져옴

// Firestore에서 마지막 'user_id'를 찾아 다음 코드를 생성하는 비동기 함수
// ✅ 중요: 운영 환경에서는 여러 사용자가 동시에 가입할 때 고유성 충돌(race condition)을 방지하기 위해
//    Firestore 트랜잭션 또는 Cloud Functions를 사용하여 이 카운터를 안전하게 관리해야 합니다.
const generateUniqueUserCode = async (database) => {
  let latestNumber = 0;
  // 'users' 컬렉션에서 'user_id' 필드를 기준으로 정렬하여 가장 큰 번호 찾기
  // 'U'로 시작하는 user_id만 필터링합니다.
  const q = query(
    collection(database, "users"),
    where("user_id", ">=", "U"),
    where("user_id", "<", "V") // 'U'로 시작하는 모든 문자열을 포함하기 위함 (U...부터 U 다음에 오는 문자 전까지)
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((document) => {
    const userId = document.data().user_id;
    if (userId && userId.startsWith('U')) {
      const num = parseInt(userId.substring(1)); // 'U' 다음의 숫자 부분 추출
      if (!isNaN(num) && num > latestNumber) {
        latestNumber = num;
      }
    }
  });
  return `U${String(latestNumber + 1).padStart(6, '0')}`; // 예: U000001, U000002... 형식으로 반환
};


const RegisterPage = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    displayName: '', // Firebase `updateProfile`에 사용될 이름
    job: '',
    affiliation: '',
    interests: [], // 기존 관심 분야

    // ✅ JSON 형식에 맞게 추가된 필드들 (초기값 설정)
    goal: '',
    skills: [], // 사용자가 선택한 interests를 여기에 매핑하거나 별도로 입력받을 수 있습니다.
    competency_level: 'Beginner', // 기본값 설정 (UI에서 선택하도록 할 수 있음)
    acquired_badges: [], // 초기 가입 시 빈 배열
    learning_history: [], // 초기 가입 시 빈 배열 (나중에 프로필 편집에서 추가)
    employment_history: [], // 초기 가입 시 빈 배열 (나중에 프로필 편집에서 추가)
    education_level: '', // UI에서 입력받거나 기본값 설정 가능
    engagement_metrics: 'Low', // 기본값 설정 (사용자 활동에 따라 변화)
    recommendation_history: [] // 초기 가입 시 빈 배열
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const INTEREST_OPTIONS = ['IT,개발', '디자인', '외국어', '요리', '교육', '과학', '음악'];

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  // 관심 분야(칩) 선택/해제 핸들러
  const handleInterestToggle = (interest) => {
    setForm(prevForm => {
      const isSelected = prevForm.interests.includes(interest);
      const newInterests = isSelected
        ? prevForm.interests.filter(i => i !== interest)
        : [...prevForm.interests, interest];
      
      return {
        ...prevForm,
        interests: newInterests,
        // ✅ interests를 skills로 매핑 (필요에 따라 별도의 skills 입력 필드 추가 고려)
        skills: newInterests 
      };
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Firebase 인증: 이메일/비밀번호로 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // 2. 사용자 프로필 업데이트 (Firebase Auth의 displayName 필드)
      await updateProfile(user, { displayName: form.displayName });

      // ✅ 3. 고유한 user_id 생성
      const uniqueUserId = await generateUniqueUserCode(db); 

      // ✅ 4. Firestore에 저장할 사용자 데이터 객체 구성
      const userDataToStore = {
        user_id: uniqueUserId, // ✅ 생성된 고유 ID 사용
        name: form.displayName, 
        email: form.email,
        goal: form.goal,
        skills: form.skills, // interests에서 매핑된 값
        competency_level: form.competency_level,
        acquired_badges: form.acquired_badges,
        learning_history: form.learning_history,
        employment_history: form.employment_history,
        education_level: form.education_level,
        engagement_metrics: form.engagement_metrics,
        recommendation_history: form.recommendation_history,

        // 기존 필드들
        job: form.job,
        affiliation: form.affiliation,
        createdAt: new Date(), // 가입 시간
        settings: {
          language: "ko",
          darkMode: false // camelCase로 변경
        }
      };

      // ✅ 5. Firestore에 문서 저장 (Firebase Auth UID를 문서 ID로 사용)
      await setDoc(doc(db, "users", user.uid), userDataToStore);

      // 6. ID 토큰 추출 및 상위 컴포넌트로 전달 (인증 상태 관리)
      const idToken = await user.getIdToken();
      onAuthSuccess(idToken); 

      // 7. 성공 시 홈으로 이동
      navigate('/');
    } catch (err) {
      // 에러 처리
      setError(err.message);
    } finally {
      // 로딩 상태 해제 (성공/실패 모두)
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      <div className="max-w-md w-full space-y-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-purple-600">OPEN BG</h1>
          <p className="mt-2 text-lg text-gray-600">새로운 계정을 만들어 시작하세요</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="bg-white py-8 px-6 shadow-xl rounded-2xl"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            {/* 이메일 필드 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* 비밀번호 필드 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {/* 이름 필드 */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                id="displayName"
                type="text"
                name="displayName"
                value={form.displayName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
                placeholder="홍길동"
                required
              />
            </div>

            {/* 직업 필드 */}
            <div>
              <label htmlFor="job" className="block text-sm font-medium text-gray-700 mb-1">직업</label>
              <input
                id="job"
                type="text"
                name="job"
                value={form.job}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
                placeholder="개발자"
                required
              />
            </div>

            {/* 소속 필드 */}
            <div>
              <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 mb-1">소속</label>
              <input
                id="affiliation"
                type="text"
                name="affiliation"
                value={form.affiliation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
                placeholder="회사/학교"
                required
              />
            </div>

            {/* ✅ 목표 필드 추가 (새로운 필드) */}
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">목표</label>
              <input
                id="goal"
                type="text"
                name="goal"
                value={form.goal}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
                placeholder="AI 전문가 되기"
                required
              />
            </div>

            {/* ✅ 학력 필드 추가 (새로운 필드) */}
            <div>
              <label htmlFor="education_level" className="block text-sm font-medium text-gray-700 mb-1">학력</label>
              <input
                id="education_level"
                type="text"
                name="education_level"
                value={form.education_level}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none"
                placeholder="학사, 석사, 박사 등"
                required
              />
            </div>

            {/* 관심 분야 (skills로 매핑) 섹션 - Toss-style 칩 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">관심 분야 (기술)</label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                      form.interests.includes(interest)
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 가입 버튼 */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    가입 중...
                  </span>
                ) : (
                  '회원가입 완료하기'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-purple-600 font-medium hover:text-purple-700 transition-colors duration-200"
              >
                로그인하기
              </button>
            </p>
          </div>
        </motion.div>

        <p className="text-center text-xs text-gray-500 mt-8">
          가입 시 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;