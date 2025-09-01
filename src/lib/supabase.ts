import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 싱글톤 Supabase 클라이언트
let supabaseInstance: ReturnType<typeof createClient> | null = null

// Client-side Supabase client (싱글톤)
export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  }
  return supabaseInstance
})()

// Client component client (for use in client components) - 같은 인스턴스 반환
export const createSupabaseClient = () => {
  return supabase
}

// Database types (will be auto-generated later)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      folders: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string | null
          icon: string | null
          parent_id: string | null
          user_id: string
          is_shared: boolean
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string | null
          icon?: string | null
          parent_id?: string | null
          user_id: string
          is_shared?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          color?: string | null
          icon?: string | null
          parent_id?: string | null
          is_shared?: boolean
          is_public?: boolean
          updated_at?: string
        }
      }
      content_items: {
        Row: {
          id: string
          title: string
          description: string | null
          type: 'link' | 'note' | 'image' | 'document'
          url: string | null
          content: string | null
          thumbnail: string | null
          favicon: string | null
          folder_id: string
          user_id: string
          metadata: Record<string, unknown> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: 'link' | 'note' | 'image' | 'document'
          url?: string | null
          content?: string | null
          thumbnail?: string | null
          favicon?: string | null
          folder_id: string
          user_id: string
          metadata?: Record<string, unknown> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          type?: 'link' | 'note' | 'image' | 'document'
          url?: string | null
          content?: string | null
          thumbnail?: string | null
          favicon?: string | null
          metadata?: Record<string, unknown> | null
          updated_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          title: string
          url: string
          description: string | null
          favicon: string | null
          thumbnail: string | null
          category: string
          tags: string[]
          is_favorite: boolean
          user_id: string
          metadata: Record<string, unknown> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          url: string
          description?: string | null
          favicon?: string | null
          thumbnail?: string | null
          category?: string
          tags?: string[]
          is_favorite?: boolean
          user_id: string
          metadata?: Record<string, unknown> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          url?: string
          description?: string | null
          favicon?: string | null
          thumbnail?: string | null
          category?: string
          tags?: string[]
          is_favorite?: boolean
          metadata?: Record<string, unknown> | null
          updated_at?: string
        }
      }
      shared_folders: {
        Row: {
          id: string
          name: string
          description: string
          thumbnail: string | null
          category: string
          tags: string[]
          author_id: string
          likes: number
          downloads: number
          views: number
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          thumbnail?: string | null
          category?: string
          tags?: string[]
          author_id: string
          likes?: number
          downloads?: number
          views?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string
          thumbnail?: string | null
          category?: string
          tags?: string[]
          likes?: number
          downloads?: number
          views?: number
          is_featured?: boolean
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}