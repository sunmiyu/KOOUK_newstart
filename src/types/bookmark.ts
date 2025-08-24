// 북마크 관련 타입 정의

export interface Bookmark {
  id: string
  title: string
  url: string
  description?: string
  favicon?: string
  thumbnail?: string
  category: BookmarkCategory
  tags: string[]
  is_favorite: boolean
  user_id: string
  metadata?: {
    domain?: string
    author?: string
    publish_date?: string
    reading_time?: number
  }
  created_at: string
  updated_at: string
}

export type BookmarkCategory = 
  | 'all'
  | 'tech'
  | 'design' 
  | 'news'
  | 'entertainment'
  | 'education'
  | 'shopping'
  | 'social'
  | 'productivity'
  | 'other'

export interface BookmarkFilter {
  category?: BookmarkCategory
  tags?: string[]
  is_favorite?: boolean
  search?: string
  sort?: 'created_at' | 'title' | 'domain'
  order?: 'asc' | 'desc'
}

export interface CreateBookmarkData {
  url: string
  title?: string
  description?: string
  category?: BookmarkCategory
  tags?: string[]
}

export interface UpdateBookmarkData extends Partial<CreateBookmarkData> {
  id: string
  is_favorite?: boolean
}

export interface BookmarkMetadata {
  title?: string
  description?: string
  image?: string
  favicon?: string
  domain?: string
  author?: string
  publish_date?: string
  reading_time?: number
}

export interface BookmarkStats {
  total: number
  by_category: Record<BookmarkCategory, number>
  favorites: number
  recent_count: number
}