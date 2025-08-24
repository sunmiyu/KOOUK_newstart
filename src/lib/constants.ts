// 앱 전체에서 사용되는 상수들

export const APP_NAME = 'KOOUK'
export const APP_DESCRIPTION = 'Easy Easy Super Easy, Notion을 대신하는 개인 Storage'

// 화면 크기
export const SCREEN_SIZES = {
  MAX_WIDTH: 1700,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
} as const

// 네비게이션
export const NAV_ITEMS = [
  { id: 'dashboard', label: '대시보드', icon: '🏠', path: '/dashboard' },
  { id: 'my-folder', label: 'My Folder', icon: '📁', path: '/my-folder' },
  { id: 'bookmarks', label: 'Bookmarks', icon: '🔖', path: '/bookmarks' },
  { id: 'marketplace', label: 'Marketplace', icon: '🛍️', path: '/marketplace' },
] as const

// 북마크 카테고리
export const BOOKMARK_CATEGORIES = [
  { id: 'all', label: 'All', icon: '📌' },
  { id: 'tech', label: 'Tech', icon: '💻' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'shopping', label: 'Shopping', icon: '🛒' },
  { id: 'social', label: 'Social', icon: '👥' },
  { id: 'productivity', label: 'Productivity', icon: '⚡' },
  { id: 'other', label: 'Other', icon: '📂' },
] as const

// 마켓플레이스 카테고리
export const MARKETPLACE_CATEGORIES = [
  { id: 'all', label: 'All', icon: '📌' },
  { id: 'productivity', label: 'Productivity', icon: '⚡' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'development', label: 'Development', icon: '💻' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'resources', label: 'Resources', icon: '📦' },
  { id: 'templates', label: 'Templates', icon: '📋' },
  { id: 'other', label: 'Other', icon: '📂' },
] as const

// 콘텐츠 타입
export const CONTENT_TYPES = [
  { id: 'link', label: 'Link', icon: '🔗', color: 'blue' },
  { id: 'note', label: 'Note', icon: '📝', color: 'green' },
  { id: 'image', label: 'Image', icon: '🖼️', color: 'purple' },
  { id: 'document', label: 'Document', icon: '📄', color: 'orange' },
] as const

// 폴더 색상
export const FOLDER_COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500  
  '#8B5CF6', // violet-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#EC4899', // pink-500
  '#6B7280', // gray-500
] as const

// 폴더 아이콘
export const FOLDER_ICONS = [
  '📁', '📂', '🗂️', '📋', '📊', '💼', '🎯', '⚡', '🎨', '💻', '📚', '🎬'
] as const

// 정렬 옵션
export const SORT_OPTIONS = [
  { id: 'created_at', label: '최신순', order: 'desc' },
  { id: 'created_at', label: '오래된순', order: 'asc' },
  { id: 'title', label: '이름순 (A-Z)', order: 'asc' },
  { id: 'title', label: '이름순 (Z-A)', order: 'desc' },
  { id: 'updated_at', label: '최근 수정순', order: 'desc' },
] as const

// API 설정
export const API = {
  BASE_URL: '/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const

// 페이지네이션
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const

// 파일 업로드
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
} as const

// 토스트 메시지
export const TOAST = {
  DEFAULT_DURATION: 5000,
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 7000,
} as const