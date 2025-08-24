-- =============================================
-- KOOUK Database Schema with Complete RLS Setup
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1. USERS TABLE (extends Supabase auth.users)
-- =============================================
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users RLS Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (signup)
CREATE POLICY "users_insert_own" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- 2. FOLDERS TABLE
-- =============================================
CREATE TABLE public.folders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    icon TEXT DEFAULT '📁',
    parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    is_shared BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT folders_no_self_parent CHECK (id != parent_id),
    CONSTRAINT folders_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

-- Folders RLS Policies
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- Users can manage their own folders
CREATE POLICY "folders_select_own" ON public.folders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "folders_insert_own" ON public.folders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "folders_update_own" ON public.folders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "folders_delete_own" ON public.folders
    FOR DELETE USING (auth.uid() = user_id);

-- Public folders can be viewed by anyone (for marketplace)
CREATE POLICY "folders_select_public" ON public.folders
    FOR SELECT USING (is_public = TRUE);

-- =============================================
-- 3. CONTENT ITEMS TABLE
-- =============================================
CREATE TYPE content_type AS ENUM ('link', 'note', 'image', 'document');

CREATE TABLE public.content_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type content_type NOT NULL,
    url TEXT,
    content TEXT,
    thumbnail TEXT,
    favicon TEXT,
    folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    metadata JSONB DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT content_items_title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT content_items_link_needs_url CHECK (type != 'link' OR url IS NOT NULL),
    CONSTRAINT content_items_note_needs_content CHECK (type != 'note' OR content IS NOT NULL)
);

-- Content Items RLS Policies
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

-- Users can manage their own content items
CREATE POLICY "content_items_select_own" ON public.content_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "content_items_insert_own" ON public.content_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "content_items_update_own" ON public.content_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "content_items_delete_own" ON public.content_items
    FOR DELETE USING (auth.uid() = user_id);

-- Content items in public folders can be viewed by anyone
CREATE POLICY "content_items_select_public" ON public.content_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.folders 
            WHERE folders.id = content_items.folder_id 
            AND folders.is_public = TRUE
        )
    );

-- =============================================
-- 4. BOOKMARKS TABLE
-- =============================================
CREATE TYPE bookmark_category AS ENUM (
    'all', 'tech', 'design', 'news', 'entertainment', 
    'education', 'shopping', 'social', 'productivity', 'other'
);

CREATE TABLE public.bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    favicon TEXT,
    thumbnail TEXT,
    category bookmark_category DEFAULT 'other',
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT bookmarks_title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT bookmarks_valid_url CHECK (url ~ '^https?://.*')
);

-- Bookmarks RLS Policies
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can manage their own bookmarks
CREATE POLICY "bookmarks_select_own" ON public.bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "bookmarks_insert_own" ON public.bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookmarks_update_own" ON public.bookmarks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "bookmarks_delete_own" ON public.bookmarks
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 5. SHARED FOLDERS TABLE (Marketplace)
-- =============================================
CREATE TYPE marketplace_category AS ENUM (
    'all', 'productivity', 'design', 'development', 'education',
    'entertainment', 'news', 'resources', 'templates', 'other'
);

CREATE TABLE public.shared_folders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail TEXT,
    category marketplace_category DEFAULT 'other',
    tags TEXT[] DEFAULT '{}',
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    original_folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE NOT NULL,
    likes INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT shared_folders_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT shared_folders_desc_not_empty CHECK (LENGTH(TRIM(description)) > 0),
    CONSTRAINT shared_folders_non_negative_stats CHECK (
        likes >= 0 AND downloads >= 0 AND views >= 0
    )
);

-- Shared Folders RLS Policies
ALTER TABLE public.shared_folders ENABLE ROW LEVEL SECURITY;

-- Anyone can view active shared folders (marketplace)
CREATE POLICY "shared_folders_select_active" ON public.shared_folders
    FOR SELECT USING (is_active = TRUE);

-- Authors can manage their own shared folders
CREATE POLICY "shared_folders_insert_own" ON public.shared_folders
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "shared_folders_update_own" ON public.shared_folders
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "shared_folders_delete_own" ON public.shared_folders
    FOR DELETE USING (auth.uid() = author_id);

-- =============================================
-- 6. USER INTERACTIONS TABLE (likes, downloads, views)
-- =============================================
CREATE TYPE interaction_type AS ENUM ('like', 'download', 'view');

CREATE TABLE public.user_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    shared_folder_id UUID REFERENCES public.shared_folders(id) ON DELETE CASCADE NOT NULL,
    type interaction_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint for likes (one like per user per folder)
    CONSTRAINT user_interactions_unique_like UNIQUE (user_id, shared_folder_id, type)
        DEFERRABLE INITIALLY DEFERRED
);

