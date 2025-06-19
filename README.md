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
    <img src="openbg/public/images/Mainpage_image" alt="[커뮤니티 기능]" width="700"/>
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

## 🎯 기술적 이슈 & 해결 과정

### 1. [이슈 1 제목]
* **문제 상황:** [문제에 대한 상세 설명]
* **고민:** [해결을 위해 고려했던 여러 가지 방안]
* **해결 방안:** [최종적으로 선택한 해결책과 그 이유]
* **배운 점:** [이슈 해결을 통해 얻은 교훈이나 지식]
* (관련 블로그나 문서 링크가 있다면 추가)

### 2. [이슈 2 제목]
* **문제 상황:** [문제에 대한 상세 설명]
* **고민:** [해결을 위해 고려했던 여러 가지 방안]
* **해결 방안:** [최종적으로 선택한 해결책과 그 이유]
* **배운 점:** [이슈 해결을 통해 얻은 교훈이나 지식]
* (관련 블로그나 문서 링크가 있다면 추가)
