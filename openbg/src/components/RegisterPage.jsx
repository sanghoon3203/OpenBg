import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const RegisterPage = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    display_name: '',
    job: '',
    affiliation: '',
    interests: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const interestOptions = ['IT,개발', '디자인', '외국어', '요리', '교육', '과학', '음악'];

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: form.display_name });

      await setDoc(doc(db, "users", user.uid), {
        email: form.email,
        displayName: form.display_name,
        job: form.job,
        affiliation: form.affiliation,
        interests: form.interests,
        createdAt: new Date(),
        settings: {
          language: "ko",
          dark_mode: false
        }
      });

      const idToken = await user.getIdToken(); // ✅ idToken 추출
      onAuthSuccess(idToken); // ✅ App.jsx에 토큰 전달
      navigate('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-transparent" // font-sans 클래스 제거
      style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }} // 직접 폰트 지정
    >
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-purple-600">OPEN BG</h1>
          <p className="mt-2 text-gray-600">새로운 계정을 만들어 시작하세요</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="bg-white py-8 px-6 shadow-sm rounded-2xl"
        >
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border-0 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 border-0 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Display name field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                name="display_name"
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                className="w-full px-4 py-3 border-0 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="홍길동"
                required
              />
            </div>

            {/* Job field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">직업</label>
              <input
                type="text"
                name="job"
                value={form.job}
                onChange={(e) => setForm({ ...form, job: e.target.value })}
                className="w-full px-4 py-3 border-0 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="개발자"
                required
              />
            </div>

            {/* Affiliation field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">소속</label>
              <input
                type="text"
                name="affiliation"
                value={form.affiliation}
                onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
                className="w-full px-4 py-3 border-0 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="회사/학교"
                required
              />
            </div>

            {/* Interests section - Toss-style chip selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">관심 분야</label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => {
                      const isSelected = form.interests.includes(interest);
                      setForm((prevForm) => ({
                        ...prevForm,
                        interests: isSelected
                          ? prevForm.interests.filter((i) => i !== interest)
                          : [...prevForm.interests, interest],
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

            {/* 가입 버튼 */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
              <button onClick={() => navigate('/login')} className="text-purple-600 font-medium hover:text-purple-700">
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
    </div>
  );
};

export default RegisterPage;