-- User Interactions RLS Policies
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;

-- Anyone can view interactions (for public stats)
CREATE POLICY "user_interactions_select_all" ON public.user_interactions
    FOR SELECT TO authenticated USING (TRUE);

-- Authenticated users can create interactions
CREATE POLICY "user_interactions_insert_auth" ON public.user_interactions
    FOR INSERT TO authenticated WITH CHECK (
        auth.uid() = user_id OR user_id IS NULL
    );

-- Users can delete their own interactions
CREATE POLICY "user_interactions_delete_own" ON public.user_interactions
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 7. ACTIVITY LOG TABLE (Dashboard analytics)
-- =============================================
CREATE TYPE activity_type AS ENUM (
    'create_folder', 'delete_folder', 'update_folder',
    'create_content', 'delete_content', 'update_content',
    'create_bookmark', 'delete_bookmark', 'update_bookmark',
    'share_folder', 'download_folder'
);

CREATE TABLE public.activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type activity_type NOT NULL,
    entity_id UUID,
    entity_name TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log RLS Policies
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own activity
CREATE POLICY "activity_log_select_own" ON public.activity_log
    FOR SELECT USING (auth.uid() = user_id);

-- System can insert activity logs
CREATE POLICY "activity_log_insert_system" ON public.activity_log
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 8. INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX idx_users_email ON public.users(email);

-- Folders indexes
CREATE INDEX idx_folders_user_id ON public.folders(user_id);
CREATE INDEX idx_folders_parent_id ON public.folders(parent_id);
CREATE INDEX idx_folders_public ON public.folders(is_public) WHERE is_public = TRUE;

-- Content items indexes
CREATE INDEX idx_content_items_user_id ON public.content_items(user_id);
CREATE INDEX idx_content_items_folder_id ON public.content_items(folder_id);
CREATE INDEX idx_content_items_type ON public.content_items(type);

-- Bookmarks indexes
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_category ON public.bookmarks(category);
CREATE INDEX idx_bookmarks_favorite ON public.bookmarks(is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX idx_bookmarks_tags ON public.bookmarks USING GIN(tags);

-- Shared folders indexes
CREATE INDEX idx_shared_folders_author_id ON public.shared_folders(author_id);
CREATE INDEX idx_shared_folders_category ON public.shared_folders(category);
CREATE INDEX idx_shared_folders_featured ON public.shared_folders(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_shared_folders_tags ON public.shared_folders USING GIN(tags);
CREATE INDEX idx_shared_folders_active ON public.shared_folders(is_active) WHERE is_active = TRUE;

-- User interactions indexes
CREATE INDEX idx_user_interactions_user_id ON public.user_interactions(user_id);
CREATE INDEX idx_user_interactions_shared_folder_id ON public.user_interactions(shared_folder_id);
CREATE INDEX idx_user_interactions_type ON public.user_interactions(type);

-- Activity log indexes
CREATE INDEX idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_type ON public.activity_log(type);
CREATE INDEX idx_activity_log_created_at ON public.activity_log(created_at);

-- =============================================
-- 9. FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER users_updated_at_trigger
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER folders_updated_at_trigger
    BEFORE UPDATE ON public.folders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER content_items_updated_at_trigger
    BEFORE UPDATE ON public.content_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookmarks_updated_at_trigger
    BEFORE UPDATE ON public.bookmarks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER shared_folders_updated_at_trigger
    BEFORE UPDATE ON public.shared_folders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to handle user creation (auto-create user profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update shared folder stats
CREATE OR REPLACE FUNCTION update_shared_folder_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.shared_folders 
        SET 
            likes = CASE WHEN NEW.type = 'like' THEN likes + 1 ELSE likes END,
            downloads = CASE WHEN NEW.type = 'download' THEN downloads + 1 ELSE downloads END,
            views = CASE WHEN NEW.type = 'view' THEN views + 1 ELSE views END
        WHERE id = NEW.shared_folder_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.shared_folders 
        SET 
            likes = CASE WHEN OLD.type = 'like' THEN GREATEST(0, likes - 1) ELSE likes END
        WHERE id = OLD.shared_folder_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating shared folder stats
CREATE TRIGGER update_shared_folder_stats_trigger
    AFTER INSERT OR DELETE ON public.user_interactions
    FOR EACH ROW EXECUTE FUNCTION update_shared_folder_stats();

-- =============================================
-- 10. GRANT PERMISSIONS
-- =============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant permissions on tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant permissions on sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;