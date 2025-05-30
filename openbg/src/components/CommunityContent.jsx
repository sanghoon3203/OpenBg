import React, { useState, useEffect, useRef } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc, // Firestore 문서 참조
  deleteDoc, // Firestore 문서 삭제
  Timestamp, // Firestore 타임스탬프 (필요시 사용, 현재는 new Date().toISOString() 사용 중)
} from 'firebase/firestore';
import { db, auth } from '../firebase';

const BOARD_CATEGORIES = [
  { id: 'job', name: '구인구직', icon: '🎯', description: '프로젝트 팀원을 찾거나 취업 기회를 발견하세요' },
  { id: 'certification', name: '뱃지 인증', icon: '🏆', description: '획득한 뱃지에 대한 경험을 공유하세요' },
  { id: 'challenge', name: '챌린지', icon: '🛠', description: '같이 뱃지를 따기 위한 챌린지에 참여하세요' },
  { id: 'review', name: '뱃지 리뷰', icon: '📬', description: '뱃지 획득 경험과 팁을 물어보세요' }
];

// 1. UserBadges 컴포넌트 (CommunityContents 외부로 이동)
const UserBadges = ({ badges }) => {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="flex -space-x-1 overflow-hidden">
      {badges.slice(0, 3).map((badge, index) => (
        <div key={index} className="inline-block h-5 w-5 rounded-full bg-indigo-100 text-xs flex items-center justify-center border border-white ring-2 ring-white">
          {/* 뱃지 이름이 길 경우 첫 글자만 표시 */}
          {badge && badge.length > 0 ? badge.charAt(0).toUpperCase() : '?'}
        </div>
      ))}
    </div>
  );
};

