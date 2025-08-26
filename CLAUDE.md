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
- **콘텐츠 카드 (향상된 프리뷰 시스템)**:
  - **링크**: 실제 웹사이트 메타데이터 + 썸네일 + 실제 제목 + 도메인명
  - **YouTube**: 실제 영상 썸네일 + 재생 버튼 + 채널명 + 재생시간
  - **메모/문서**: 📝 아이콘 + 실제 내용 미리보기 (처음 2-3줄)
  - **이미지**: 실제 이미지 썸네일 + 파일명
  - **플랫폼별 특화**: GitHub(회색), Naver(녹색), YouTube(빨강) 등 브랜드 색상

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

## 🎨 **향상된 콘텐츠 프리뷰 시스템** ⭐ NEW

### 📋 **시스템 개요**
KOOUK의 **ContentCard**가 카카오톡과 같은 풍부한 링크 프리뷰를 제공하는 완전히 새로운 시스템입니다. 기존의 보수적인 이모지 아이콘에서 벗어나 **실제 웹사이트 데이터**를 활용한 유저 친화적 프리뷰를 구현했습니다.

### 🔥 **핵심 기능**

#### **1. 🌐 실시간 웹 메타데이터 스크래핑**
```typescript
// API: /api/metadata
- Cheerio 기반 HTML 파싱
- og:title, og:description, og:image 추출
- 네이버 블로그/카페, 티스토리 특화 처리
- 자동 이미지 URL 정규화
```

#### **2. 📹 YouTube 완전 지원**
```typescript
// API: /api/youtube  
- YouTube Data API v3 연동 (선택적)
- 실제 영상 제목, 썸네일, 채널명, 재생시간
- 재생 버튼 오버레이 + 빨간색 YouTube 테마
- API 키 없어도 폴백 데이터 제공
```

#### **3. 🎯 5단계 스마트 프리뷰 전략**
```
1순위: 실제 썸네일 (호버 시 확대 효과)
2순위: YouTube 플랫폼 UI (▶️ + 빨간 배경)  
3순위: 도메인 브랜드 색상 (GitHub 회색, Naver 녹색)
4순위: 문서 내용 미리보기 (처음 2-3줄 텍스트)
5순위: 기본 타입 아이콘 (기존 이모지)
```

#### **4. 🎨 플랫폼별 브랜드 테마**
```typescript
const platformColors = {
  'youtube': 'bg-red-50 border-red-200',     // YouTube 빨강
  'github': 'bg-gray-50 border-gray-200',    // GitHub 회색
  'naver': 'bg-green-50 border-green-200',   // Naver 녹색
  'tistory': 'bg-orange-50 border-orange-200' // Tistory 주황
}
```

### 📊 **메타데이터 구조**
```typescript
interface EnhancedMetadata {
  title: string           // 실제 웹페이지/영상 제목
  description: string     // 설명
  image: string          // 썸네일 이미지
  domain: string         // 도메인명
  platform: string       // youtube|web|naver|tistory|github
  favicon: string        // 파비콘 URL
  
  // YouTube 전용
  videoId?: string       // 영상 ID  
  duration?: string      // "15:32" 형태
  channelTitle?: string  // 채널명
  
  // 문서 전용
  contentPreview?: string // 처음 300자 미리보기
}
```

### 🔧 **구현 컴포넌트**

#### **Core Files**
- `src/app/api/metadata/route.ts` - 웹 스크래핑 API
- `src/app/api/youtube/route.ts` - YouTube 데이터 API
- `src/utils/enhancedMetadata.ts` - 메타데이터 유틸리티
- `src/components/ui/ContentCard.tsx` - 향상된 카드 컴포넌트

#### **Database Schema**
```sql
-- metadata 컬럼 (JSON)에 저장되는 구조
{
  "title": "React 공식 문서",
  "description": "React 라이브러리 공식 문서",
  "image": "https://react.dev/image.png", 
  "domain": "react.dev",
  "platform": "web",
  "favicon": "https://react.dev/favicon.ico"
}
```

