import React from 'react';
import { CheckCircle, Loader } from 'lucide-react'; // Loader 아이콘 (또는 다른 로딩 아이콘)

const AnimatedLoadingScreen = ({ currentPhase, customMessage }) => {
  const phases = [
    { id: 'INIT', text: '추천 엔진 초기화 중...' },
    { id: 'FETCHING', text: '데이터 수집 중...' },
    { id: 'PARSING_USER_DATA', text: '사용자 프로필 분석 중...' },
    { id: 'PARSING_QUERY', text: '요청 목표 확인 중...' },
    { id: 'PARSING_ACQUIRED_BADGES', text: '보유 역량 확인 중...' },
    { id: 'GENERATING_RECOMMENDATIONS', text: '맞춤 추천 생성 중...' },
    { id: 'FINALIZING', text: '결과 정리 중...' },
    { id: 'DONE', text: '추천 완료!' }
  ];

  const currentIndex = phases.findIndex(p => p.id === currentPhase);
  const message = customMessage || phases[currentIndex]?.text || "잠시만 기다려 주세요...";

  return (
    <div 
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 transition-all duration-500 ease-in-out"
      style={{ fontFamily: '"Pretendard", sans-serif' }}
    >
      <div className="mb-8">
        {/* 기존 고양이 GIF 또는 다른 테마 애니메이션 */}
        <img src="src/assets/codeing_cat.gif" alt="AI 분석 중..." className="w-40 h-40" /> 
      </div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 animate-pulse">{message}</h2>
      <div className="w-full max-w-lg space-y-3">
        {phases.map((phase, index) => (
          <div
            key={phase.id}
            className={`flex items-center p-4 rounded-xl shadow-md transition-all duration-700 ease-out
              ${index <= currentIndex ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white transform scale-105' : 'bg-white text-gray-700'}`}
          >
            <div className="mr-4">
              {index < currentIndex ? (
                <CheckCircle className="h-6 w-6 text-green-300" />
              ) : index === currentIndex ? (
                <Loader className="h-6 w-6 animate-spin text-white" />
              ) : (
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
              )}
            </div>
            <span className={`text-sm font-medium ${index <= currentIndex ? 'opacity-100' : 'opacity-70'}`}>{phase.text}</span>
          </div>
        ))}
      </div>
      <p className="mt-8 text-xs text-gray-500">
        최적의 학습 경로를 찾기 위해 AI가 열심히 분석하고 있습니다.
      </p>
    </div>
  );
};

export default AnimatedLoadingScreen;