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

4. 회원가입 시 사용자 데이터 형식 변환 및 통합
문제 상황: 기존 시스템에서 관리되던 사용자 데이터 형식과 RAG 기반 AI 추천 시스템이 요구하는 사용자 데이터 형식이 달랐습니다. 특히, 회원가입 시 입력받는 사용자 프로필 정보(직업, 소속, 학습 목표, 스킬, 관심사 등)를 Firebase Firestore에 저장하면서, 향후 AI 추천 시스템이 쉽게 활용할 수 있도록 특정 구조와 필드명을 준수해야 했습니다. 또한, 사용자 경험을 위해 복잡한 회원가입 과정을 여러 단계로 나누어 진행할 필요가 있었습니다.
고민:
회원가입 폼에서 입력받는 다양한 프로필 데이터를 AI 시스템이 소비하기 적합한 단일하고 일관된 Firestore 문서 구조로 어떻게 매핑할 것인가?
특히 스킬(skills)이나 관심 분야(interests)와 같은 다중 선택 필드를 Firestore에 어떤 형식(예: 배열)으로 저장할 것인가?
Firebase Authentication으로 생성된 사용자 정보(UID, 이메일)와 Firestore에 저장될 추가 프로필 데이터를 어떻게 연결하고 관리할 것인가?
다단계 폼에서 사용자 입력 데이터를 효율적으로 관리하고, 이전/다음 단계 이동 시 데이터 유실을 방지하려면 어떻게 해야 하는가?
해결 방안: src/components/RegisterPage.jsx 파일에서 사용자 등록 및 데이터 통합 로직을 구현했습니다.
통합된 form 상태 객체: 회원가입 폼의 모든 입력 필드(기본 계정 정보, 프로필 정보, 스킬 및 관심사)를 단일 form 상태 객체로 통합하여 관리했습니다. 이를 통해 다단계 폼에서 단계 간 이동 시에도 데이터 유실 없이 사용자 입력 정보를 효율적으로 유지했습니다.
Firestore 데이터 구조 최적화: handleRegister 함수 내에서 Firebase Authentication으로 생성된 user.uid를 Firestore 문서 ID로 사용하고, userDataToStore 객체를 구성하여 AI 추천 시스템이 요구하는 필드명(user_id, name, email, job, affiliation, goal, education_level, interests, skills, competency_level, acquired_badges, learning_history, employment_history, engagement_metrics, recommendation_history)으로 데이터를 저장했습니다. 특히 interests와 skills는 배열 형태로 저장하여 다중 선택이 가능하도록 했습니다.
고유 사용자 코드 생성 (generateUniqueUserCode 함수): Firestore users 컬렉션에서 가장 최근에 생성된 user_id를 기반으로 U와 순차 번호를 조합한 고유한 사용자 코드를 생성하여 user_id 필드에 저장했습니다. 이는 RAG 기반 AI가 사용자를 식별하고 컨텍스트를 이해하는 데 활용될 수 있습니다.
다단계 폼 UI/UX: currentStep 상태와 renderStep 함수들을 사용하여 직관적인 다단계 회원가입 플로우를 제공하고, framer-motion을 활용하여 단계 전환 시 부드러운 애니메이션 효과를 적용하여 사용자 경험을 향상시켰습니다.
배운 점: 서비스 초기 단계부터 백엔드(AI 추천 시스템)의 데이터 요구사항을 프론트엔드의 데이터 수집 과정에 반영하여 데이터 일관성과 활용성을 높이는 것이 중요함을 깨달았습니다. 복잡한 사용자 입력 폼을 체계적으로 관리하고, 고유 ID 생성과 같은 데이터베이스 연동 로직을 프론트엔드에서 구현하는 경험을 통해 프론트엔드 개발의 범위를 확장할 수 있었습니다.
