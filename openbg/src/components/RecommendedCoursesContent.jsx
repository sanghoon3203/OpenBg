// src/components/RecommendedCoursesContent.jsx

import React, { useState, useEffect } from 'react';
import { getBadgeRecommendations } from '../services/api';
import { Award, ExternalLink, AlertCircle } from 'lucide-react';

// 디폴트 추천 예시 데이터
const defaultRecommendations = [
  {
    name: "JavaScript 기초 마스터",
    description: "웹 개발의 핵심 언어인 JavaScript의 기본 문법부터 고급 개념까지 체계적으로 학습할 수 있는 뱃지입니다.",
    issuer_name: "코딩 아카데미",
    url_to_badge_details: "https://example.com/javascript-basics",
    image: null
  },
  {
    name: "React 개발자 인증",
    description: "현대 웹 개발의 필수 기술인 React를 활용한 프론트엔드 개발 능력을 인증하는 뱃지입니다.",
    issuer_name: "프론트엔드 스쿨",
    url_to_badge_details: "https://example.com/react-certification",
    image: null
  },
  {
    name: "데이터 분석 입문",
    description: "Python과 데이터 시각화 도구를 활용한 기초 데이터 분석 기법을 학습하는 과정입니다.",
    issuer_name: "데이터 사이언스 랩",
    url_to_badge_details: "https://example.com/data-analysis",
    image: null
  },
  {
    name: "UI/UX 디자인 기초",
    description: "사용자 중심의 디자인 사고와 프로토타이핑 도구 활용법을 배우는 디자인 뱃지입니다.",
    issuer_name: "디자인 스튜디오",
    url_to_badge_details: "https://example.com/uiux-design",
    image: null
  },
  {
    name: "클라우드 컴퓨팅 기초",
    description: "AWS, Azure 등 주요 클라우드 플랫폼의 기본 서비스와 아키텍처를 이해하는 과정입니다.",
    issuer_name: "클라우드 에듀",
    url_to_badge_details: "https://example.com/cloud-computing",
    image: null
  },
  {
    name: "프로젝트 관리 실무",
    description: "애자일 방법론과 프로젝트 관리 도구를 활용한 효율적인 팀 협업 방법을 학습합니다.",
    issuer_name: "비즈니스 스쿨",
    url_to_badge_details: "https://example.com/project-management",
    image: null
  }
];

const RecommendedCoursesContent = ({ uid, idToken }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUsingDefault, setIsUsingDefault] = useState(false);

  useEffect(() => {
    if (uid && idToken) {
      setLoading(true);
      getBadgeRecommendations(uid, idToken)
        .then(res => {
          setRecommendations(res.data.recommendations || res.data);
          setIsUsingDefault(false);
          setLoading(false);
        })
        .catch(err => {
          console.error("뱃지 추천 API 호출 오류:", err);
          // API 에러 시 디폴트 추천 예시 사용
          setRecommendations(defaultRecommendations);
          setIsUsingDefault(true);
          setLoading(false);
        });
    } else if (!idToken) {
      // 로그인하지 않은 경우에도 디폴트 추천 예시 보여주기
      setRecommendations(defaultRecommendations);
      setIsUsingDefault(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [uid, idToken]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg font-medium text-gray-900">추천 뱃지를 불러오는 중...</p>
            <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
          </div>
        </div>
      </div>
    );
  }

  // 빈 상태 (이제 디폴트 예시가 있으므로 거의 발생하지 않음)
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
              <Award className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">추천할 뱃지가 없습니다</h3>
            <p className="text-sm text-gray-500">나중에 다시 확인해보세요</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-transparent" // font-sans 클래스 제거
      style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }} // 직접 폰트 지정
    >
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 헤더 섹션 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            맞춤 뱃지 추천
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            당신의 성장을 위한 특별한 뱃지들을 추천해드립니다
          </p>
          {/* API 에러 시 디폴트 사용 알림 */}
          {isUsingDefault && (
            <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
              <AlertCircle className="h-4 w-4 mr-2" />
              현재 추천 예시를 보여드리고 있습니다
            </div>
          )}
        </div>

        {/* 뱃지 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((badge, idx) => (
            <div 
              key={idx} 
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-blue-200"
            >
              {/* 뱃지 이미지/아이콘 */}
              <div className="mb-6">
                {badge.image ? (
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-200">
                    <img 
                      src={badge.image} 
                      alt={badge.name || '뱃지 이미지'} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <Award size={64} className="text-blue-500" />
                  </div>
                )}
              </div>

              {/* 뱃지 정보 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {badge.name || '이름 없는 뱃지'}
                </h3>
                
                {badge.issuer_name && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {badge.issuer_name}
                  </div>
                )}
                
                {badge.description && (
                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {badge.description}
                  </p>
                )}
              </div>

              {/* 액션 버튼 */}
              {badge.url_to_badge_details && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <a
                    href={badge.url_to_badge_details}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 group-hover:scale-105"
                  >
                    자세히 보기
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 푸터 정보 */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
            <Award className="h-4 w-4 mr-2" />
            총 {recommendations.length}개의 뱃지를 추천해드립니다
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RecommendedCoursesContent;