<div align="center">

# ✨ [OPBG]

## [OPBG는 캡스톤 프로젝트에서 진행한 오픈뱃지를 이용한 학업추천 웹페이지 입니다.]

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/sanghoon3203/OpenBg/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/sanghoon3203/OpenBg?style=social)](https://github.com/sanghoon3203/OpenBg/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/sanghoon3203/OpenBg?style=social)](https://github.com/sanghoon3203/OpenBg/network/members)


**프로젝트 기간:** [25.04.01] ~ [25.06.16)]

</div>

---

## 🚀 프로젝트 소개

OpenBg는 **학습 경험과 역량 증명의 디지털 표준인 오픈배지의 잠재력을 최대한 발휘할 수 있도록 돕는 혁신적인 플랫폼**입니다. 기존 오픈배지의 낮은 인지도와 활용도로 인해 학습 성과가 충분히 인정받지 못하고, 사용자들이 적절한 학습 경로를 찾기 어려웠던 문제점을 해결하고자 시작되었습니다.

이 프로젝트는 **1EdTech 오픈배지 표준을 준수**하여 사용자가 자신의 디지털 배지를 웹 기반 개인 지갑에 안전하게 보관하고 관리할 수 있도록 지원합니다.

**OpenBg의 핵심 기능**은 **RAG(Retrieval Augmented Generation) 기반의 자체 개발 AI 추천 시스템**입니다. Pinecone과 연동된 벡터 데이터베이스를 통해 학습 데이터를 활용하고, 이를 Claude AI와 결합하여 사용자에게 최적화된 오픈배지 및 학습 경로를 추천합니다.

우리는 사용자에게 단순히 자격증명으로서의 오픈배지를 넘어선 **새로운 가치를 제공**합니다. OpenBg는 취득한 배지를 기반으로 사용자의 역량을 분석하고, 다음 단계의 성장을 위한 맞춤형 학습 경로를 제안합니다. 나아가 구인구직 게시판과의 연계를 통해 사용자가 자신의 역량을 효과적으로 어필하고, 실질적인 경력 개발로 이어질 수 있도록 지원하여, **디지털 배지가 단순한 증명을 넘어 개인의 지속적인 성장을 인도하는 촉매제**가 되도록 합니다.
<br/>

## 🌟 주요 기능

### 1. 디지털 배지 관리 및 증명
* 해당 기능은 기존의 사이트의 지갑 기능이며, firebase의 store기능을 이용하여 각 회원별 컬렉션 문서함에 저장합니다.
* 해당 지갑은 1EdTech 오픈배지 표준 준수하여 해당 json 형식이 아닐 경우에는 등록불가하도록 막고 있으며, 사용자들은 해당 기능을 json파일이나 json형식의 링크로 업로드하여 지갑에 등록가능합니다.
* **배지 포트폴리오:** 획득한 배지들을 한눈에 확인하고 관리할 수 있는 개인 포트폴리오를 제공합니다.
    * **뱃지 추가:** 뱃지 JSON URL 또는 JSON 파일을 통해 새로운 뱃지를 추가할 수 있습니다.
    * **뱃지 삭제:** 등록된 뱃지를 삭제할 수 있습니다.
* **개인 프로필:** 사용자 계정 정보를 기반으로 이름, 이메일, 직업, 소속, 학습 목표, 학력, 역량 수준, 관심 분야, 보유 스킬 등의 프로필 정보를 등록하고 수정할 수 있습니다.
    * **획득 뱃지 현황:** 사용자가 획득한 뱃지 목록을 보여줍니다.

<div align="center">
    <img src="openbg/public/images/Wallet_image" alt="[메인페이지]" width="700"/>
    <br/>
    <p><em>[개인별 지갑 모습]</em></p>
    <br/>
    <img src="openbg/public/images/Profile_image" alt="[개인별 프로필창]" width="700"/>
    <br/>
    <p><em>[개인별 프로필창 모습]</em></p>
</div>

