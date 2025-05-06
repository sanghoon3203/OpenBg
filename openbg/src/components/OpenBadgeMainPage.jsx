import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Book, Gift, Users, Globe, Search } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import BadgeSlider from './BadgeSlider';

const OpenBadgeMainPage = ({ idToken, setIdToken, user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  // 스크롤 상태 확인
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('idToken');
      setIdToken(null);
      navigate('/');
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };


  const categories = [
    { id: 'all', name: '전체' },
    { id: 'tech', name: '기술' },
    { id: 'design', name: '디자인' },
    { id: 'language', name: '언어' },
    { id: 'business', name: '비즈니스' },
    { id: 'hobby', name: '취미' }
  ];

  const badges = [
    {
      id: 1,
      title: '웹 개발 기초',
      category: 'tech',
      image: 'src/assets/web.svg',
      issuer: '테크 아카데미',
      difficulty: '초급',
      students: 1204
    },
    {
      id: 2,
      title: 'UI/UX 디자인 마스터',
      category: 'design',
      image: 'src/assets/ui.svg',
      issuer: '디자인 스쿨',
      difficulty: '중급',
      students: 867
    },
    {
      id: 3,
      title: '비즈니스 영어',
      category: 'language',
      image: 'src/assets/eng.svg',
      issuer: '글로벌 에듀',
      difficulty: '중급',
      students: 2431
    },
    {
      id: 4,
      title: '프로젝트 관리',
      category: 'business',
      image: 'src/assets/product.svg',
      issuer: '비즈니스 허브',
      difficulty: '고급',
      students: 1056
    },
  ];

  const filteredBadges = activeCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === activeCategory);

  const features = [
    {
      icon: <Award size={48} className="text-blue-500" />,
      title: '공인된 자격증',
      description: '업계 전문가가 인증한 공식 자격증을 획득하세요.'
    },
    {
      icon: <Book size={48} className="text-green-500" />,
      title: '맞춤형 학습',
      description: '개인 맞춤형 학습 경로로 효율적인 성장을 경험하세요.'
    },
    {
      icon: <Gift size={48} className="text-purple-500" />,
      title: '특별 혜택',
      description: '배지 보유자를 위한 특별 혜택과 기회를 제공합니다.'
    },
    {
      icon: <Users size={48} className="text-orange-500" />,
      title: '커뮤니티',
      description: '전 세계 학습자들과 연결하고 지식을 공유하세요.'
    }
  ];

  return (
    <motion.div
      key="main-page"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-white"
    >
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <NavLink to="/" className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <Award className="text-white" />
            </div>
            <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              OpenBadge
            </span>
          </NavLink>

          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" className={({ isActive }) => isActive ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}>홈</NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}>마이프로필</NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}>나의 뱃지지갑</NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}>커뮤니티</NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}>AI추천강좌</NavLink>
            <NavLink to="/qna" className={({ isActive }) => isActive ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}>도움말</NavLink>
          </nav>

          <div className="flex items-center space-x-4">
            {idToken ? (
              <>
                  <span className="text-purple-600 font-semibold">
                    {user?.displayName || user?.email}님 안녕하세요!
                  </span>           
                  <button
                  onClick={handleLogout}
                  className="border border-purple-600 text-purple-600 px-4 py-2 rounded-md hover:bg-purple-50 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="border border-purple-600 text-purple-600 px-4 py-2 rounded-md hover:bg-purple-50 transition-colors"
                >
                  로그인
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>
      </header> 


        {/* 히어로 섹션 */}
        <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center">
          <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                당신의 <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">성장</span>을 증명하는<p>디지털 배지</p> 
              </h1>
              <p className="text-xl text-gray-600">
                OpenBadge에서 발급받은 뱃지를 추가하고, 커리어를 성장시켜보세요! <p>믿을 수 있는 기관에서 발행하는 디지털 배지로 당신의 실력을 증명하세요.</p>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                  배지 찾아보기 <ArrowRight className="ml-2" />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl shadow-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-6 p-6 transform rotate-12">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-40 h-40 bg-white rounded-xl shadow-lg flex items-center justify-center p-4 transform hover:scale-105 transition-transform">
                        <Award size={64} className="text-purple-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full opacity-70 purple-xl"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-400 rounded-full opacity-70 purple-xl"></div>
            </div>
          </div>
        </section>

        {/* 주요 기능 */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">OpenBadge의 특별함</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

       <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">🔥 인기 뱃지 둘러보기</h2>
          <BadgeSlider badges={badges} />
        </div>
      </section>

        {/* 배지 탐색 */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
              <h2 className="text-3xl font-bold mb-6 md:mb-0">우리의 뱃지 리스트</h2>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="배지 검색..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-10">
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

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBadges.map(badge => (
                <div key={badge.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                  <div className="relative overflow-hidden">
                    <img 
                      src={badge.image} 
                      alt={badge.title} 
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-4">
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        자세히 보기
                      </button>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                      {badge.difficulty}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors">{badge.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">발행: {badge.issuer}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users size={16} className="mr-1" />
                      <span>{badge.students.toLocaleString()}명 수강</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <button className="bg-transparent border border-purple-600 text-purple-600 px-6 py-3 rounded-md hover:bg-purple-50 transition-colors inline-flex items-center">
                모든 배지 보기 <ArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </section>

        {/* 도움이 필요하세요? */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">도움이 필요하세요?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-purple-100">
              OpenBadge 팀이 도와드리겠습니다. 언제든지 문의하세요.
            </p>
            <button className="bg-white text-purple-600 px-6 py-3 rounded-md hover:bg-blue-50 transition-colors">
              문의하기
            </button>
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
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Globe size={20} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Users size={20} />
                  </a>
                </div>
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



  export default OpenBadgeMainPage;