### 🎯 **사용자 경험 개선사항**

#### **Before (기존)**
- 단순 이모지 아이콘 (🔗, 📝, 📄)
- 도메인명만 표시
- 썸네일 없음

#### **After (새로운 시스템)**
- ✅ **YouTube**: "코딩애플 - React 완전정복" + 실제 썸네일 + "2:15:30"
- ✅ **웹사이트**: "React 공식 문서" + 실제 이미지 + react.dev
- ✅ **GitHub**: 회색 브랜드 테마 + 🐙 아이콘
- ✅ **문서**: 실제 내용 미리보기 (처음 2-3줄)

### ⚡ **성능 최적화**

#### **에러 처리**
- 이미지 로드 실패 시 자동 폴백
- API 호출 실패 시 기본 UI 유지
- 15초 타임아웃으로 사용자 대기시간 최소화

#### **캐싱 전략**
- 메타데이터는 database에 영구 저장
- 이미지는 브라우저 캐싱 활용
- 중복 API 호출 방지

### 🚨 **주의사항**

#### **개발자 가이드**
1. **새로운 플랫폼 추가시**: `src/utils/enhancedMetadata.ts`의 `getDomainInfo()` 함수에 도메인 정보 추가
2. **메타데이터 필드 추가시**: `EnhancedMetadata` 인터페이스 먼저 수정
3. **ContentCard 수정시**: 5단계 프리뷰 전략 순서 유지
4. **API 수정시**: 폴백 데이터 반드시 제공

#### **데이터베이스**
- 기존 `metadata` JSON 컬럼 활용 (호환성 유지)
- 새로운 테이블 생성 불필요
- 선택적으로 `enhanced_metadata_schema.sql` 실행 가능

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

## 🔄 **클로드 작업 원칙 (필수 준수)**

### **기본 작업 모드: 수정 모드**
- ⚠️ **항상 기존 파일을 Edit으로 수정** (신규 생성 최소화)
- ⚠️ **절대 주석처리 + 추가 방식 금지** 
- ⚠️ **코드는 항상 clean하고 알아보기 쉽게 유지**

### **통합 백업 시스템**
```
_backup/
├── components_backup.tsx    # 일반 컴포넌트 백업
├── modals_backup.tsx       # 모든 모달 백업  
├── ui_backup.tsx          # Button, Input 등 UI 백업
└── pages_backup.tsx       # 페이지 레벨 컴포넌트 백업
```

### **백업 프로세스**
1. **컴포넌트 대폭 수정 전에만** 해당 백업 파일에 현재 코드 추가
2. 컴포넌트명_v숫자 형태로 버전 관리
3. 기존 파일을 Edit으로 깔끔하게 수정

### **작업 예시**
```bash
# 사용자: "BookmarkCard 완전히 바꿔줘"
# 클로드:
1. Edit _backup/components_backup.tsx (현재 버전 백업)
2. Edit src/components/BookmarkCard.tsx (새 버전으로 깔끔하게 수정)
```

---

## 📝 **참고사항**
- PC 버전 완성 이후 Mobile 버전 제작 예정
- 스크린 사이즈 1700px Max로 제작
- 기존 PJT가 복잡해져서 새롭게 시작하는 프로젝트
- UI/UX는 제공된 스크린샷을 참고하여 구현

---

## 🔄 **핵심: My Folder ↔ Marketplace 공유 시스템**

### 📋 **시스템 개요**
KOOUK의 핵심 기능인 **스냅샷 기반 폴더 공유 시스템**입니다. 사용자가 My Folder에서 Marketplace로 폴더를 공유할 때, **현재 시점의 스냅샷을 복사**하여 완전히 분리된 공유본을 생성합니다.

