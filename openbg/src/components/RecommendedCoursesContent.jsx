// FILE: src/components/RecommendedCoursesContent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { getBadgeRecommendations } from '../services/api'; // 경로는 실제 프로젝트에 맞게 수정
import AnimatedLoadingScreen from './AnimatedLoadingScreen'; // 위에서 만든 로딩 화면 import
import { Award, ExternalLink, AlertCircle } from 'lucide-react'; // 필요한 아이콘만 import

// 디폴트 추천 예시 데이터 (기존과 동일)
const defaultRecommendations = [
  {
    id: "default-js", // default 데이터에도 id 추가 (key 에러 방지)
    name: "JavaScript 기초 마스터",
    description: "웹 개발의 핵심 언어인 JavaScript의 기본 문법부터 고급 개념까지 체계적으로 학습할 수 있는 뱃지입니다.",
    issuer_name: "코딩 아카데미",
    url_to_badge_details: "https://example.com/javascript-basics",
    image: null, // 또는 기본 이미지 URL
    score: 0.95
  },
  {
    id: "default-react",
    name: "React 개발자 인증",
    description: "현대 웹 개발의 필수 기술인 React를 활용한 프론트엔드 개발 능력을 인증하는 뱃지입니다.",
    issuer_name: "프론트엔드 스쿨",
    url_to_badge_details: "https://example.com/react-certification",
    image: null,
    score: 0.92
  },
  // ... (다른 디폴트 뱃지들도 id 추가 권장)
];


const RecommendedCoursesContent = ({ uid, idToken }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPhase, setLoadingPhase] = useState('INIT');
  const [isUsingDefault, setIsUsingDefault] = useState(false);
  
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchRecommendationsData = async () => {
      setLoading(true);
      hasFetched.current = true;

      try {
        setLoadingPhase('FETCHING');
        const randomNum = Math.floor(Math.random() * 200) + 1;
        const firestoreUserIdToUse = `U1${String(randomNum).padStart(4, '0')}`;
        const res = await getBadgeRecommendations(uid, idToken, firestoreUserIdToUse);

        // console.log("API 응답 데이터 (res.data):", res.data); // 디버깅용 로그

        const apiData = res.data; 

        setLoadingPhase('GENERATING_RECOMMENDATIONS');
        const recs = apiData.recommendations || []; 
        
        if (Array.isArray(recs) && recs.length > 0) {
          const formattedRecs = recs.map(badge => ({
            id: badge.badge_id, // API의 badge_id를 UI의 id로 매핑
            name: badge.name,
            issuer_name: badge.issuer, // API의 issuer를 UI의 issuer_name으로 매핑
            skills: badge.skills, 
            competency: badge.competency,
            score: badge.similarity_score, // API의 similarity_score를 UI의 score로 매핑
            description: badge.recommendation_reason, // API의 recommendation_reason을 UI의 description으로 매핑
            image: badge.image || null, // API에 image 필드가 있다면 사용, 없으면 null
            url_to_badge_details: badge.url_to_badge_details || null, // API에 있다면 사용
            // API 응답에 있는 추가 정보도 필요하면 여기에 포함:
            // expected_benefits: badge.expected_benefits,
            // preparation_steps: badge.preparation_steps
          }));
          setRecommendations(formattedRecs);
          setIsUsingDefault(false);
        } else {
          console.warn("API로부터 유효한 추천 데이터가 오지 않았습니다. 기본 추천을 사용합니다.");
          setRecommendations(defaultRecommendations);
          setIsUsingDefault(true);
        }
        setLoadingPhase('FINALIZING');
        // await new Promise(r => setTimeout(r, 300)); // 애니메이션 확인용 인위적 딜레이
        setLoadingPhase('DONE');

      } catch (err) {
        console.error("뱃지 추천 API 호출 오류:", err);
        setRecommendations(defaultRecommendations);
        setIsUsingDefault(true);
        setLoadingPhase('DONE');
      } finally {
        setTimeout(() => setLoading(false), 500); // 로딩 애니메이션이 보이도록 약간의 지연
      }
    };

    if (idToken && !hasFetched.current) {
      fetchRecommendationsData();
    } else if (!idToken && !loading && (!recommendations || recommendations === defaultRecommendations)) {
      console.log("로그인되지 않았거나 idToken이 없습니다. 기본 추천을 표시합니다.");
      setRecommendations(defaultRecommendations); // 기본 추천 설정
      setIsUsingDefault(true);
      setLoading(false); 
    }
  }, [uid, idToken, loading, recommendations]);


  if (loading) {
    return <AnimatedLoadingScreen currentPhase={loadingPhase} />;
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
              <Award className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">추천할 뱃지가 없습니다</h3>
            <p className="text-sm text-gray-500">나중에 다시 확인해보세요.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="min-h-screen bg-transparent"
      style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              맞춤 뱃지 추천
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              당신의 성장을 위한 특별한 뱃지들을 추천해드립니다
            </p>
            {isUsingDefault && (
              <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
                <AlertCircle className="h-4 w-4 mr-2" />
                현재 추천 예시를 보여드리고 있습니다
              </div>
            )}
          </div>

          {/* 사용자 정보, 구성된 쿼리, 이미 획득한 배지 섹션은 API 응답에 없으므로 제거됨 */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((badge, idx) => {
              const isTop5 = idx < 5;
              const badgeScore = badge.score ? (badge.score * 100).toFixed(2) : 'N/A';

              return (
                <div 
                  key={badge.id || `badge-${idx}`}
                  className={`group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-200 border 
                              ${isTop5 ? 'border-indigo-100 hover:border-indigo-300' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <div className="mb-6">
                    {badge.image ? (
                       <div className="h-48 bg-gradient-to-br from-indigo-50 to-indigo-50 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-200">
                        <img 
                          src={badge.image} 
                          alt={badge.name || '뱃지 이미지'} 
                          className="w-full h-full object-cover"
                          onError={(e) => { 
                            e.target.onerror = null; 
                            const parentDiv = e.target.parentElement;
                            if (parentDiv) {
                              parentDiv.innerHTML = '';
                              const fallbackIcon = document.createElement('div');
                              fallbackIcon.className = "h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center";
                              fallbackIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="text-gray-400"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
                              parentDiv.appendChild(fallbackIcon);
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className={`h-48 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 
                                      ${isTop5 ? 'bg-gradient-to-br from-indigo-50 to-indigo-100' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
                        <Award size={64} className={`${isTop5 ? 'text-indigo-500' : 'text-gray-500'}`} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className={`text-xl font-bold leading-tight 
                                  ${isTop5 ? 'text-gray-900' : 'text-gray-700'}`}>
                      {badge.id || 'ID 없음'} - {badge.name || '이름 없는 뱃지'}
                    </h3>
                    
                    {badge.issuer_name && (
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                      ${isTop5 ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                        {badge.issuer_name}
                      </div>
                    )}
                    
                    {badge.description && (
                      <p className={`leading-relaxed line-clamp-3 
                                    ${isTop5 ? 'text-gray-600' : 'text-gray-500'}`}>
                        {badge.description}
                      </p>
                    )}

                    {badge.score !== undefined && badgeScore !== 'N/A' && (
                      <p className={`font-semibold ${isTop5 ? 'text-indigo-700' : 'text-gray-600'}`}>
                        유사도: {badgeScore}%
                      </p>
                    )}
                  </div>

                  {badge.url_to_badge_details && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <a
                        href={badge.url_to_badge_details}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white transition-all duration-200 group-hover:scale-105
                                    ${isTop5 ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'}`}
                      >
                        자세히 보기
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
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