### 2. AI 기반 맞춤형 학습 경로 추천
* **RAG(Retrieval Augmented Generation) 기반 AI 추천 시스템:** Pinecone과 연동된 벡터 데이터베이스의 학습 데이터를 Claude AI와 결합하여 사용자에게 최적화된 오픈배지 및 학습 경로를 추천합니다.
* **역량 분석 및 성장 제안:** 취득한 배지를 기반으로 사용자의 역량을 분석하고, 다음 단계 성장을 위한 맞춤형 학습 경로를 제안합니다.
* **추천 뱃지 표시:** 사용자에게 추천되는 뱃지 목록을 보여주며, 각 뱃지의 유사도 점수, 발행 기관, 설명 등의 상세 정보를 확인할 수 있습니다.

<div align="center">
    <img src="openbg/public/images/Recommendation_image" alt="[추천기능]" width="700"/>
    <br/>
    <p><em>[해당 아이디 내에 저장되어있는 뱃지 내용을 바탕으로 RAG기반으로 작성된 AI모델과 API통신을 통해서 추천 리스트를 보여줍니다.]</em></p>
</div>

### 3. 커뮤니티 활동 및 소통
* **게시판 기능:** 구인구직, 뱃지 인증, 챌린지, 뱃지 리뷰 등 다양한 카테고리의 게시판을 통해 다른 사용자들과 소통하고 정보를 공유할 수 있습니다.
    * **글 작성:** 사용자는 제목, 내용, 필수 뱃지, 카테고리를 선택하여 새로운 게시글을 작성할 수 있습니다.
    * **댓글 기능:** 각 게시글에 댓글을 작성하고 확인할 수 있습니다.
    * **게시글 삭제:** 작성자가 자신의 게시글을 삭제할 수 있습니다.
* **보유 뱃지 태그:** 게시글 작성 시 사용자의 보유 뱃지를 자동으로 태그하여 다른 사용자들에게 자신의 역량을 효과적으로 어필할 수 있습니다.
* **구인구직 연계:** 사용자가 자신의 역량을 효과적으로 어필하고, 실질적인 경력 개발로 이어질 수 있도록 구인구직 게시판과의 연계를 지원합니다.
<div align="center">
    <img src="openbg/public/images/Community_image" alt="[커뮤니티 기능]" width="700"/>
    <br/>
    <p><em>[해당 아이디 내에 저장되어있는 뱃지 내용을 바탕으로 RAG기반으로 작성된 AI모델과 API통신을 통해서 추천 리스트를 보여줍니다.]</em></p>
</div>

### 4. 사용자 인증 및 관리
* **회원가입:** 이메일과 비밀번호를 사용하여 계정을 생성할 수 있으며, 회원가입 시 직업, 소속, 학력, 학습 목표, 관심사, 스킬 등의 프로필 정보를 입력합니다.
* **로그인/로그아웃:** Firebase Auth를 통해 안전한 로그인 및 로그아웃 기능을 제공합니다.
* **사용자 UID 기반 데이터 관리:** 로그인한 사용자(UID)를 기반으로 개인 프로필, 뱃지 지갑, 커뮤니티 활동 등 모든 데이터를 Firestore에 저장하고 관리합니다.
<div align="center">
    <img src="openbg/public/images/mainpage_images" alt="[메인페이지]" width="700"/>
    <br/>
    <p><em>[해당 아이디 내에 저장되어있는 뱃지 내용을 바탕으로 RAG기반으로 작성된 AI모델과 API통신을 통해서 추천 리스트를 보여줍니다.]</em></p>
</div>
### 5. 정보 및 지원
* **자주 묻는 질문(Q&A):** OpenBadge에 대한 일반, 배지, 계정, 발행자, 기술 관련 자주 묻는 질문들을 제공합니다.
* **문의하기:** 사용자가 추가적인 질문이나 도움이 필요한 경우 문의할 수 있는 채널을 제공합니다.

<br/>

## 🛠️ 기술 스택

### Front-end
<p>
    <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white"/>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
    <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/>
    <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white"/>
    </p>

### Back-end & Database
<p>
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=white"/>
    <img src="https://img.shields.io/badge/Google%20Cloud%20Platform-4285F4?style=flat-square&logo=googlecloud&logoColor=white"/>
    </p>

### Infrastructure & Deployment
<p>
    <img src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=white"/>
    <img src="https://img.shields.io/badge/Azure-0078D4?style=flat-square&logo=microsoftazure&logoColor=white"/>
    <img src="https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white"/>
    </p>