### 🎯 **핵심 컨셉**
- **📸 스냅샷 공유**: 공유 시점의 폴더 상태를 복사
- **🔄 원본과 분리**: 원본 수정해도 공유본에 영향 없음
- **📈 버전 관리**: v1, v2, v3... 형태로 업데이트 지원
- **🧹 자동 정리**: 최근 3개 버전만 유지, 90일 후 자동 삭제

### 📊 **데이터 구조**

#### **My Folder (원본)**
```typescript
interface Folder {
  id: string
  name: string
  user_id: string
  items: ContentItem[]
  
  // 공유 관련 필드
  shared_version_id?: string     // 현재 공유 중인 버전 ID
  last_shared_at?: string        // 마지막 공유 시간
  shared_status: 'private' | 'shared-synced' | 'shared-outdated'
  total_downloads?: number       // 누적 다운로드 수
}
```

#### **Marketplace (공유본)**
```typescript
interface MarketplaceFolder {
  id: string
  original_folder_id: string     // 원본 폴더 참조
  
  // 스냅샷 데이터 (공유 시점에 복사)
  snapshot_data: {
    name: string
    description: string
    items: ContentItem[]         // 완전히 복사된 아이템들
    item_count: number
    created_at: string
  }
  
  // 버전 관리
  version_number: number         // v1, v2, v3...
  content_hash: string          // 중복 방지용 해시
  is_active: boolean            // 현재 활성 버전인지
  can_rollback: boolean         // 롤백 가능 여부
  
  // 마켓플레이스 메타데이터
  category: string
  tags: string[]
  price: number                 // 0 = 무료
  cover_image?: string
  
  // 통계
  downloads: number
  likes: number
  views: number
  
  // 생명주기
  created_at: string
  updated_at: string
  expires_at?: string           // 자동 정리 시점
}
```

#### **버전 히스토리**
```typescript
interface FolderVersionHistory {
  id: string
  marketplace_folder_id: string
  version_number: number
  changes_summary: string       // "3개 추가, 1개 제거"
  change_delta: {
    added_items: string[]
    removed_items: string[]
    modified_items: string[]
  }
  created_at: string
}
```

### 🎨 **UI/UX 상태 표시**

#### **My Folder에서의 폴더 상태**
```typescript
type FolderDisplayStatus = {
  // 🔒 Private folder
  private: { icon: '🔒', message: 'Private only', color: 'gray' }
  
  // 🌐 Shared • Up to date  
  synced: { icon: '🌐', message: 'Live in Marketplace', color: 'green' }
  
  // 🔄 Shared • Has updates
  outdated: { icon: '🔄', message: 'Has updates', color: 'orange' }
  
  // ⏳ Updating shared version...
  updating: { icon: '⏳', message: 'Updating...', color: 'blue' }
}
```

#### **버튼 상태별 변화**
```typescript
type ShareButtonState = {
  // 최초 공유 전
  initial: "📤 Share to Marketplace"
  
  // 공유 후 - 동일한 상태
  synced: "✅ Up to date" + "📊 View Stats"
  
  // 공유 후 - 변경사항 있음
  outdated: "🔄 Update Shared" + "📊 View Stats"
  
  // 업데이트 중
  updating: "⏳ Updating..." + "📊 View Stats"
}
```

### 🔄 **핵심 비즈니스 로직**

#### **1. 폴더 공유 플로우**
```typescript
async function shareFolder(folderId: string, shareOptions: ShareOptions) {
  // 1. 현재 폴더 상태 스냅샷
  const folder = await getFolder(folderId)
  const contentHash = generateContentHash(folder.items)
  
  // 2. 중복 확인 (같은 내용이면 공유 스킵)
  const existingVersion = await getActiveMarketplaceVersion(folderId)
  if (existingVersion?.content_hash === contentHash) {
    return { success: false, message: "이미 최신 버전입니다 ✅" }
  }
  
  // 3. 새 버전 생성
  const newVersion = await createMarketplaceVersion({
    original_folder_id: folderId,
    snapshot_data: deepCopy(folder), // 완전히 분리된 복사본
    version_number: (existingVersion?.version_number || 0) + 1,
    content_hash: contentHash,
    is_active: true
  })
  
  // 4. 이전 버전 비활성화
  if (existingVersion) {
    await deactivateVersion(existingVersion.id)
  }
  
  // 5. 원본 폴더 상태 업데이트
  await updateFolder(folderId, {
    shared_version_id: newVersion.id,
    last_shared_at: new Date().toISOString(),
    shared_status: 'shared-synced'
  })
  
  return { success: true, version: newVersion }
}
```

