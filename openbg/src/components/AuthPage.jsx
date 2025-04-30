import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const AuthPage = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', display_name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === 'signup') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        const user = userCredential.user;

        // Firebase 프로필 이름 설정
        await updateProfile(user, {
          displayName: form.display_name
        });

        // Firestore에 사용자 정보 저장
        await setDoc(doc(db, "users", user.uid), {
          email: form.email,
          displayName: form.display_name,
          settings: {
            language: "ko",
            dark_mode: false
          }
        });

        alert("회원가입 성공!");
        onAuthSuccess(user);
        navigate('/');
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    } else {
      // 로그인
      try {
        const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
        alert("로그인 성공!");
        onAuthSuccess(userCredential.user);
        navigate('/');
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen font-sans bg-gradient-to-br from-purple-50 to-white"
    >
      <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow">
        <h1 className="text-2xl font-bold mb-4">{mode === 'login' ? '로그인' : '회원가입'}</h1>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">이메일</label>
            <input 
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">비밀번호</label>
            <input 
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border rounded-md p-2"
              required
            />
          </div>
          {mode === 'signup' && (
            <div className="mb-4">
              <label className="block mb-1">사용자 이름</label>
              <input 
                type="text"
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
          )}
          <button type="submit" className="w-full bg-purple-500 text-white px-4 py-2 rounded-md">
            {loading ? '로딩중...' : (mode === 'login' ? '로그인' : '회원가입')}
          </button>
        </form>
        <div className="mt-4 text-center">
          {mode === 'login' ? (
            <p>
              계정이 없으신가요?{' '}
              <button onClick={() => setMode('signup')} className="text-purple-500">회원가입</button>
            </p>
          ) : (
            <p>
              이미 계정이 있으신가요?{' '}
              <button onClick={() => setMode('login')} className="text-purple-500">로그인</button>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPage;
