# 📁 KOOUK - Personal Digital Storage

> Easy Easy Super Easy, Notion을 대신하는 개인 Storage

![KOOUK Logo](https://via.placeholder.com/200x100/1f2937/ffffff?text=KOOUK)

## 🎯 프로젝트 개요

KOOUK는 개인 디지털 콘텐츠 관리 및 커뮤니티 공유 플랫폼입니다.
- **목적**: 개인 Storage + 커뮤니티 공유
- **타겟**: PC 우선 (1700px max), 추후 모바일 확장
- **핵심 기능**: 4개 탭 (Dashboard, My Folder, Bookmarks, Marketplace)

## 🚀 기술 스택

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Supabase (Database + Authentication)
- **Authentication**: Google OAuth
- **Deployment**: Vercel (예정)

## 📂 프로젝트 구조

```
KOOUK_newstart/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   ├── 📁 components/             # 컴포넌트
│   │   ├── 📁 pages/             # 페이지별 컴포넌트
│   │   │   ├── dashboard/        # 대시보드
│   │   │   ├── my-folder/        # 내 폴더
│   │   │   ├── bookmarks/        # 북마크
│   │   │   └── marketplace/      # 마켓플레이스
│   │   ├── 📁 layout/            # 레이아웃 컴포넌트
│   │   ├── 📁 shared/            # 공통 기능 컴포넌트
│   │   ├── 📁 modals/            # 모달 컴포넌트
│   │   └── 📁 ui/                # 기본 UI 컴포넌트
│   ├── 📁 hooks/                 # 커스텀 훅
│   ├── 📁 lib/                   # 라이브러리 & 설정
│   ├── 📁 types/                 # 타입 정의
│   ├── 📁 services/              # 비즈니스 로직
│   └── 📁 utils/                 # 헬퍼 함수
├── 📁 _backup/                   # 백업 파일 (4개)
├── 📁 public/                    # 정적 파일
└── 📄 CLAUDE.md                  # Claude 작업 가이드
```

## 🎨 4개 핵심 기능

### 1. 🏠 Dashboard
- 개인 허브의 중심
- 통계 카드, 빠른 액션, 최근 활동

### 2. 📁 My Folder  
- 개인 정보 관리의 중심
- 폴더 트리 + 콘텐츠 그리드
- 드래그 앤 드롭 지원

### 3. 🔖 Bookmarks
- 북마크 컬렉션 관리
- 자동 카테고리 분류
- 메타데이터 자동 추출

### 4. 🛍️ Marketplace
- 폴더 공유 및 소셜 기능
- 커뮤니티 콘텐츠 탐색
- 좋아요/다운로드 시스템

## 🛠️ 개발 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 린트 검사
npm run lint

# 타입 체크
npm run typecheck
```

## 📋 개발 우선순위

1. **🏗️ 기본 셋업** - Next.js + TypeScript + Tailwind ✅
2. **🔐 인증 시스템** - Supabase + Google OAuth
3. **📁 My Folder 기능** - 폴더 CRUD + 콘텐츠 관리
4. **🔖 Bookmarks 기능** - 북마크 저장 + 카테고리  
5. **🛍️ Marketplace 기능** - 공유 + 소셜 기능
6. **🏠 Dashboard** - 통계 + 빠른 액션

## 🔄 작업 원칙

- **수정 모드**: 항상 기존 파일을 Edit으로 수정
- **백업 시스템**: 대폭 수정 시 백업 후 작업
- **깔끔한 코드**: 주석처리 누적 금지

## 📝 문서

- `CLAUDE.md` - Claude 작업 가이드
- `_backup/README.md` - 백업 시스템 설명

## 🚀 배포 정보

- **개발 환경**: http://localhost:3000
- **배포 환경**: (추후 Vercel 설정)
- **데이터베이스**: Supabase

---

**Made with ❤️ by KOOUK Team**