#### **2. 상태 동기화 체크**
```typescript
async function checkSyncStatus(folderId: string) {
  const folder = await getFolder(folderId)
  const sharedVersion = await getActiveMarketplaceVersion(folderId)
  
  if (!sharedVersion) {
    return 'private'
  }
  
  const currentHash = generateContentHash(folder.items)
  const sharedHash = sharedVersion.content_hash
  
  return currentHash === sharedHash ? 'shared-synced' : 'shared-outdated'
}
```

#### **3. Marketplace → My Folder 가져오기**
```typescript
async function addToMyFolder(marketplaceFolderId: string, userId: string) {
  const marketplaceFolder = await getMarketplaceFolder(marketplaceFolderId)
  
  // 1. 스냅샷 데이터로 새 폴더 생성
  const newFolder = await createFolder({
    name: `${marketplaceFolder.snapshot_data.name} (from Marketplace)`,
    user_id: userId,
    items: deepCopy(marketplaceFolder.snapshot_data.items),
    source_marketplace_id: marketplaceFolderId // 출처 추적
  })
  
  // 2. 다운로드 수 증가
  await incrementDownloadCount(marketplaceFolderId)
  
  return newFolder
}
```

### 📈 **버전 관리 및 정리 정책**

#### **버전 보관 정책**
```typescript
const VERSION_POLICY = {
  MAX_VERSIONS: 3,              // 최대 3개 버전 유지
  AUTO_DELETE_DAYS: 90,         // 90일 후 자동 삭제
  ROLLBACK_LIMIT_DAYS: 30,      // 30일 내 롤백만 허용
  COMPRESS_OLD_VERSIONS: true   // 구 버전 압축 저장
}
```

#### **자동 정리 작업**
```typescript
async function cleanupOldVersions() {
  // 1. 90일 지난 비활성 버전 삭제
  await deleteExpiredVersions()
  
  // 2. 3개 초과 버전 정리 (최신 3개만 유지)
  await trimExcessVersions()
  
  // 3. 구 버전 데이터 압축
  await compressOldVersions()
}
```

### 🎯 **사용자 시나리오**

#### **시나리오 1: 최초 공유**
```
1. 📁 "React Study" 폴더 생성 (10개 아이템)
2. 📤 "Share to Marketplace" 클릭
3. 🎉 v1.0 생성 • 스냅샷 저장
4. 🌐 My Folder에 "Live in Marketplace" 표시
5. 📊 Marketplace에서 다운로드 시작
```

#### **시나리오 2: 업데이트 공유**
```
1. 📝 원본 폴더에 5개 아이템 추가
2. 🔄 "Update Shared" 버튼 활성화
3. 📋 변경사항 미리보기: "+5 items added"
4. 🚀 "Update v2.0" 클릭
5. ✅ v2.0 생성, v1.0 비활성화
```

#### **시나리오 3: 롤백**
```
1. 📊 "View Stats" → "Version History"
2. ⏪ "Rollback to v1.0" 클릭
3. ⚠️ 롤백 확인 다이얼로그
4. ✅ v3.0 생성 (v1.0 내용으로)
5. 🔄 새 버전으로 마켓플레이스 업데이트
```

### 🚀 **구현 단계**

