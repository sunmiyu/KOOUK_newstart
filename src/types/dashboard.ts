// 대시보드 관련 타입 정의

export interface DashboardStats {
  folders: {
    total: number
    recent: number
    shared: number
  }
  items: {
    total: number
    by_type: Record<string, number>
    recent: number
  }
  bookmarks: {
    total: number
    favorites: number
    recent: number
  }
  activity: {
    daily_active_days: number
    last_active: string
    total_actions: number
  }
}

export interface RecentActivity {
  id: string
  type: 'create_folder' | 'add_content' | 'add_bookmark' | 'share_folder' | 'download_folder'
  title: string
  description: string
  timestamp: string
  metadata?: {
    folder_name?: string
    content_type?: string
    bookmark_url?: string
  }
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  action: () => void
  color: string
}

export interface PopularFolder {
  id: string
  name: string
  icon?: string
  color?: string
  item_count: number
  last_accessed: string
  access_frequency: number
}

export interface RecentBookmark {
  id: string
  title: string
  url: string
  favicon?: string
  thumbnail?: string
  created_at: string
}

export interface ActivityChart {
  date: string
  actions: number
  type: 'daily' | 'weekly' | 'monthly'
}

export interface DashboardWidget {
  id: string
  type: 'stats' | 'recent_activity' | 'popular_folders' | 'recent_bookmarks' | 'quick_actions'
  title: string
  size: 'small' | 'medium' | 'large'
  position: { x: number; y: number }
  isVisible: boolean
}