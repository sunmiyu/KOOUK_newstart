// 마켓플레이스 관련 타입 정의

export interface SharedFolder {
  id: string
  name: string
  description: string
  thumbnail?: string
  category: MarketplaceCategory
  tags: string[]
  author: {
    id: string
    name: string
    avatar_url?: string
  }
  stats: {
    likes: number
    downloads: number
    views: number
  }
  items_preview: SharedContentItem[]
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface SharedContentItem {
  id: string
  title: string
  type: 'link' | 'note' | 'image' | 'document'
  url?: string
  thumbnail?: string
  preview?: string
}

export type MarketplaceCategory =
  | 'all'
  | 'productivity'
  | 'design'
  | 'development'
  | 'education'
  | 'entertainment'
  | 'news'
  | 'resources'
  | 'templates'
  | 'other'

export interface MarketplaceFilter {
  category?: MarketplaceCategory
  tags?: string[]
  sort?: 'popular' | 'recent' | 'likes' | 'downloads'
  search?: string
  featured_only?: boolean
}

export interface ShareFolderData {
  folder_id: string
  name: string
  description: string
  category: MarketplaceCategory
  tags: string[]
  thumbnail?: string
  is_public: boolean
}

export interface UserInteraction {
  user_id: string
  shared_folder_id: string
  type: 'like' | 'download' | 'view'
  created_at: string
}

export interface MarketplaceStats {
  total_folders: number
  total_downloads: number
  categories: Record<MarketplaceCategory, number>
  trending_tags: string[]
  featured_count: number
}