#### **Phase 1: 기본 스냅샷 시스템**
- [ ] 스냅샷 기반 공유 로직
- [ ] My Folder 상태 표시
- [ ] 기본 UI 컴포넌트

#### **Phase 2: 버전 관리**
- [ ] 해시 기반 중복 방지
- [ ] 변경사항 미리보기
- [ ] Update 기능

#### **Phase 3: 고급 기능**
- [ ] 제한적 롤백 (3버전)
- [ ] 자동 정리 시스템
- [ ] 통계 및 분석

### ⚠️ **주의사항**

1. **데이터 분리**: 원본과 공유본은 완전히 독립적
2. **성능**: 큰 폴더는 비동기 처리로 UX 개선
3. **보안**: 민감한 정보 자동 필터링
4. **저장소**: 해시 기반으로 중복 데이터 최소화

---

## 💰 **Pro Plan 설계 및 수익화 전략**

### 🎯 **플랜 구조**

#### **Free Plan (무료)**
```typescript
{
  storage_limit_gb: 1,           // 1GB 저장공간
  max_folders: 20,               // 20개 폴더
  max_items_per_folder: 500,     // 폴더당 500개 아이템 (고정)
  can_sell_paid_folders: false,  // 무료 공유만 가능
  max_marketplace_folders: 5,    // 5개 폴더만 공유 가능
  advanced_analytics: false,     // 기본 통계만
  priority_support: false,       // 일반 지원
  custom_categories: false       // 기본 카테고리만
}
```

#### **Pro Plan ($9.99/월)**
```typescript
{
  storage_limit_gb: 10,          // 10GB 저장공간 (10배 확장)
  max_folders: 50,               // 50개 폴더 (2.5배 확장)
  max_items_per_folder: 500,     // 폴더당 500개 아이템 (동일)
  can_sell_paid_folders: true,   // ⭐ 유료 판매 가능
  max_marketplace_folders: 25,   // 25개 폴더 공유 가능 (5배 확장)
  advanced_analytics: true,      // ⭐ 고급 분석 & 수익 통계
  priority_support: true,        // ⭐ 우선 지원
  custom_categories: true        // ⭐ 커스텀 카테고리
}
```

### 📊 **용량 계산 방식 (보수적 접근)**

#### **1. URL 기반 콘텐츠**
```typescript
// 링크 아이템 크기 계산
link: {
  title + description + url: 텍스트 크기 × 2.5 (UTF-8 한글 고려)
  thumbnail: 500KB (보수적 예상)
  metadata: 50KB (보수적)
  overhead: 5KB (DB 저장 비용)
}
```

#### **2. 텍스트 노트**
```typescript
note: {
  content: 실제 텍스트 크기 × 2 (최소 1KB)
  overhead: 5KB
}
```

#### **3. 이미지**
```typescript
image: {
  url_image: 500KB (썸네일)
  uploaded_image: 5MB (보수적 예상)
  overhead: 5KB
}
```

#### **4. 문서**
```typescript
document: {
  url_document: 100KB (메타데이터)
  uploaded_document: 10MB (보수적 예상)
  overhead: 5KB
}
```

### 🚨 **사용량 경고 시스템**

#### **사용량 단계별 알림**
```typescript
// 저장 공간
storage_90_percent: "⚠️ 저장공간 90% 사용 중 - 정리하거나 Pro로 업그레이드하세요"
storage_100_percent: "🚫 저장공간 가득참 - 새 콘텐츠 추가 불가"

// 폴더 개수
folders_95_percent: "⚠️ 폴더 한계 임박 (19/20)"
folders_100_percent: "🚫 폴더 개수 한계 도달 - Pro로 업그레이드하세요"

// 마켓플레이스
marketplace_full: "🚫 공유 폴더 한계 도달 (5/5)"
```

### 💡 **사용량 시각화 구성요소**

