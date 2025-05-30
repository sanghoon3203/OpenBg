import React, { useState, useEffect, useRef } from 'react'; // useRef 추가
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import BadgeCard from './BadgeCard';
import { setDoc, doc as firestoreDoc } from 'firebase/firestore';

const PortfolioContent = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletExists, setWalletExists] = useState(false);
  const [showAddBadgeForm, setShowAddBadgeForm] = useState(false);
  const [newBadgeUrl, setNewBadgeUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // 추가: 선택된 JSON 파일을 위한 상태
  const fileInputRef = useRef(null); // 추가: 파일 입력 참조
  const user = auth.currentUser;

  // 뱃지 데이터 불러오기
  const fetchBadges = async () => {
    if (!user) return;
    setLoading(true); // 데이터 가져오기 시작 시 로딩 상태 true
    const badgeRef = collection(db, 'users', user.uid, 'badges');
    const snapshot = await getDocs(badgeRef);

    if (snapshot.empty) {
      setWalletExists(false);
    } else {
      setWalletExists(true);
      const fetched = snapshot.docs.map(doc => ({ badgeId: doc.id, ...doc.data() }));
      setBadges(fetched);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) { // 사용자가 있을 때만 fetchBadges 호출
        fetchBadges();
    } else {
        setLoading(false); // 사용자가 없으면 로딩 종료
        setBadges([]); // 뱃지 목록 초기화
        setWalletExists(false); // 지갑 존재 여부 false
    }
  }, [user]); // user 객체가 변경될 때마다 실행

  // 지갑 생성 (더미 뱃지 넣기)
  const createWallet = async () => {
    if (!user) return;
  
    const dummyBadge = {
      badge_url: '',
      id: 'dummy-wallet', // 고유한 ID로 설정
      type: 'Assertion',
      name: '지갑이 생성되었습니다.',
      description: 'OpenBadge 시스템에 의해 지갑이 생성되었습니다.',
      issuer: 'OpenBadge 시스템',
      issuedOn: new Date().toISOString().split('T')[0],
      addedAt: new Date().toISOString(),
      image: '', // 이미지 URL 또는 Base64 데이터
      skills: [],
      alignment: [],
      recipient: {
        type: 'email',
        identity: user?.email || 'unknown@example.com',
        hashed: false
      },
      verification: {
        type: 'HostedBadge' // 또는 다른 검증 타입
      }
    };
  
    // Firestore 문서 참조 시 user.uid 와 dummyBadge.id 사용
    const badgeDocRef = firestoreDoc(db, 'users', user.uid, 'badges', dummyBadge.id);
    await setDoc(badgeDocRef, dummyBadge);
  
    fetchBadges(); // 지갑 생성 후 뱃지 목록 갱신
  };

  const handleDeleteBadge = async (badgeId) => {
    if (!user) {
        alert("로그인이 필요합니다.");
        return;
    }
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'badges', badgeId));
        setBadges(badges.filter(b => b.badgeId !== badgeId));
        alert("뱃지가 삭제되었습니다.");
      } catch (error) {
        console.error("뱃지 삭제 중 오류 발생: ", error);
        alert("뱃지 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleAddBadge = () => {
    setShowAddBadgeForm(true);
    setNewBadgeUrl(''); // URL 입력 필드 초기화
    setSelectedFile(null); // 파일 선택 상태 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // 파일 입력 DOM 자체를 초기화
    }
  };

  // 공통 로직으로 뱃지 데이터 처리 및 저장 함수
  const processAndStoreBadgeData = async (badgeJson, sourceDescription) => {
    if (!user) {
        alert("뱃지를 추가하려면 로그인이 필요합니다.");
        setLoading(false);
        return;
    }
    try {
      const badgeData = {
        badge_url: sourceDescription, // URL 또는 파일명
        id: badgeJson.id || sourceDescription, // JSON 내 ID 우선, 없으면 sourceDescription
        type: badgeJson.type || 'Assertion',
        name: badgeJson.badge?.name || '이름 없음',
        description: badgeJson.badge?.description || '',
        issuer: badgeJson.badge?.issuer?.name || '기관 미상',
        issuedOn: badgeJson.issuedOn?.split('T')[0] || '',
        image: badgeJson.image || badgeJson.badge?.image || '', // image 필드를 우선, 없으면 badge.image
        skills: badgeJson.badge?.skills || [],
        alignment: badgeJson.badge?.alignment || [],
        recipient: badgeJson.recipient || { type: 'email', identity: user.email, hashed: false },
        verification: badgeJson.verification || {},
        addedAt: new Date().toISOString(),
      };
  
      // id가 문자열이 아니거나 너무 길 경우, 또는 특수문자가 포함된 경우 Firestore 경로에 부적합할 수 있으므로 처리
      let docId = typeof badgeData.id === 'string' ? badgeData.id.replace(/[.#$[\]/]/g, '_') : `badge_${Date.now()}`;
      if (docId.length > 100) { // Firestore 문서 ID 길이 제한 고려 (예시)
        docId = docId.substring(0, 100);
      }
      if (!docId) { // ID가 비어있는 극단적인 경우
        docId = `badge_${Date.now()}_${Math.random().toString(36).substring(2,10)}`;
      }


      const badgeDocRef = firestoreDoc(db, 'users', user.uid, 'badges', docId);
      await setDoc(badgeDocRef, badgeData);  
  
      setBadges(prevBadges => [...prevBadges, { ...badgeData, badgeId: docId }]);
      setShowAddBadgeForm(false);
      // 상태 초기화는 각 핸들러에서 수행
    } catch (err) {
      console.error("뱃지 데이터 처리 및 저장 실패:", err);
      alert('뱃지 데이터 처리 중 오류가 발생했습니다. JSON 형식을 확인해주세요.');
    }
  };


  // URL로 뱃지 추가 제출 핸들러
  const handleAddBadgeSubmitWithUrl = async (e) => {
    e.preventDefault();
    if (!newBadgeUrl.trim()) {
      alert("뱃지 JSON URL을 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(newBadgeUrl);
      if (!res.ok) throw new Error(`URL 접근 실패: ${res.statusText}`);
      const badgeJson = await res.json();
      await processAndStoreBadgeData(badgeJson, newBadgeUrl);
      setNewBadgeUrl(''); // URL 입력 상태 초기화
    } catch (err) {
      console.error("URL로 뱃지 추가 실패:", err);
      alert(`뱃지를 불러오는 데 실패했습니다: ${err.message}. URL과 JSON 형식을 확인해주세요.`);
    } finally {
      setLoading(false);
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
      setNewBadgeUrl(''); // URL 입력이 있었다면 초기화
    } else if (file) {
      alert("JSON 파일만 업로드할 수 있습니다.");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } else {
        setSelectedFile(null);
    }
  };

  // 파일로 뱃지 추가 제출 핸들러
  const handleAddBadgeSubmitWithFile = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("뱃지 JSON 파일을 선택해주세요.");
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileContent = event.target.result;
        const badgeJson = JSON.parse(fileContent);
        await processAndStoreBadgeData(badgeJson, selectedFile.name);
        setSelectedFile(null); // 파일 선택 상태 초기화
        if (fileInputRef.current) {
            fileInputRef.current.value = null; // 파일 입력 DOM 자체를 초기화
        }
      } catch (err) {
        console.error("파일 파싱 또는 뱃지 추가 실패:", err);
        alert('파일을 파싱하거나 뱃지를 추가하는 데 실패했습니다. 파일 형식을 확인해주세요.');
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
        console.error("파일 읽기 오류");
        alert("파일을 읽는 중 오류가 발생했습니다.");
        setLoading(false);
    }
    reader.readAsText(selectedFile);
  };
  

  if (loading && badges.length === 0) { // 초기 로딩 시에만 전체 로딩 표시
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="ml-3 text-gray-600">뱃지 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!walletExists && !loading) { // 로딩이 끝났는데 지갑이 없는 경우
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">아직 배지 지갑이 없습니다.</h2>
        <p className="text-gray-500 mb-6">첫 뱃지를 추가하거나 지갑을 생성하여 시작하세요.</p>
        <button
          onClick={createWallet}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg shadow"
        >
          배지 지갑 생성하기 (예시 뱃지 포함)
        </button>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-transparent"
      style={{ fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      <div className="bg-gray-50 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">내 배지 포트폴리오</h2>
          <button 
            onClick={handleAddBadge}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm transition duration-300"
          >
            + 새 배지 추가
          </button>
        </div>

        {/* 뱃지 목록 또는 "뱃지 없음" 메시지 */}
        {loading && badges.length === 0 ? ( // 데이터를 가져오는 중이고, 아직 뱃지가 없을 때
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="ml-3 text-gray-600">뱃지를 불러오는 중...</p>
            </div>
        ) : !loading && badges.length === 0 && walletExists ? ( // 로딩 끝났고, 지갑은 있지만 뱃지가 없을 때 (더미 뱃지 삭제 후)
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <p className="text-lg text-gray-500 mb-2">아직 등록된 뱃지가 없습니다.</p>
                <p className="text-sm text-gray-400">위의 '+ 새 배지 추가' 버튼을 눌러 뱃지를 추가해보세요.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map(badge => (
                <BadgeCard
                    key={badge.badgeId || badge.id} // 고유 키 보장
                    title={badge.name}
                    issuer={badge.issuer}
                    date={badge.issuedOn}
                    skills={badge.skills}
                    imageUrl={badge.image} // 이미지 URL 전달
                    onDelete={() => handleDeleteBadge(badge.badgeId)}
                />
                ))}
                {/* 새 카드 추가 버튼은 항상 보이도록 처리할 수 있으나, 현재는 뱃지 목록이 있을 때만 함께 표시됨 */}
                {/* 필요하다면 이 부분을 조건부 렌더링 밖으로 옮기거나, 별도의 버튼으로 처리 */}
            </div>
        )}


      {/* 새 뱃지 추가 폼 (모달) */}
      {showAddBadgeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">새 뱃지 추가</h3>
              <button 
                onClick={() => {
                    setShowAddBadgeForm(false);
                    setNewBadgeUrl('');
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = null;
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* URL로 추가하는 폼 */}
            <form onSubmit={handleAddBadgeSubmitWithUrl} className="space-y-3 mb-6">
              <div>
                <label htmlFor="badgeUrl" className="block text-sm font-medium text-gray-700 mb-1">뱃지 JSON URL</label>
                <input
                  id="badgeUrl"
                  type="url"
                  value={newBadgeUrl}
                  onChange={(e) => { setNewBadgeUrl(e.target.value); setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = null; }}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://example.com/badge.json"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newBadgeUrl.trim() || loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading && newBadgeUrl.trim() ? '추가 중...' : 'URL로 추가'}
                </button>
              </div>
            </form>

            {/* 구분선 */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-sm text-gray-500">또는</span>
              </div>
            </div>

            {/* 파일로 추가하는 폼 */}
            <form onSubmit={handleAddBadgeSubmitWithFile} className="space-y-3">
              <div>
                <label htmlFor="badgeFile" className="block text-sm font-medium text-gray-700 mb-1">뱃지 JSON 파일 업로드</label>
                <input
                  id="badgeFile"
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  ref={fileInputRef} // ref 연결
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!selectedFile || loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading && selectedFile ? '업로드 중...' : '파일로 추가'}
                </button>
              </div>
            </form>

            {/* 취소 버튼 (공통) */}
            <div className="mt-6 text-center">
                <button
                    type="button"
                    onClick={() => {
                        setShowAddBadgeForm(false);
                        setNewBadgeUrl('');
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = null;
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800"
                >
                    취소
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default PortfolioContent;