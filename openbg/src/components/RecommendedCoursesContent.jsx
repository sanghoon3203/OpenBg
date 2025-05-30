import React, { useState, useEffect } from 'react';
import { getBadgeRecommendations } from '../services/api'; // 경로 확인 필요
import { Award, ExternalLink, AlertCircle } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore'; // Firestore에서 문서 가져오기 위해 추가
import { db } from '../firebase'; // Firestore 인스턴스 가져오기 (경로 확인 필요)
// GIF 이미지를 import 하거나, public 폴더에 있다면 직접 경로를 사용합니다.
// 예시: import CodingCatGif from '../assets/Codeing_cat.gif'; // src/assets 폴더에 있을 경우
// 또는 public 폴더에 있다면 const codingCatGifPath = "/Codeing_cat.gif";

// 디폴트 추천 예시 데이터 (기존과 동일)
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
    const fetchFirestoreUserIdAndRecommendations = async () => {
      if (uid && idToken) {
        setLoading(true);
        try {
          const userDocRef = doc(db, 'users', uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const fetchedFirestoreUserId = userData.user_id;
            
            if (fetchedFirestoreUserId) {
              getBadgeRecommendations(uid, idToken, fetchedFirestoreUserId)
                .then(res => {
                  const recs = res.data.recommendations || res.data;
                  if (Array.isArray(recs) && recs.length > 0) {
                    setRecommendations(recs);
                    setIsUsingDefault(false);
                  } else {
                    console.warn("API로부터 유효한 추천 데이터가 오지 않았습니다. 기본 추천을 사용합니다.");
                    setRecommendations(defaultRecommendations);
                    setIsUsingDefault(true);
                  }
                })
                .catch(err => {
                  console.error("뱃지 추천 API 호출 오류:", err);
                  setRecommendations(defaultRecommendations);
                  setIsUsingDefault(true);
                });
            } else {
              console.error(`Firestore 사용자 문서(uid: ${uid})에 user_id 필드가 없습니다.`);
              setRecommendations(defaultRecommendations);
              setIsUsingDefault(true);
            }
          } else {
            console.error(`Firestore에서 사용자 문서(uid: ${uid})를 찾을 수 없습니다.`);
            setRecommendations(defaultRecommendations);
            setIsUsingDefault(true);
          }
        } catch (error) {
          console.error("Firestore user_id 조회 또는 API 호출 중 오류:", error);
          setRecommendations(defaultRecommendations);
          setIsUsingDefault(true);
        } finally {
          setLoading(false);
        }
      } else if (!idToken) {
        console.log("로그인되지 않은 사용자입니다. 기본 추천을 표시합니다.");
        setRecommendations(defaultRecommendations);
        setIsUsingDefault(true);
        setLoading(false);
      } else if (!uid) {
        console.error("uid가 제공되지 않았습니다. 추천을 가져올 수 없습니다.");
        setRecommendations(defaultRecommendations);
        setIsUsingDefault(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchFirestoreUserIdAndRecommendations();
  }, [uid, idToken]);

  // 로딩 상태 UI 변경
  if (loading) {
    // public 폴더에 Codeing_cat.gif가 있다고 가정하고 경로 설정
    const codingCatGifPath = "/Codeing_cat.gif"; 
    // 만약 src/assets 폴더에 있다면:
    // import CodingCatGif from '../assets/Codeing_cat.gif';
    // const codingCatGifPath = CodingCatGif;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        {/* GIF 이미지 표시 */}
        <img 
          src={codingCatGifPath} 
          alt="로딩 중..." 
          className="w-48 h-48 mb-6" // GIF 크기는 적절히 조절해주세요.
        />
        <p className="text-xl font-semibold text-indigo-600 mb-2">
          현재 추천목록을 작성하고 있습니다!
        </p>
        <p className="text-md text-gray-500">
          잠시만 기다려주시면 멋진 뱃지들을 찾아드릴게요. 🧐
        </p>
      </div>
    );
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
    <div className="min-h-screen bg-gray-50"> {/* 이 div는 중복일 수 있습니다. 전체 레이아웃 확인 필요 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 헤더 섹션 */}
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

        {/* 뱃지 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((badge, idx) => (
            <div 
              key={badge.id || idx} // badge.id가 있다면 그것을 사용, 없으면 idx
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-indigo-200"
            >
              {/* 뱃지 이미지/아이콘 */}
              <div className="mb-6">
                {badge.image ? (
                  <div className="h-48 bg-gradient-to-br from-indigo-50 to-indigo-50 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-200">
                    <img 
                      src={badge.image} 
                      alt={badge.name || '뱃지 이미지'} 
                      className="w-full h-full object-cover"
                      onError={(e) => { 
                        e.target.onerror = null; // 무한 루프 방지
                        // 대체 이미지나 스타일 처리
                        const parentDiv = e.target.parentElement;
                        if (parentDiv) {
                          parentDiv.innerHTML = ''; // 기존 이미지 태그 제거
                          const fallbackIcon = document.createElement('div');
                          fallbackIcon.className = "h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center";
                          fallbackIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="text-gray-400"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
                          parentDiv.appendChild(fallbackIcon);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-indigo-50 to-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <Award size={64} className="text-indigo-500" />
                  </div>
                )}
              </div>

              {/* 뱃지 정보 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {badge.name || '이름 없는 뱃지'}
                </h3>
                
                {badge.issuer_name && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
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
                    className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 group-hover:scale-105"
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