### Tools
<p>
    <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white"/>
    <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"/>
    <img src="https://img.shields.io/badge/VSCode-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white"/>
    <img src="https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=figma&logoColor=white"/>
    </p>

<br/>


🎯 기술적 이슈 & 해결 과정
1. Robust Python-Literal String Parsing in API Responses
문제 상황: 백엔드 API에서 반환되는 문자열 데이터가 표준 JSON 형식이 아닌 Python 딕셔너리 또는 리스트의 리터럴 문자열 형태로 제공되는 경우가 있었습니다 (예: "{'key': 'value'}", "[item1, item2]", 또는 중첩된 문자열). JavaScript의 JSON.parse()는 이러한 형식을 직접 파싱할 수 없어 클라이언트에서 데이터 처리에 오류가 발생했습니다.
고민:
프론트엔드에서 문자열을 수동으로 치환하여 JSON.parse가 가능하도록 할 것인가? (복잡한 중첩 구조와 예외 처리가 어려움)
백엔드에서 JSON 표준을 준수하도록 수정할 것인가? (단기적인 해결이 어렵거나 외부 API 제약이 있을 수 있음)
강력한 파싱 로직을 프론트엔드에 구현할 것인가? (유연성과 안정성 확보)
해결 방안: src/services/apiResponseParser.js 파일에 robustParsePythonString 함수를 구현하여, Python 리터럴 문자열을 JSON 호환 문자열로 변환하고 재귀적으로 파싱을 시도하도록 했습니다.
True, False, None과 같은 Python 키워드를 true, false, null로 변환했습니다.
문자열 내부의 따옴표(")를 보호하면서 외부의 작은따옴표(')를 큰따옴표(")로 변환했습니다.
중첩된 문자열화된 리스트나 딕셔너리가 있을 경우, 재귀적으로 robustParsePythonString를 호출하여 내부 데이터도 파싱될 수 있도록 처리했습니다.
최상위 parseApiOutputString 함수에서 API 응답 문자열의 각 섹션(사용자 데이터, 구성된 쿼리, 검색 결과 등)을 식별하고, 해당 섹션의 데이터에 robustParsePythonString을 적용하여 안정적으로 데이터를 추출했습니다.
배운 점: 백엔드와 프론트엔드 간의 데이터 교환 시 발생할 수 있는 비표준 형식에 대한 유연한 대처 능력의 중요성을 깨달았습니다. 단순히 JSON.parse()에 의존하기보다, 예상치 못한 데이터 형식에 대응할 수 있는 로직 설계가 애플리케이션의 견고성을 높인다는 것을 배웠습니다.
2. OpenBadge 표준을 준수하는 동적 배지 포트폴리오 관리
문제 상황: 사용자가 다양한 경로(파일 업로드, URL 링크)를 통해 OpenBadge JSON 파일을 자신의 포트폴리오에 추가할 수 있어야 했습니다. 이 과정에서 OpenBadge 표준 JSON 형식을 검증하고, 파싱된 데이터를 Firebase Firestore에 일관된 구조로 저장하며, 중복되거나 유효하지 않은 데이터로 인한 오류를 방지해야 했습니다.
고민:
클라이언트 측에서 JSON 데이터의 유효성을 어떻게 검증할 것인가? (스키마 유효성 검사 라이브러리 사용 여부)
URL을 통해 뱃지 데이터를 가져올 때 CORS 문제나 네트워크 오류는 어떻게 처리할 것인가?
뱃지 데이터 내의 고유 ID가 없거나 유효하지 않을 경우, Firestore 문서 ID를 어떻게 결정할 것인가?
이미지 URL이 없을 경우의 폴백 처리 및 UI 일관성 유지 방안.
해결 방안: src/components/PortfolioContent.jsx 파일에 뱃지 추가 및 관리 로직을 구현했습니다.
handleAddBadgeSubmitWithUrl 및 handleAddBadgeSubmitWithFile 함수를 통해 URL Fetch 또는 File Reader를 사용하여 외부 뱃지 JSON 데이터를 가져왔습니다.
processAndStoreBadgeData 함수를 중앙화하여 가져온 JSON 데이터를 일관된 내부 형식으로 매핑하고, 필요한 기본값을 할당했습니다 (예: name, issuer, issuedOn, image, skills 등).
Firestore 문서 ID는 뱃지 JSON 내의 id 필드를 우선적으로 사용하되, 유효하지 않거나 없을 경우 타임스탬프 기반의 고유 ID를 생성하여 데이터 충돌 및 Firestore 경로 제한 문제를 해결했습니다. 또한, Firestore 문서 ID로 부적합한 문자(. # $ [ ] /)를 _로 치환하는 로직을 추가했습니다.
BadgeCard.jsx 컴포넌트에서 imageUrl이 없을 경우 기본 아이콘과 배경색을 표시하도록 폴백 UI를 구현하여 시각적 일관성을 유지했습니다.
배운 점: 외부 데이터(특히 표준을 따르지만 다양한 형태를 가질 수 있는)를 통합할 때, 견고한 데이터 파싱 및 정규화 로직이 필수적임을 깨달았습니다. 데이터 유효성 검사와 에러 핸들링은 사용자 경험과 시스템 안정성에 직접적인 영향을 미치며, 데이터베이스 저장 시 ID 전략 수립의 중요성을 배웠습니다.
3. 사용자 컨텍스트 기반의 동적 커뮤니티 보드 추천 및 상호작용
문제 상황: 커뮤니티 게시판에서 사용자의 활동을 장려하고, 특히 개개인에게 더욱 관련성 높은 게시판 카테고리를 추천함으로써 커뮤니티 참여도를 높이고 싶었습니다. 또한, 사용자 생성 콘텐츠(게시글, 댓글)를 효율적으로 관리하고, 삭제 기능을 제공하며, 사용자의 보유 뱃지를 게시글에 시각적으로 연동하는 것이 필요했습니다.
고민:
어떤 기준으로 게시판을 추천할 것인가? (사용자의 보유 뱃지 정보 활용 방안)
게시글과 댓글을 실시간에 가깝게 업데이트하려면 어떤 Firestore 쿼리 전략을 사용할 것인가?
사용자 생성 콘텐츠의 삭제 권한은 어떻게 부여할 것인가?
게시글 목록에서 사용자 뱃지를 어떻게 효과적으로 보여줄 것인가?
해결 방안: src/components/CommunityContent.jsx 파일에서 이러한 기능들을 구현했습니다.
동적 게시판 추천: 사용자의 보유 뱃지(myBadges)를 불러와, 특정 스킬셋(예: 'react', 'python')이나 뱃지 개수(예: 5개 이상)에 따라 '구인구직', '챌린지', '뱃지 인증', '뱃지 리뷰'와 같은 관련 커뮤니티 게시판을 동적으로 recommendedBoards로 제안하도록 로직을 구현했습니다. 이를 통해 사용자가 관심 가질 만한 주제를 쉽게 찾을 수 있도록 했습니다.
게시글 및 댓글 관리:
게시글(community_posts)과 댓글(comments 서브컬렉션)은 Firebase Firestore에 저장됩니다. 게시글은 orderBy('createdAt', 'desc')로 최신순 정렬하여 불러옵니다.
PostCard 컴포넌트 내에서 CommentList와 CommentForm을 포함시켜, 게시글 상세 보기 시 댓글을 바로 확인하고 작성할 수 있도록 했습니다.
게시글 삭제는 onDeletePost 함수를 통해 구현되었으며, 게시글 작성자만 삭제 버튼을 볼 수 있도록 isAuthor 로직을 추가하여 권한 관리를 했습니다.
사용자 뱃지 시각화: PostCard에서 게시글 작성자의 상위 뱃지(userTopBadges)를 UserBadges 컴포넌트로 전달하여 게시글 목록에서 사용자의 주요 역량을 간결하게 표시하도록 했습니다.
배운 점: 사용자 데이터를 기반으로 한 개인화된 추천 기능이 서비스의 참여율을 크게 높일 수 있음을 확인했습니다. 또한, Firestore의 컬렉션 및 서브컬렉션 구조를 활용한 데이터 모델링이 복잡한 사용자 상호작용을 효율적으로 관리하는 데 중요하다는 것을 배웠습니다. 클라이언트 측에서 권한을 시각적으로만 제어하는 것이 아닌, 백엔드/보안 규칙을 통한 실제 권한 부여의 중요성도 재확인했습니다.
&lt;br/>

