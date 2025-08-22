# 📁 KOOUK Project - Claude Working Manual
**Easy Easy Super Easy, Notion을 대신하는 개인 Storage**

## 📋 **ESSENTIAL DOCUMENTATION**

### 📊 **Complete User Flow & System Connections**
- 🔐 Authentication flow (login/logout with all connection pages) 
- 🧭 Navigation & tab functions (Dashboard, My Folder, Marketplace, Bookmarks)
- 📁 Content management flows and data conversions
- 🔄 Folder sharing system (My Folder ↔ Marketplace)
- 📊 Content card type conversions and database schema connections
- 🛠️ Available tools in `_backup` folder (check here first!)

### 🎯 **Tech Stack & Environment**
- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: Supabase Database + Google OAuth Login system
- **Screen Size**: 1700px Max (PC 버전 우선 구현)
- **Database**: Supabase PostgreSQL
- **Authentication**: Google OAuth via Supabase

---

## 🎯 **KOOUK Project Goals & User Flow**

### 📁 **4개 핵심 탭 기능 & 디자인 컨셉**

#### 1. **🏠 Dashboard** - 개인 허브의 중심
💡 **디자인 컨셉**: "나만의 디지털 서재"
- **레이아웃**: 격자형 카드 대시보드 (3×2 또는 2×3)
- **핵심 카드들**:
  - **📊 내 통계 카드**: 폴더 수, 아이템 수, 최근 활동 (숫자 강조)
  - **⚡ 빠른 액션**: "새 폴더 만들기", "링크 저장하기", "메모 작성" (큰 버튼)
  - **📈 활동 요약**: 주간/월간 추가한 콘텐츠, 방문 빈도 (차트형)
  - **🔖 최근 북마크**: 최근 저장한 링크 3개 (썸네일 + 제목)
  - **📁 인기 폴더**: 가장 많이 사용하는 폴더 TOP 3 (아이콘 + 이름)

#### 2. **📁 My Folder** - 개인 정보 관리의 중심
💡 **디자인 컨셉**: "디지털 서랍장과 작업대"

**UI 참고 스크린샷 분석**:
- 좌측 사이드바: 폴더 트리 구조 (KOOUK 로고, Personal Hub, 네비게이션 탭들)
- 중앙 영역: 그리드 형태의 폴더/콘텐츠 카드 레이아웃
- 우하단: 편집 버튼 (연필 아이콘)
- 하단: 콘텐츠 추가 영역 ("Add links, notes, documents, or anything...")

**레이아웃**: 좌측 폴더 트리 + 우측 콘텐츠 영역 (Desktop) / 전환형 (Mobile)
**시각적 테마**: 깔끔한 화이트와 소프트 그레이 조합