// 2. WritingForm 컴포넌트 (변경 없음)
const WritingForm = ({
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
  onCancel,
  activeTab,
  isFormVisible,
}) => {
  const [isComposing, setIsComposing] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (isFormVisible) {
      if (BOARD_CATEGORIES.find(c => c.id === activeTab)) {
        setSelectedCategory(activeTab);
      } else if (BOARD_CATEGORIES.length > 0) {
        setSelectedCategory(BOARD_CATEGORIES[0].id);
      }
      titleRef.current?.focus();
    }
  }, [isFormVisible, activeTab, setSelectedCategory]);

  return (
    <div className="min-h-screen bg-transparent"
      style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      <div className="mb-10 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">새 글 작성하기</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            취소
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">게시판 선택</label>
            <div className="flex flex-wrap gap-2">
              {BOARD_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category.id
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input
              id="title"
              ref={titleRef}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              value={title}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionUpdate={() => setIsComposing(true)}
              onCompositionEnd={(e) => {
                setIsComposing(false);
                setTitle(e.target.value);
              }}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="제목을 입력해주세요"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <textarea
              id="content"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none h-32"
              placeholder="내용을 입력해주세요"
              value={content}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionUpdate={() => setIsComposing(true)}
              onCompositionEnd={(e) => {
                setIsComposing(false);
                setContent(e.target.value);
              }}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">필수 뱃지 선택</label>
            <div className="flex flex-wrap gap-2">
              {myBadges.map((badge) => (
                <button
                  key={badge.badgeId}
                  type="button"
                  onClick={() => handleBadgeToggle(badge.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedBadges.includes(badge.name)
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
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
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
            >
              글 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. CommentForm 컴포넌트 (신규)
const CommentForm = ({ postId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = auth.currentUser;

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const commentsColRef = collection(db, 'community_posts', postId, 'comments');
      await addDoc(commentsColRef, {
        text: commentText,
        userId: user.uid,
        userEmail: user.email, // 또는 user.displayName
        createdAt: new Date().toISOString(),
      });
      setCommentText('');
      if (onCommentAdded) {
        onCommentAdded(); // 댓글 목록 새로고침 콜백
      }
    } catch (error) {
      console.error("댓글 작성 오류:", error);
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleCommentSubmit} className="mt-4">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="따뜻한 댓글을 남겨주세요..."
        className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:border-transparent outline-none"
        rows="3"
        required
        disabled={isSubmitting}
      />
      <button 
        type="submit" 
        className="mt-2 px-5 py-2.5 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 disabled:opacity-50"
        disabled={isSubmitting || !commentText.trim()}
      >
        {isSubmitting ? '등록 중...' : '댓글 등록'}
      </button>
    </form>
  );
};

// 4. CommentList 컴포넌트 (신규)
const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const commentsColRef = collection(db, 'community_posts', postId, 'comments');
      const q = query(commentsColRef, orderBy('createdAt', 'asc')); // 오래된 댓글부터
      const snapshot = await getDocs(q);
      const fetchedComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(fetchedComments);
    } catch (error) {
      console.error("댓글 불러오기 오류:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (postId) { // postId가 유효할 때만 fetch
      fetchComments();
    }
  }, [postId]);

  const handleCommentAdded = () => {
    fetchComments(); // 새 댓글 추가 후 목록 새로고침
  };

  if (loadingComments) return <p className="text-sm text-gray-400 mt-3 py-2">댓글 로딩 중...</p>;

  return (
    <div className="mt-6 space-y-4">
      <h4 className="text-md font-semibold text-gray-800 border-b pb-2">댓글 ({comments.length})</h4>
      {comments.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
      ) : (
        comments.map(comment => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded-lg text-sm">
            <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-gray-700">{comment.userEmail}</p>
                <p className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
                </p>
            </div>
            <p className="text-gray-600 whitespace-pre-wrap">{comment.text}</p>
          </div>
        ))
      )}
      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
    </div>
  );
};


// 5. PostCard 컴포넌트 (수정: 삭제 버튼, 댓글 기능 추가)
const PostCard = ({ post, currentUserUid, onDeletePost }) => {
  const isAuthor = post.userId === currentUserUid;
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer">{post.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-500 text-sm">{post.userEmail}</p>
            <UserBadges badges={post.userTopBadges} /> {/* UserBadges 컴포넌트 사용 */}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          {isAuthor && (
            <button
              onClick={() => onDeletePost(post.postId)}
              className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors"
              aria-label="게시글 삭제"
            >
              삭제
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-700 my-4 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

      {post.requiredBadges && post.requiredBadges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {post.requiredBadges.map((badge, index) => (
            <span
              key={index}
              className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium"
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* 댓글 섹션 */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          {showComments ? '댓글 숨기기' : '댓글 보기'}
        </button>
        {showComments && <CommentList postId={post.postId} />}
      </div>
    </div>
  );
};


const CommunityContents = () => {
  const user = auth.currentUser;
  const [activeTab, setActiveTab] = useState('job');
  const [myBadges, setMyBadges] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendedBoards, setRecommendedBoards] = useState([]);

  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('job');
  const [selectedBadges, setSelectedBadges] = useState([]);

  const fetchMyBadges = async () => {
    if (!user) return;
    const badgeRef = collection(db, 'users', user.uid, 'badges');
    const snapshot = await getDocs(badgeRef);
    const fetched = snapshot.docs.map(doc => ({ badgeId: doc.id, ...doc.data() }));
    setMyBadges(fetched);

    const recommendations = [];
    const badgeNames = fetched.map(b => b.name.toLowerCase());
    if (badgeNames.some(b => b.includes('react') || b.includes('vue') || b.includes('angular'))) recommendations.push('job');
    if (badgeNames.some(b => b.includes('python') || b.includes('ml') || b.includes('ai'))) recommendations.push('challenge');
    if (badgeNames.length > 5) recommendations.push('certification');
    if (recommendations.length === 0 && badgeNames.length > 0) recommendations.push('review');
    setRecommendedBoards(recommendations);
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postRef = collection(db, 'community_posts');
      const q = query(
        postRef,
        where('type', '==', activeTab),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ postId: doc.id, ...doc.data() }));
      setPosts(fetched);
    } catch (error) {
        console.error("게시글 불러오기 실패:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchMyBadges();
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const handleBadgeToggle = (badgeName) => {
    setSelectedBadges(prev =>
      prev.includes(badgeName) ? prev.filter(b => b !== badgeName) : [...prev, badgeName]
    );
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

    try {
        await addDoc(collection(db, 'community_posts'), newPost);
        setTitle('');
        setContent('');
        setSelectedBadges([]);
        setIsWriting(false);
        fetchPosts(); // 새 글 등록 후 목록 새로고침
    } catch (error) {
        console.error("글 등록 실패: ", error);
        alert("글 등록에 실패했습니다.");
    }
  };

  // 게시글 삭제 핸들러
  const handleDeletePost = async (postId) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        const postDocRef = doc(db, 'community_posts', postId);
        await deleteDoc(postDocRef);
        // UI에서 즉시 제거 (또는 fetchPosts() 호출)
        setPosts(prevPosts => prevPosts.filter(post => post.postId !== postId));
        alert('게시글이 삭제되었습니다.');
      } catch (error) {
        console.error("게시글 삭제 중 오류 발생:", error);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  const TabMenu = () => (
    <div className="flex overflow-x-auto whitespace-nowrap pb-4 mb-6 gap-2 scrollbar-hide" style={{ overflow: 'visible' }}>
      {BOARD_CATEGORIES.map(category => (
        <button
          key={category.id}
          onClick={() => { setActiveTab(category.id); setIsWriting(false); }}
          className={`px-5 py-3.5 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-1.5
            ${activeTab === category.id ? 'bg-indigo-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
            ${recommendedBoards.includes(category.id) ? 'ring-2 ring-indigo-200 ring-offset-2' : ''}`}
          style={{ overflow: 'visible' }}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
          {recommendedBoards.includes(category.id) && (
            <span className="ml-1 text-xs px-1.5 py-0.5 bg-indigo-200 text-indigo-800 rounded-full">추천</span>
          )}
        </button>
      ))}
    </div>
  );

  const WriteButton = () => (
    <button
      onClick={() => setIsWriting(true)}
      className="fixed bottom-8 right-8 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-4 shadow-lg transition-all flex items-center justify-center z-50"
    >
      <span className="text-xl">✏️</span>
    </button>
  );

  if (loading && posts.length === 0 && !isWriting) { // 글쓰기 중이 아닐 때만 로딩 표시
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-gray-400">게시글을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8"
      style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">커뮤니티</h1>
        <p className="text-gray-500 mt-2">배지를 활용한 다양한 소통 공간입니다</p>
      </div>

      <TabMenu />

      {!isWriting && ( // 글쓰기 중이 아닐 때만 카테고리 설명 표시
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
      )}
      
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
          onCancel={() => setIsWriting(false)}
          activeTab={activeTab}
          isFormVisible={isWriting}
        />
      )}

      {!isWriting && ( // 글쓰기 중이 아닐 때만 게시글 목록 또는 "첫 글 작성" 버튼 표시
        <div className="space-y-4 mb-16">
          {posts.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-500">등록된 글이 없습니다.</p>
              <button
                onClick={() => setIsWriting(true)}
                className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm transition-colors"
              >
                첫 글 작성하기
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.postId}
                post={post}
                currentUserUid={user?.uid} // 현재 사용자 UID 전달
                onDeletePost={handleDeletePost} // 삭제 함수 전달
              />
            ))
          )}
        </div>
      )}

      {!isWriting && <WriteButton />}
    </div>
  );
};

export default CommunityContents;