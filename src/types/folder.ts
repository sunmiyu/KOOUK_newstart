// 폴더 관련 타입 정의

export interface Folder {
  id: string
  name: string
  description?: string
  color?: string
  icon?: string
  parent_id?: string
  user_id: string
  is_shared: boolean
  is_public: boolean
  created_at: string
  updated_at: string
  item_count?: number
  
  // 공유 관련 필드
  shared_version_id?: string     // 현재 공유 중인 버전 ID
  last_shared_at?: string        // 마지막 공유 시간
  shared_status: 'private' | 'shared-synced' | 'shared-outdated'
  total_downloads?: number       // 누적 다운로드 수
}

export interface FolderWithItems extends Folder {
  items: ContentItem[]
  subfolders?: Folder[]
}

export interface ContentItem {
  id: string
  title: string
  description?: string
  type: 'link' | 'note' | 'image' | 'document'
  url?: string
  content?: string
  thumbnail?: string
  favicon?: string
  folder_id: string
  user_id: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CreateFolderData {
  name: string
  description?: string
  color?: string
  icon?: string
  parent_id?: string
}

export interface UpdateFolderData extends Partial<CreateFolderData> {
  id: string
}

export interface CreateContentData {
  title: string
  description?: string
  type: ContentItem['type']
  url?: string
  content?: string
  folder_id: string
}

export interface ShareOptions {
  price: number
  category: string
  description?: string
  tags: string[]
  cover_image?: string
}

export interface UpdateContentData extends Partial<CreateContentData> {
  id: string
}

export interface FolderTreeNode {
  folder: Folder
  children: FolderTreeNode[]
  isExpanded: boolean
  isSelected: boolean
}

// Marketplace 폴더 (공유본)
export interface MarketplaceFolder {
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

// 버전 히스토리
export interface FolderVersionHistory {
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

// 폴더 상태 표시
export type FolderDisplayStatus = {
  private: { icon: '🔒'; message: 'Private only'; color: 'gray' }
  synced: { icon: '🌐'; message: 'Live in Marketplace'; color: 'green' }
  outdated: { icon: '🔄'; message: 'Has updates'; color: 'orange' }
  updating: { icon: '⏳'; message: 'Updating...'; color: 'blue' }
}

// 공유 버튼 상태
export type ShareButtonState = {
  initial: '📤 Share to Marketplace'
  synced: '✅ Up to date'
  outdated: '🔄 Update Shared'
  updating: '⏳ Updating...'
}

// 공유 옵션
export interface ShareOptions {
  category: string
  tags: string[]
  price: number
  description?: string
  cover_image?: string
}

// 플랜 제한 설정
export interface PlanLimits {
  // 저장소 제한
  storage_limit_gb: number      // Free: 1GB, Pro: 10GB
  
  // 구조 제한  
  max_folders: number           // Free: 20, Pro: 50
  max_items_per_folder: number  // 모든 플랜: 500개 고정
  
  // 마켓플레이스 제한
  can_sell_paid_folders: boolean // Free: false, Pro: true
  max_marketplace_folders: number // Free: 5, Pro: 25
  
  // 기능 제한
  advanced_analytics: boolean   // Free: false, Pro: true
  priority_support: boolean     // Free: false, Pro: true
  custom_categories: boolean    // Free: false, Pro: true
}

// 사용자 플랜 타입
export type UserPlan = 'free' | 'pro'

// 사용자 사용량 추적
export interface UserUsage {
  user_id: string
  plan: UserPlan
  
  // 현재 사용량
  current_storage_mb: number    // MB 단위로 저장
  current_folders: number
  current_marketplace_folders: number
  
  // 제한값
  limits: PlanLimits
  
  // 사용률 (0-100)
  storage_usage_percent: number
  folder_usage_percent: number
  marketplace_usage_percent: number
  
  // 경고 상태
  is_storage_warning: boolean   // 90% 이상
  is_storage_full: boolean      // 100% 이상
  is_folders_full: boolean      // 폴더 개수 제한 도달
  
  last_calculated_at: string
}

// 아이템 크기 계산을 위한 인터페이스
export interface ContentItemSize {
  item_id: string
  type: ContentItem['type']
  size_bytes: number
  calculation_method: 'url_metadata' | 'text_content' | 'file_upload' | 'thumbnail'
}

// 플랜별 제한값 상수
export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  free: {
    storage_limit_gb: 1,
    max_folders: 20,
    max_items_per_folder: 500,
    can_sell_paid_folders: false,
    max_marketplace_folders: 5,
    advanced_analytics: false,
    priority_support: false,
    custom_categories: false
  },
  pro: {
    storage_limit_gb: 10,
    max_folders: 50,
    max_items_per_folder: 500,
    can_sell_paid_folders: true,
    max_marketplace_folders: 25,
    advanced_analytics: true,
    priority_support: true,
    custom_categories: true
  }
}