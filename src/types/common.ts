// 공통 타입 정의

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
  message?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta
}

export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface ModalState {
  isOpen: boolean
  data?: Record<string, unknown>
}

export interface Bookmark {
  id: string
  title: string
  url: string
  description?: string
  category: string
  user_id: string
  thumbnail?: string
  favicon?: string
  is_favorite: boolean
  tags: string[]
  metadata?: {
    domain?: string
    platform?: string
    [key: string]: unknown
  }
  created_at: string
  updated_at?: string
}

export interface BookmarkFormData {
  title: string
  url: string
  description?: string
  category: string
  image?: string
  domain?: string
  platform?: string
}

export interface MarketplaceCollection {
  id: string
  name: string
  description: string
  category: string
  downloads: number
  likes: number
  views: number
  author: string
  cover_image?: string
  created_at: string
  items_count: number
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface SearchParams {
  query: string
  filters?: Record<string, unknown>
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface FileUpload {
  file: File
  preview?: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export type ViewMode = 'grid' | 'list'

export type Theme = 'light' | 'dark' | 'system'

export interface AppSettings {
  theme: Theme
  language: 'ko' | 'en'
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
  }
  privacy: {
    analytics: boolean
    marketing: boolean
  }
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}