##### 🌳 폴더 트리 영역 (좌측)
- **폴더 아이콘**: 📁 (닫힌 상태) → 📂 (열린 상태), 계층별 들여쓰기
- **인터랙션**: 
  - 폴더명 호버시 배경 연한 회색 (#F8F9FA)
  - 선택된 폴더는 파란색 배경 (#EBF8FF) + 좌측 파란 선
  - 우클릭으로 "이름 변경", "삭제", "공유" 메뉴
- **드래그 앤 드롭**: 드래그시 반투명 + 드롭 존 하이라이트

##### 📄 콘텐츠 영역 (우측)
- **뷰 모드**:
  - **그리드 뷰**: 2×2 또는 3×3 카드 형태 (기본)
  - **리스트 뷰**: 한 줄씩 나열 (제목 + 설명 + 메타정보)
- **콘텐츠 카드**:
  - **링크**: 파비콘 + 썸네일 + 제목 + 도메인명
  - **메모**: 📝 아이콘 + 첫 줄 미리보기 + 작성일
  - **이미지**: 썸네일 + 파일명 + 크기
  - **문서**: 📄 아이콘 + 파일명 + 확장자 표시

#### 3. **🛍️ Marketplace** - 집단 지성의 보물창고
💡 **디자인 컨셉**: "세련된 디지털 갤러리"
- **레이아웃**: 필터 바 + 무한 스크롤 그리드
- **시각적 테마**: 모던하고 트렌디한 느낌, 콘텐츠가 주인공

##### 🔍 상단 필터 영역
- **카테고리 태그**: 버블 형태의 선택 가능한 태그들
  - 선택됨: 검은 배경 + 흰 텍스트
  - 미선택: 흰 배경 + 회색 텍스트 + 회색 테두리
- **정렬 드롭다운**: "인기순 ⬇️", "최신순 ⬇️", "도움순 ⬇️"
- **검색바**: 우측 상단, 돋보기 아이콘 + placeholder

##### 📱 콘텐츠 그리드
- **카드 크기**: 정사각형 또는 3:4 비율
- **카드 구성**:
  - **상단**: 콘텐츠 썸네일 또는 대표 이미지
  - **중간**: 폴더명 (굵게) + 간단한 설명
  - **하단**: 작성자명 + 다운로드 수 + ❤️ 좋아요 수
- **호버 효과**: 카드 살짝 확대 + 그림자 진해짐

##### 🎯 소셜 기능
- **좋아요 버튼**: ❤️ 아이콘, 클릭시 빨간색으로 변화
- **다운로드 버튼**: ⬇️ 아이콘, 클릭시 "복사됨!" 토스트
- **제작자 프로필**: 아바타 + 이름, 클릭시 해당 유저의 다른 폴더들

#### 4. **🔖 Bookmarks** - 웹에서 발견한 보물들
💡 **디자인 컨셉**: "개인 북마크 컬렉션 박물관"
- **레이아웃**: 상단 카테고리 탭 + 하단 북마크 그리드
- **시각적 테마**: 아늑하고 정돈된 라이브러리 느낌

##### 📑 카테고리 탭 영역
- **탭 디자인**: 
  - 선택된 탭: 검은 배경 + 흰 텍스트 + 하단 검은 선
  - 미선택 탭: 투명 배경 + 회색 텍스트
- **카테고리**: All, Tech, Design, News, Entertainment, Education, etc.
- **자동 분류**: AI가 자동으로 카테고리 추천 (사용자가 확정)

##### 🌐 북마크 카드
- **카드 레이아웃**:
  - **썸네일**: 웹사이트 스크린샷 또는 대표 이미지
  - **파비콘**: 좌상단 작은 사이트 아이콘
  - **제목**: 굵은 글씨, 2줄 제한
  - **설명**: 연한 글씨, 1-2줄 미리보기
  - **URL**: 도메인명만 표시 (작은 글씨)
  - **저장일**: 우하단 작은 날짜

##### ⭐ 즐겨찾기 시스템
- **별 아이콘**: ⭐ 클릭으로 즐겨찾기 토글
- **즐겨찾기 필터**: 상단에 "⭐ 즐겨찾기만" 토글 버튼
- **최근 추가**: "📅 최근 추가된 북마크" 별도 섹션

---

## 🎨 **UX/UI 컨셉 (참고 이미지 기반)**

### 📱 **Welcome Page 디자인**
**참고**: 두 번째 스크린샷의 랜딩 페이지 컨셉
- **중앙 정렬 레이아웃**: KOOUK 로고 + Welcome 메시지
- **설명 텍스트**: "Your personal digital life manager. Organize folders, save bookmarks, and discover amazing content shared by our community."
- **CTA 버튼**: "Sign in to get started" (어두운 배경 + 흰 텍스트)
- **기능 소개 카드**: 3개 섹션 (My Folder, Bookmarks, Marketplace)
- **하단 특징**: "Simple. Fast. Intuitive." + 무료 사용, 다운로드 없음, 어디서나 작업 가능

### 🎨 **메인 UI 컴포넌트**
**참고**: 첫 번째 스크린샷의 My Folder 화면
- **사이드바**: 어두운 배경 (#1F2937) + 흰 텍스트
- **메인 영역**: 밝은 배경 (#FFFFFF) 
- **카드 디자인**: 둥근 모서리 + 연한 그림자
- **폴더 아이콘**: 노란색 폴더 (#FCD34D)
- **네비게이션**: 탭 형태 (My Folder, Bookmarks, Market Place)

---

## 🛠️ **개발 가이드라인**

### 📦 **필수 명령어**
```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 테스트
npm run test

# 린트 검사
npm run lint

# 타입 체크
npm run typecheck
```

### 📂 **프로젝트 구조**
```
KOOUK_newstart/
├── CLAUDE.md              # 이 파일
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # 재사용 가능한 컴포넌트
│   ├── lib/              # 유틸리티 및 설정
│   ├── types/            # TypeScript 타입 정의
│   └── styles/           # 스타일 파일
├── public/               # 정적 파일
└── package.json          # 의존성 관리
```

---

## 🔄 **개발 우선순위**

1. **🏗️ 기본 셋업** (Next.js + TypeScript + Tailwind)
2. **🔐 인증 시스템** (Supabase + Google OAuth)
3. **📁 My Folder 기능** (폴더 CRUD + 콘텐츠 관리)
4. **🔖 Bookmarks 기능** (북마크 저장 + 카테고리)
5. **🛍️ Marketplace 기능** (공유 + 소셜 기능)
6. **🏠 Dashboard** (통계 + 빠른 액션)

---

## 📝 **참고사항**
- PC 버전 완성 이후 Mobile 버전 제작 예정
- 스크린 사이즈 1700px Max로 제작
- 기존 PJT가 복잡해져서 새롭게 시작하는 프로젝트
- UI/UX는 제공된 스크린샷을 참고하여 구현