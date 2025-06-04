import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const RegisterPage = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    // 기본 계정 정보
    email: '',
    password: '',
    display_name: '',
    
    // 프로필 정보
    job: '',
    affiliation: '',
    goal: '',
    education_level: '',
    
    // 스킬 및 관심사
    interests: [],
    skills: [],
    competency_level: 'Beginner',
    
    // 시스템 관련
    acquired_badges: [],
    learning_history: [],
    employment_history: [],
    engagement_metrics: 'Low',
    recommendation_history: []
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 옵션 데이터
  const interestOptions = ['IT,개발', '디자인', '외국어', '요리', '교육', '과학', '음악', '마케팅', '경영', '금융'];
  const skillOptions = ['JavaScript', 'Python', 'React', 'Node.js', 'UI/UX', '프로젝트 관리', '데이터 분석', '영어', '중국어', '일본어'];
  const competencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const educationLevels = ['고등학교 졸업', '전문대 졸업', '대학교 졸업', '대학원 재학', '대학원 졸업', '기타'];
  const engagementLevels = ['Low', 'Medium', 'High'];

  // 고유 사용자 코드 생성 함수
  const generateUniqueUserCode = async (db) => {
    let latestNumber = 0;
    const q = query(
      collection(db, "users"),
      where("user_id", ">=", "U"),
      where("user_id", "<", "V")
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const userId = doc.data().user_id;
      if (userId && userId.startsWith('U')) {
        const num = parseInt(userId.substring(1));
        if (!isNaN(num) && num > latestNumber) {
          latestNumber = num;
        }
      }
    });
    return `U${String(latestNumber + 1).padStart(6, '0')}`;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // Firebase Authentication 프로필 업데이트
      await updateProfile(user, { displayName: form.display_name });

      // 고유한 user_id 생성
      const uniqueUserId = await generateUniqueUserCode(db);

      // Firestore 문서에 저장할 데이터 구성
      const userDataToStore = {
        user_id: uniqueUserId,
        name: form.display_name,
        email: form.email,
        
        // 프로필 정보
        job: form.job,
        affiliation: form.affiliation,
        goal: form.goal,
        education_level: form.education_level,
        
        // 스킬 및 관심사 (별도 필드로 저장)
        interests: form.interests, // 관심 분야
        skills: form.skills, // 보유 스킬
        competency_level: form.competency_level,
        
        // 시스템 필드들 (초기값)
        acquired_badges: [],
        learning_history: [],
        employment_history: form.job && form.affiliation ? [{
          company: form.affiliation,
          position: form.job,
          start_date: new Date().toISOString(),
          is_current: true
        }] : [],
        engagement_metrics: form.engagement_metrics,
        recommendation_history: [],
        
        // 메타데이터
        createdAt: new Date(),
        settings: {
          language: "ko",
          darkMode: false
        }
      };

      // Firestore에 문서 저장
      await setDoc(doc(db, "users", user.uid), userDataToStore);

      // 인증 성공 처리
      const idToken = await user.getIdToken();
      onAuthSuccess(idToken);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-12 h-0.5 mx-2 ${
              step < currentStep ? 'bg-purple-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">기본 정보</h3>
        <p className="text-sm text-gray-600 mt-1">계정 생성을 위한 기본 정보를 입력해주세요</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 border-0 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
          placeholder="your@email.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-3 border-0 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
          placeholder="••••••••"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
        <input
          type="text"
          value={form.display_name}
          onChange={(e) => setForm({ ...form, display_name: e.target.value })}
          className="w-full px-4 py-3 border-0 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
          placeholder="홍길동"
          required
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={nextStep}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
        >
          다음 단계
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">프로필 정보</h3>
        <p className="text-sm text-gray-600 mt-1">나에 대한 정보를 입력해주세요</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">직업</label>
        <input
          type="text"
          value={form.job}
          onChange={(e) => setForm({ ...form, job: e.target.value })}
          className="w-full px-4 py-3 border-0 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
          placeholder="개발자"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">소속</label>
        <input
          type="text"
          value={form.affiliation}
          onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
          className="w-full px-4 py-3 border-0 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
          placeholder="회사/학교"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">학력</label>
        <select
          value={form.education_level}
          onChange={(e) => setForm({ ...form, education_level: e.target.value })}
          className="w-full px-4 py-3 border-0 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
        >
          <option value="">선택해주세요</option>
          {educationLevels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">학습 목표</label>
        <textarea
          value={form.goal}
          onChange={(e) => setForm({ ...form, goal: e.target.value })}
          className="w-full px-4 py-3 border-0 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
          placeholder="어떤 것을 배우고 싶으신가요?"
          rows="3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">역량 수준</label>
        <select
          value={form.competency_level}
          onChange={(e) => setForm({ ...form, competency_level: e.target.value })}
          className="w-full px-4 py-3 border-0 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
        >
          {competencyLevels.map((level) => (
            <option key={level} value={level}>
              {level === 'Beginner' && '초급'}
              {level === 'Intermediate' && '중급'}
              {level === 'Advanced' && '고급'}
              {level === 'Expert' && '전문가'}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
        >
          이전
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
        >
          다음 단계
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">관심사 & 스킬</h3>
        <p className="text-sm text-gray-600 mt-1">관심 분야와 보유 스킬을 선택해주세요</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">관심 분야</label>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => {
                const isSelected = form.interests.includes(interest);
                setForm(prevForm => ({
                  ...prevForm,
                  interests: isSelected
                    ? prevForm.interests.filter(i => i !== interest)
                    : [...prevForm.interests, interest]
                }));
              }}
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                form.interests.includes(interest)
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">보유 스킬</label>
        <div className="flex flex-wrap gap-2">
          {skillOptions.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => {
                const isSelected = form.skills.includes(skill);
                setForm(prevForm => ({
                  ...prevForm,
                  skills: isSelected
                    ? prevForm.skills.filter(s => s !== skill)
                    : [...prevForm.skills, skill]
                }));
              }}
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                form.skills.includes(skill)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">참여도 설정</label>
        <select
          value={form.engagement_metrics}
          onChange={(e) => setForm({ ...form, engagement_metrics: e.target.value })}
          className="w-full px-4 py-3 border-0 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
        >
          {engagementLevels.map((level) => (
            <option key={level} value={level}>
              {level === 'Low' && '낮음'}
              {level === 'Medium' && '보통'}
              {level === 'High' && '높음'}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
        >
          이전
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
            '회원가입 완료'
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" 
      style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-purple-600">OPEN BG</h1>
          <p className="mt-2 text-gray-600">새로운 계정을 만들어 시작하세요</p>
        </div>

        {renderStepIndicator()}

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white py-8 px-6 shadow-sm rounded-2xl"
        >
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </form>
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button onClick={() => navigate('/login')} className="text-purple-600 font-medium hover:text-purple-700">
              로그인하기
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          가입 시 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;