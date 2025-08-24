# 📁 KOOUK 컴포넌트 소속 구분 가이드

## 🎯 **4개 탭별 컴포넌트 소속 명확화**

### 1. 📊 **Dashboard Division**
```
src/components/pages/dashboard/
├── DashboardPage.tsx          # 메인 페이지 (200-300줄)
├── StatsSection.tsx           # 통계 카드들 (300-400줄)
├── QuickActionsSection.tsx    # 빠른 액션 버튼들 (150-200줄)
├── RecentActivitySection.tsx  # 최근 활동 (200-300줄)
├── PopularFoldersSection.tsx  # 인기 폴더들 (150-250줄)
└── ActivityChart.tsx          # 활동 차트 (200-400줄)
```

**Dashboard 전용 컴포넌트들**:
- `StatCard` - 통계 표시 카드
- `QuickActionButton` - 빠른 액션 버튼
- `ActivityItem` - 활동 아이템
- `MiniChart` - 작은 차트 컴포넌트

### 2. 📁 **My Folder Division**  
```
src/components/pages/my-folder/
├── MyFolderPage.tsx           # 메인 페이지 (150-200줄)
├── FolderTreeSection.tsx      # 좌측 폴더 트리 (400-600줄)
├── ContentGridSection.tsx     # 우측 콘텐츠 그리드 (400-600줄)
├── FolderActions.tsx          # 폴더 액션들 (200-300줄)
├── ContentUpload.tsx          # 콘텐츠 업로드 (300-500줄)
└── DragDropProvider.tsx       # 드래그앤드롭 (200-400줄)
```

**My Folder 전용 컴포넌트들**:
- `FolderTreeNode` - 트리 노드
- `ContentCard` - 콘텐츠 카드
- `UploadZone` - 업로드 영역
- `FolderContextMenu` - 우클릭 메뉴

### 3. 🔖 **Bookmarks Division**
```
src/components/pages/bookmarks/
├── BookmarksPage.tsx          # 메인 페이지 (150-200줄)
├── CategoryTabsSection.tsx    # 상단 카테고리 탭들 (200-300줄)
├── BookmarkGridSection.tsx    # 북마크 그리드 (400-600줄)
├── BookmarkFilters.tsx        # 필터 및 검색 (200-300줄)
└── BookmarkImport.tsx         # 북마크 가져오기 (200-400줄)
```

**Bookmarks 전용 컴포넌트들**:
- `BookmarkCard` - 북마크 카드
- `CategoryTab` - 카테고리 탭
- `BookmarkPreview` - 북마크 미리보기
- `FavoriteButton` - 즐겨찾기 버튼

### 4. 🛍️ **Marketplace Division**
```
src/components/pages/marketplace/
├── MarketplacePage.tsx        # 메인 페이지 (150-200줄)
├── FilterSection.tsx          # 상단 필터 (200-300줄)
├── SharedFolderGrid.tsx       # 공유 폴더 그리드 (400-600줄)
├── SocialActions.tsx          # 좋아요/다운로드 (200-300줄)
└── FeaturedSection.tsx        # 추천 섹션 (200-400줄)
```

**Marketplace 전용 컴포넌트들**:
- `SharedFolderCard` - 공유 폴더 카드
- `AuthorProfile` - 작성자 프로필
- `SocialStats` - 소셜 통계
- `DownloadButton` - 다운로드 버튼

---

## 🏗️ **공통 컴포넌트 소속**

### **Layout Division** (모든 탭에서 사용)
```
src/components/layout/
├── AppLayout.tsx              # 전체 레이아웃 (200-300줄)
├── Header.tsx                 # 상단 헤더 (200-300줄)
├── Sidebar.tsx                # 좌측 사이드바 (300-500줄)
├── Navigation.tsx             # 네비게이션 (150-250줄)
└── MobileLayout.tsx           # 모바일 레이아웃 (200-400줄)
```

### **Shared Division** (2개 이상 탭에서 사용)
```
src/components/shared/
├── SearchBar.tsx              # 검색바 (150-250줄)
├── FilterDropdown.tsx         # 필터 드롭다운 (200-300줄)
├── ViewModeToggle.tsx         # 그리드/리스트 토글 (100-150줄)
├── EmptyState.tsx             # 빈 상태 (100-200줄)
├── LoadingSpinner.tsx         # 로딩 (50-100줄)
└── Pagination.tsx             # 페이지네이션 (150-250줄)
```

### **Modals Division** (전체 앱에서 사용)
```
src/components/modals/
├── CreateFolderModal.tsx      # 폴더 생성 (300-500줄)
├── ShareFolderModal.tsx       # 폴더 공유 (400-600줄)
├── EditContentModal.tsx       # 콘텐츠 수정 (400-700줄)
├── DeleteConfirmModal.tsx     # 삭제 확인 (150-250줄)
├── SettingsModal.tsx          # 설정 (400-600줄)
└── AuthModal.tsx              # 인증 (300-500줄)
```

### **UI Division** (기본 UI 요소)
```
src/components/ui/
├── Button.tsx                 # 버튼 (100-200줄) ✅
├── Input.tsx                  # 입력 (150-250줄)
├── Modal.tsx                  # 베이스 모달 (200-300줄)
├── Card.tsx                   # 베이스 카드 (100-200줄)
├── Badge.tsx                  # 배지 (50-100줄)
├── Toast.tsx                  # 토스트 (150-250줄)
├── Dropdown.tsx               # 드롭다운 (200-300줄)
└── Tooltip.tsx                # 툴팁 (100-150줄)
```

---

## 🚫 **엄격한 소속 규칙**

### **Dashboard Division 컴포넌트는**
- ❌ My Folder, Bookmarks, Marketplace에서 사용 금지
- ✅ Dashboard 페이지에서만 사용
- ✅ Layout, Shared, Modals, UI는 사용 가능

### **각 탭별 Division 컴포넌트는**
- ❌ 다른 탭 Division에서 사용 금지
- ✅ 해당 탭에서만 사용
- ✅ 공통 Division(Layout, Shared, Modals, UI)은 사용 가능

### **Shared Division 컴포넌트는**
- ✅ 2개 이상 탭에서 재사용되는 경우만
- ❌ 한 탭에서만 사용되면 해당 탭 Division으로 이동

### **컴포넌트 생성 규칙**
1. **새 컴포넌트 생성 시 소속 먼저 결정**
2. **어느 탭에서 사용될지 명확히 확인**
3. **2개 이상 탭에서 사용 → Shared Division**
4. **1개 탭에서만 사용 → 해당 탭 Division**

---

## 📝 **Import 규칙**

```typescript
// ✅ 올바른 Import 예시
// Dashboard에서 사용
import DashboardPage from '@/components/pages/dashboard/DashboardPage'
import StatsSection from '@/components/pages/dashboard/StatsSection'
import SearchBar from '@/components/shared/SearchBar'
import Button from '@/components/ui/Button'

// ❌ 잘못된 Import 예시  
// Dashboard에서 Bookmark Division 사용
import BookmarkCard from '@/components/pages/bookmarks/BookmarkCard' // 금지!
```

이렇게 명확히 구분하면 **컴포넌트 책임이 분명**해지고 **유지보수가 쉬워집니다**!