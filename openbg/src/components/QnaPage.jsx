import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Award, ArrowRight, MessageCircle, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const QnAPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState({});
const navigate = useNavigate();
 
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleQuestion = (id) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'general', name: '일반' },
    { id: 'badges', name: '배지' },
    { id: 'account', name: '계정' },
    { id: 'issuers', name: '발행자' },
    { id: 'technical', name: '기술' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'general',
      question: 'OpenBadge는 무엇인가요?',
      answer: 'OpenBadge는 디지털 배지를 통해 개인의 기술, 지식, 성취를 인증하고 공유할 수 있는 플랫폼입니다. 공인된 기관이나 교육 제공자가 발행한 디지털 배지를 통해 자신의 능력을 증명하고, 이를 소셜 미디어나 이력서에 공유할 수 있습니다.'
    },
    {
      id: 2,
      category: 'badges',
      question: '디지털 배지는 어떻게 획득하나요?',
      answer: 'OpenBadge에서 제공하는 다양한 교육 과정이나 도전 과제를 완료하면 배지를 획득할 수 있습니다. 또한, OpenBadge와 협력하는 교육 기관, 기업, 단체에서 제공하는 프로그램을 이수하여 배지를 획득할 수도 있습니다. 각 배지마다 획득 조건과 방법이 다르니 배지 상세 페이지에서 확인하세요.'
    },
    {
      id: 3,
      category: 'badges',
      question: '배지의 유효기간이 있나요?',
      answer: '대부분의 배지는 영구적으로 유효하지만, 일부 배지는 시간이 지남에 따라 갱신이 필요한 경우가 있습니다. 특히 빠르게 변화하는 기술 분야의 배지는 주기적인 갱신이 필요할 수 있습니다. 각 배지의 유효기간은 배지 상세 정보에서 확인할 수 있습니다.'
    },
    {
      id: 4,
      category: 'account',
      question: '계정을 어떻게 만들 수 있나요?',
      answer: '홈페이지 상단의 "회원가입" 버튼을 클릭하여 계정을 생성할 수 있습니다. 이메일 주소나 소셜 미디어 계정을 통해 간편하게 가입할 수 있으며, 프로필 설정 후 바로 서비스를 이용할 수 있습니다.'
    },
    {
      id: 5,
      category: 'account',
      question: '비밀번호를 잊어버렸어요. 어떻게 해야 하나요?',
      answer: '로그인 페이지에서 "비밀번호 찾기" 옵션을 선택하세요. 가입 시 사용한 이메일 주소를 입력하면 비밀번호 재설정 링크가 포함된 이메일을 받을 수 있습니다. 링크를 통해 새로운 비밀번호를 설정하면 됩니다.'
    },
    {
      id: 6,
      category: 'issuers',
      question: '배지 발행자가 되려면 어떻게 해야 하나요?',
      answer: 'OpenBadge 발행자 프로그램에 지원하려면 홈페이지의 "발행자 되기" 섹션을 방문하세요. 발행자 자격 요건, 신청 절차, 그리고 배지 발행에 필요한 기준 등에 대한 자세한 정보를 확인할 수 있습니다. 교육 기관, 기업, 비영리 단체 등 다양한 조직이 발행자가 될 수 있습니다.'
    },
    {
      id: 7,
      category: 'issuers',
      question: '발행자로서 어떤 종류의 배지를 만들 수 있나요?',
      answer: '발행자는 자신의 전문 분야와 관련된 다양한 배지를 만들 수 있습니다. 교육 과정, 워크샵, 기술 인증, 컨퍼런스 참여, 자원봉사 활동 등 다양한 성취와 역량을 인증하는 배지를 설계할 수 있습니다. 배지는 OpenBadge의 가이드라인을 준수해야 하며, 명확한 획득 기준을 포함해야 합니다.'
    },
    {
      id: 8,
      category: 'technical',
      question: '배지는 어디에서 관리할 수 있나요?',
      answer: '로그인 후 "내 배지" 또는 "배지 지갑" 섹션에서 획득한 모든 배지를 확인하고 관리할 수 있습니다. 이곳에서 배지의 공개 여부를 설정하거나, 소셜 미디어에 공유하거나, 배지 모음을 만들어 정리할 수 있습니다.'
    },
    {
      id: 9,
      category: 'technical',
      question: '배지를 소셜 미디어나 이력서에 어떻게 공유하나요?',
      answer: '각 배지 상세 페이지에서 "공유하기" 버튼을 클릭하면 LinkedIn, Facebook, Twitter 등의 소셜 미디어 플랫폼에 직접 공유할 수 있는 옵션이 제공됩니다. 또한, 배지 URL을 복사하여 이력서나 포트폴리오에 포함시킬 수 있으며, 배지 모음을 웹 페이지로 만들어 공유할 수도 있습니다.'
    },
    {
      id: 10,
      category: 'general',
      question: 'OpenBadge는 무료인가요?',
      answer: 'OpenBadge 기본 서비스는 무료로 제공됩니다. 사용자는 무료로 계정을 만들고, 배지를 획득하고, 관리하고, 공유할 수 있습니다. 그러나 일부 프리미엄 기능이나 고급 교육 과정은 유료로 제공될 수 있습니다. 또한, 발행자는 배지 발행 및 관리를 위한 구독 서비스를 이용할 수 있습니다.'
    }
  ];

  // 검색 및 필터링 로직
  const filteredFaqs = faqs
    .filter(faq => 
      activeCategory === 'all' || faq.category === activeCategory
    )
    .filter(faq => 
      searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // 자주 문의하는 질문들
  const popularQuestions = [
    'OpenBadge는 무엇인가요?',
    '배지는 어떻게 획득하나요?',
    '발행자가 되려면 어떻게 해야 하나요?',
    '배지를 소셜 미디어에 공유할 수 있나요?'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen font-sans bg-gradient-to-br from-purple-50 to-white"
    >
      {/* 헤더 */}
     <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
               <div className="container mx-auto px-6 flex justify-between items-center">
                 <div className="flex items-center">
                   <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                     <Award className="text-white" />
                   </div>
                   <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">OpenBadge</span>
                 </div>
                 <nav className="hidden md:flex space-x-8">
                 <NavLink to="/"className={({ isActive }) => isActive ? 'text-purple-600 transition-colors' : 'text-gray-700 hover:text-purple-600 transition-colors'}>홈
                 </NavLink>
                 <NavLink to="/dashboard"className={({ isActive }) => isActive ? 'text-purple-600 transition-colors' : 'text-gray-700 hover:text-purple-600 transition-colors'}>마이프로필 
                 </NavLink>
                 <NavLink to="/dashboard"className={({ isActive }) => isActive ? 'text-purple-600 transition-colors' : 'text-gray-700 hover:text-purple-600 transition-colors'}>나의 뱃지지갑
                 </NavLink>
                 <NavLink to="/dashboard"className={({ isActive }) => isActive ? 'text-purple-600 transition-colors' : 'text-gray-700 hover:text-purple-600 transition-colors'}>커뮤니티</NavLink>
                 <NavLink to="/dashboard"className={({ isActive }) => isActive ? 'text-purple-600 transition-colors' : 'text-gray-700 hover:text-purple-600 transition-colors'}>AI추천강좌
                 </NavLink>
                 <NavLink to="/qna"className={({ isActive }) => isActive ? 'text-purple-600 transition-colors' : 'text-gray-700 hover:text-purple-600 transition-colors'}>도움말
                 </NavLink>
                 </nav>
     
                 <div className="flex items-center space-x-4">
                   <button onClick={() => navigate('/login')}
                     className="bg-transparent border border-purple-600 text-purple-600 px-4 py-2 rounded-md hover:bg-purple-50 transition-colors">로그인
                   </button>
                   <button onClick={() => navigate('/signup')}
                     className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">회원가입</button>
                 </div>
               </div>
             </header>

      {/* 메인 콘텐츠 */}
      <main className="pt-32 pb-20">
        {/* Q&A 배너 */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-800 py-16 px-6 mb-12">
          <div className="container mx-auto text-center text-white">
            <h1 className="text-4xl font-bold mb-4">자주 묻는 질문</h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
              OpenBadge에 대한 질문이 있으신가요? 가장 많이 묻는 질문들에 대한 답변을 확인해보세요.
            </p>
            
            {/* 검색 바 */}
            <div className="relative max-w-lg mx-auto">
              <input 
                type="text" 
                placeholder="질문 검색..." 
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-purple-100 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-3.5 text-purple-100" size={20} />
            </div>
          </div>
        </section>
        
        <div className="container mx-auto px-6">
          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-4 mb-10 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* 인기 질문 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
            <h2 className="text-xl font-bold mb-4">자주 찾는 질문</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {popularQuestions.map((question, index) => (
                <a 
                  key={index} 
                  href={`#question-${faqs.find(faq => faq.question === question)?.id || 1}`}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
                  onClick={(e) => {
                    e.preventDefault();
                    const faq = faqs.find(faq => faq.question === question);
                    if (faq) {
                      setExpandedQuestions(prev => ({ ...prev, [faq.id]: true }));
                      document.getElementById(`question-${faq.id}`)?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <MessageCircle size={18} className="text-purple-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 group-hover:text-purple-600 transition-colors">{question}</span>
                </a>
              ))}
            </div>
          </div>
          
          {/* FAQ 아코디언 */}
          <div className="space-y-4 mb-12">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(faq => (
                <div 
                  key={faq.id} 
                  id={`question-${faq.id}`}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
                    expandedQuestions[faq.id] ? 'ring-2 ring-purple-300' : 'hover:shadow-md'
                  }`}
                >
                  <button
                    className="w-full px-6 py-4 flex justify-between items-center text-left"
                    onClick={() => toggleQuestion(faq.id)}
                  >
                    <span className="font-medium text-lg">{faq.question}</span>
                    {expandedQuestions[faq.id] ? (
                      <ChevronUp className="text-purple-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedQuestions[faq.id] && (
                    <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-4">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">검색 결과가 없습니다</p>
                <button 
                  className="text-purple-600 hover:underline"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                >
                  모든 질문 보기
                </button>
              </div>
            )}
          </div>
          
          {/* 문의하기 */}
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">원하는 답변을 찾지 못하셨나요?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              문의하기 페이지에서 질문을 남겨주시면 OpenBadge 팀이 빠르게 답변해 드리겠습니다.
            </p>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center mx-auto">
              문의하기 <ArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </main>

      {/* 커뮤니티 참여 */}
      <section className="bg-purple-100 py-16 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">커뮤니티에 참여하세요</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            OpenBadge 커뮤니티에서 다른 사용자들과 경험을 공유하고 질문을 나누세요.
            최신 소식과 유용한 정보를 얻을 수 있습니다.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors flex items-center">
              <Users className="mr-2" /> 커뮤니티 방문하기
            </button>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Award className="text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">OpenBadge</span>
              </div>
              <p className="text-gray-400 mb-4">
                당신의 성장을 함께하는 디지털 배지 플랫폼
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">배지 탐색</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">카테고리별</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">인기 배지</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">새로운 배지</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">발행 기관별</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">정보</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">서비스 소개</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">발행자 되기</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">자주 묻는 질문</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">문의하기</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">정책</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">이용약관</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">개인정보처리방침</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">쿠키 정책</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} OpenBadge. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default QnAPage;
