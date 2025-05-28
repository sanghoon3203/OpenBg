// WritingForm을 CommunityContents 바깥으로 분리합니다.
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

import { db, auth } from '../firebase';

import React, { useState, useEffect, useRef } from 'react';

const BOARD_CATEGORIES = [
  { id: 'job', name: '구인구직', icon: '🎯', description: '프로젝트 팀원을 찾거나 취업 기회를 발견하세요' },
  { id: 'certification', name: '뱃지 인증', icon: '🏆', description: '획득한 뱃지에 대한 경험을 공유하세요' },
  { id: 'challenge', name: '챌린지', icon: '🛠', description: '같이 뱃지를 따기 위한 챌린지에 참여하세요' },
  { id: 'review', name: '뱃지 리뷰', icon: '📬', description: '뱃지 획득 경험과 팁을 물어보세요' }
];
const WritingForm = ({
  // Props로 받을 상태와 함수들
  title,
  setTitle,
  content,
  setContent,
  selectedCategory,
  setSelectedCategory,
  myBadges,
  selectedBadges,
  handleBadgeToggle,
  handleSubmit,
  onCancel, // 취소 버튼 클릭 시 호출될 함수 (예: setIsWriting(false))
  activeTab, // 카테고리 기본 설정을 위해 필요
  isFormVisible, // 폼이 실제로 보여질 때를 감지하기 위해 (선택적)
}) => {
  const [isComposing, setIsComposing] = useState(false);
  const titleRef = useRef(null); // 포커스 관리를 위해 다시 사용

  // 폼이 나타날 때 (isWriting이 true가 될 때) 카테고리 기본 설정 및 포커스
  useEffect(() => {
    if (isFormVisible) { // 부모로부터 isWriting 상태를 isFormVisible 등의 prop으로 전달받음
      // 카테고리 기본 설정
      if (BOARD_CATEGORIES.find(c => c.id === activeTab)) {
        setSelectedCategory(activeTab);
      } else if (BOARD_CATEGORIES.length > 0) {
        setSelectedCategory(BOARD_CATEGORIES[0].id);
      }
      // 제목 입력창에 포커스
      titleRef.current?.focus();
    }
  }, [isFormVisible, activeTab, setSelectedCategory]); // isFormVisible이 true로 바뀔 때 실행

  return (
    <div className="min-h-screen bg-transparent" 
      style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }} // 직접 폰트 지정
    >
    <div className="mb-10 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">새 글 작성하기</h2>
        <button
          onClick={onCancel} // 부모로부터 받은 취소 함수 호출
          className="text-gray-400 hover:text-gray-600"
        >
          취소
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 카테고리 선택 */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">게시판 선택</label>
          <div className="flex flex-wrap gap-2">
            {BOARD_CATEGORIES.map(category => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 제목 입력 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input
            id="title"
            ref={titleRef} // 포커스 관리를 위해 ref 다시 연결
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            value={title}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionUpdate={() => setIsComposing(true)}
            onCompositionEnd={(e) => {
              setIsComposing(false);
              setTitle(e.target.value);
            }}
            onChange={(e) => {
              // isComposing 조건 없이 항상 setTitle 호출 (타이핑 보이도록)
              // 자소분리 발생 시, 이전처럼 if(!isComposing) 조건 추가 고려
              setTitle(e.target.value);
            }}
            placeholder="제목을 입력해주세요"
            required
          />
        </div>

        {/* 내용 입력 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">내용</label>
          <textarea
            id="content"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none h-32"
            placeholder="내용을 입력해주세요"
            value={content}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionUpdate={() => setIsComposing(true)}
            onCompositionEnd={(e) => {
              setIsComposing(false);
              setContent(e.target.value);
            }}
            onChange={(e) => {
              // isComposing 조건 없이 항상 setContent 호출
              setContent(e.target.value);
            }}
            required
          />
        </div>

        {/* 뱃지 선택 등 나머지 폼 요소들 ... props로 받은 값/함수 사용 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">필수 뱃지 선택</label>
          <div className="flex flex-wrap gap-2">
            {myBadges.map((badge) => (
              <button
                key={badge.badgeId}
                type="button"
                onClick={() => handleBadgeToggle(badge.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedBadges.includes(badge.name)
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'
                }`}
              >
                {badge.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-2">나의 보유 뱃지 (자동 태그)</p>
          <div className="flex flex-wrap gap-1">
            {myBadges.slice(0, 3).map((badge, index) => (
              <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                {badge.name}
              </span>
            ))}
            {myBadges.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{myBadges.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            글 등록하기
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};


const CommunityContents = () => {
  // ... 기존 상태 및 함수들 ...
  const user = auth.currentUser;
  const [activeTab, setActiveTab] = useState('job');
  const [myBadges, setMyBadges] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendedBoards, setRecommendedBoards] = useState([]);

  // 글쓰기 폼 상태
  const [isWriting, setIsWriting] = useState(false); // WritingForm 표시 여부
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('job');
  const [selectedBadges, setSelectedBadges] = useState([]);

  // ... fetchMyBadges, fetchPosts, handleBadgeToggle, handleSubmit 등 ...
    // 내 뱃지 가져오기
    const fetchMyBadges = async () => {
      if (!user) return;
      const badgeRef = collection(db, 'users', user.uid, 'badges');
      const snapshot = await getDocs(badgeRef);
      const fetched = snapshot.docs.map(doc => ({ badgeId: doc.id, ...doc.data() }));
      setMyBadges(fetched);
      
      // 뱃지 기반 게시판 추천 로직
      const recommendations = [];
      const badgeNames = fetched.map(b => b.name.toLowerCase());
      
      if (badgeNames.some(b => b.includes('react') || b.includes('vue') || b.includes('angular'))) {
        recommendations.push('job');
      }
      
      if (badgeNames.some(b => b.includes('python') || b.includes('ml') || b.includes('ai'))) {
        recommendations.push('challenge');
      }
      
      if (badgeNames.length > 5) {
        recommendations.push('certification');
      }
      
      if (recommendations.length === 0 && badgeNames.length > 0) {
        recommendations.push('review');
      }
      
      setRecommendedBoards(recommendations);
    };
  
    // 게시글 목록 불러오기
    const fetchPosts = async () => {
      setLoading(true);
      const postRef = collection(db, 'community_posts');
      const q = query(
        postRef,
        where('type', '==', activeTab),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ postId: doc.id, ...doc.data() }));
      setPosts(fetched);
      setLoading(false);
    };
  
    useEffect(() => {
      if (user?.uid) {
        fetchMyBadges();
      }
    }, [user?.uid]);
  
    // useEffect(() => {
    //   console.log('isWriting 상태:', isWriting);
    // }, [isWriting]);
  
    useEffect(() => {
      fetchPosts();
    }, [activeTab]);
  
    const handleBadgeToggle = (badgeName) => {
      if (selectedBadges.includes(badgeName)) {
        setSelectedBadges(selectedBadges.filter(b => b !== badgeName));
      } else {
        setSelectedBadges([...selectedBadges, badgeName]);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!user) return;
  
      const topBadges = myBadges.slice(0, 3).map(b => b.name);
  
      const newPost = {
        title,
        content,
        type: selectedCategory,
        requiredBadges: selectedBadges,
        userId: user.uid,
        userEmail: user.email,
        userBadges: myBadges.map(b => b.name),
        userTopBadges: topBadges,
        createdAt: new Date().toISOString(),
      };
  
      await addDoc(collection(db, 'community_posts'), newPost);
      setTitle('');
      setContent('');
      setSelectedBadges([]);
      setIsWriting(false);
      fetchPosts();
    };
  
    // 유저 프로필 배지 컴포넌트
    const UserBadges = ({ badges }) => {
      if (!badges || badges.length === 0) return null;
      
      return (
        <div className="flex -space-x-1 overflow-hidden">
          {badges.slice(0, 3).map((badge, index) => (
            <div key={index} className="inline-block h-5 w-5 rounded-full bg-blue-100 text-xs flex items-center justify-center border border-white ring-2 ring-white">
              {badge.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
      );
    };
  
    // 포스트 카드 컴포넌트
    const PostCard = ({ post }) => {
      return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-500 text-sm">{post.userEmail}</p>
                <UserBadges badges={post.userTopBadges} />
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <p className="text-gray-700 my-4 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
          
          {post.requiredBadges && post.requiredBadges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {post.requiredBadges.map((badge, index) => (
                <span 
                  key={index} 
                  className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    };
  
    // 탭 메뉴 컴포넌트
    const TabMenu = () => {
      return (
          <div className="flex overflow-x-auto whitespace-nowrap pb-4 mb-6 gap-2 scrollbar-hide" style={{ overflow: 'visible' }}>
              {BOARD_CATEGORIES.map(category => (
            <button
            key={category.id}
            onClick={() => {setActiveTab(category.id); setIsWriting(false);}} // 탭 변경 시 글쓰기 폼 닫기
            className={`px-5 py-3.5 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-1.5
              ${activeTab === category.id ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
              ${recommendedBoards.includes(category.id) ? 'ring-2 ring-blue-200 ring-offset-2' : ''}`}
            style={{ overflow: 'visible' }} 
          >
              <span>{category.icon}</span>
              <span>{category.name}</span>
              {recommendedBoards.includes(category.id) && (
                <span className="ml-1 text-xs px-1.5 py-0.5 bg-blue-200 text-blue-800 rounded-full">추천</span>
              )}
            </button>
          ))}
        </div>
      );
    };
    
    // 글쓰기 버튼 컴포넌트
    const WriteButton = () => {
      return (
        <button
          onClick={() => {
            setIsWriting(true);
            // 카테고리 기본 설정은 WritingForm 내부 useEffect로 이동 또는 여기서도 유지 가능
            // if (BOARD_CATEGORIES.find(c => c.id === activeTab)) {
            //   setSelectedCategory(activeTab);
            // } else if (BOARD_CATEGORIES.length > 0) {
            //   setSelectedCategory(BOARD_CATEGORIES[0].id); 
            // }
          }}
          className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all flex items-center justify-center"
        >
          <span className="text-xl">✏️</span>
        </button>
      );
    };


  // ... 나머지 CommunityContents 렌더링 로직 ...
  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-gray-400">로딩 중...</div>
      </div>
    );
  }

  return (
    
    <div className="max-w-4xl mx-auto px-4 py-8"
    style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      {/* 헤더 */}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">커뮤니티</h1>
        <p className="text-gray-500 mt-2">배지를 활용한 다양한 소통 공간입니다</p>
      </div>
      
      {/* 탭 메뉴 */}
      <TabMenu />

      {/* 현재 카테고리 설명 */}
      <div className="mb-8">
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{BOARD_CATEGORIES.find(c => c.id === activeTab)?.icon}</span>
            <h2 className="text-xl font-semibold text-gray-800">
              {BOARD_CATEGORIES.find(c => c.id === activeTab)?.name} 게시판
            </h2>
          </div>
          <p className="text-gray-600">
            {BOARD_CATEGORIES.find(c => c.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* 글쓰기 폼: isWriting 상태에 따라 WritingForm을 조건부 렌더링 */}
      {isWriting && (
        <WritingForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          myBadges={myBadges}
          selectedBadges={selectedBadges}
          handleBadgeToggle={handleBadgeToggle}
          handleSubmit={handleSubmit}
          onCancel={() => setIsWriting(false)} // 취소 핸들러 전달
          activeTab={activeTab} // 카테고리 기본 설정을 위해 전달
          isFormVisible={isWriting} // 폼 표시 여부 전달
        />
      )}

      {/* 게시글 목록 */}
      {/* 글쓰기 중일 때는 목록을 숨기거나, 아니면 그대로 표시 (현재는 그대로 표시) */}
      <div className="space-y-4 mb-16">
        {!isWriting && posts.length === 0 ? ( // 글쓰기 중이 아니고 글도 없을 때만 "첫 글 작성" 버튼 표시
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-500">등록된 글이 없습니다.</p>
            <button
              onClick={() => setIsWriting(true)}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
            >
              첫 글 작성하기
            </button>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))
        )}
      </div>

      {/* 글쓰기 버튼 */}
      {!isWriting && <WriteButton />}
    </div>
  );
};

export default CommunityContents;