#### **Dashboard Usage Card**
```typescript
interface UsageCard {
  // 진행률 바 (색상으로 상태 표시)
  storage_progress: "녹색(~70%) → 노랑(~90%) → 주황(~100%) → 빨강(100%+)"
  folders_progress: "동일한 색상 체계"
  marketplace_progress: "동일한 색상 체계"
  
  // Pro 기능 미리보기 (Free 사용자만)
  pro_preview: [
    "💾 저장공간 10GB (현재 1GB)",
    "📁 폴더 50개 (현재 20개)", 
    "💰 유료 마켓플레이스 판매",
    "📊 고급 분석 & 수익 통계"
  ]
}
```

### 🎨 **Pro 전용 기능**

#### **1. 유료 마켓플레이스 판매**
```typescript
// Pro 사용자만 가격 설정 가능
price_options: [
  "$0.99", "$1.99", "$2.99", "$4.99", 
  "$9.99", "$19.99", "Custom Price"
]

// 수익 분배
revenue_share: {
  creator: "70%",  // 제작자 수익
  platform: "30%"  // KOOUK 수수료
}
```

#### **2. 고급 분석 대시보드**
```typescript
advanced_analytics: {
  // 폴더별 통계
  folder_performance: "조회수, 다운로드, 좋아요, 수익"
  
  // 시간별 분석  
  time_series: "일/주/월별 성과 트렌드"
  
  // 수익 분석
  revenue_analytics: "총 수익, 월별 수익, 인기 폴더"
  
  // 사용자 분석
  audience_insights: "다운로드한 사용자 지역, 시간대"
}
```

#### **3. 커스텀 카테고리**
```typescript
custom_categories: {
  max_custom: 10,  // 최대 10개 커스텀 카테고리
  features: [
    "이모지 + 색상 선택",
    "카테고리 설명 추가", 
    "우선순위 설정"
  ]
}
```

### 💳 **업그레이드 유도 전략**

#### **1. 적절한 타이밍**
```typescript
upgrade_triggers: [
  "폴더 19개째 생성 시",
  "저장공간 90% 도달 시",
  "유료 공유 시도 시",
  "고급 분석 클릭 시"
]
```

#### **2. 업그레이드 모달 UX**
```typescript
upgrade_modal: {
  title: "🌟 Pro로 업그레이드하여 더 많은 기능을!"
  
  benefits_comparison: "Free vs Pro 테이블"
  
  cta_button: "$9.99/월로 시작하기"
  
  guarantee: "💰 30일 환불 보장"
  
  testimonials: "Pro 사용자 후기 2-3개"
}
```

### 📈 **수익화 목표**

#### **단기 목표 (6개월)**
- 가입자 1,000명
- Pro 전환율 15% (150명)
- 월 수익 $1,500 (150명 × $9.99)

#### **중기 목표 (1년)**
- 가입자 5,000명  
- Pro 전환율 20% (1,000명)
- 월 수익 $10,000 (1,000명 × $9.99)
- 마켓플레이스 거래 수수료 추가 수익

#### **장기 목표 (2년)**
- 가입자 20,000명
- Pro 전환율 25% (5,000명)  
- 월 수익 $50,000
- Enterprise 플랜 출시 ($49.99/월)

### 🔧 **구현 우선순위**

#### **Phase 1: 기본 제한 시스템**
- [x] 용량 계산 로직
- [x] 사용량 시각화 컴포넌트  
- [ ] 제한 도달 시 알림
- [ ] 폴더/아이템 생성 제한

#### **Phase 2: Pro 결제 시스템**
- [ ] Stripe 결제 연동
- [ ] 플랜 업그레이드/다운그레이드
- [ ] 결제 실패 처리

#### **Phase 3: Pro 전용 기능**
- [ ] 유료 마켓플레이스 판매
- [ ] 고급 분석 대시보드
- [ ] 커스텀 카테고리

#### **Phase 4: 최적화**
- [ ] 사용량 캐싱
- [ ] 백그라운드 계산
- [ ] 성능 모니터링

---