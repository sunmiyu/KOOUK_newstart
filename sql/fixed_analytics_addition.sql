-- ===============================================
-- KOOUK 수정된 안전한 분석 테이블 추가
-- 기존 user_usage 테이블과 충돌 해결
-- ===============================================

SELECT 'Starting fixed migration...' as status;

-- 1. content_metadata_stats 뷰 RLS 에러만 해결
DROP VIEW IF EXISTS content_metadata_stats;
CREATE OR REPLACE VIEW content_metadata_stats AS
SELECT 
  metadata->>'platform' as platform,
  COUNT(*) as count,
  COUNT(CASE WHEN metadata->>'image' IS NOT NULL THEN 1 END) as with_thumbnail,
  AVG(CASE WHEN metadata->>'title' IS NOT NULL THEN LENGTH(metadata->>'title') END) as avg_title_length
FROM content_items 
WHERE metadata IS NOT NULL
GROUP BY metadata->>'platform'
ORDER BY count DESC;

-- RLS 비활성화 (뷰에는 RLS 적용 안함)
ALTER VIEW content_metadata_stats OWNER TO postgres;

-- 2. marketplace_analytics 테이블만 새로 추가 (user_usage는 건드리지 않음)
CREATE TABLE IF NOT EXISTS marketplace_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  marketplace_folder_id uuid, -- 외래키는 나중에 추가
  
  -- 일별 통계
  date_tracked date DEFAULT CURRENT_DATE,
  
  -- 핵심 지표
  daily_views integer DEFAULT 0,
  daily_unique_views integer DEFAULT 0,
  daily_downloads integer DEFAULT 0,
  daily_likes integer DEFAULT 0,
  daily_unlikes integer DEFAULT 0,
  
  -- 상세 분석
  average_view_duration_seconds integer DEFAULT 0,
  bounce_rate numeric(5,2) DEFAULT 0,
  
  -- 지역/시간 분석 (JSON)
  top_countries jsonb DEFAULT '{}',
  hourly_views jsonb DEFAULT '{}',
  
  -- 추천/검색 관련
  recommendation_clicks integer DEFAULT 0,
  search_impressions integer DEFAULT 0,
  
  -- 메타데이터
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- 유니크 제약
  UNIQUE(marketplace_folder_id, date_tracked)
);

-- 3. 기존 user_usage 테이블에 없는 컬럼들만 안전하게 추가
DO $$
BEGIN
  -- limits 컬럼 추가 (JSON으로 제한 정보 저장)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_usage' AND column_name = 'limits'
  ) THEN
    ALTER TABLE user_usage ADD COLUMN limits jsonb DEFAULT '{
      "storage_limit_gb": 1,
      "max_folders": 20,
      "max_items_per_folder": 500,
      "max_marketplace_folders": 5
    }';
    RAISE NOTICE '✅ user_usage.limits 컬럼 추가됨';
  ELSE
    RAISE NOTICE '✅ user_usage.limits 컬럼 이미 존재';
  END IF;

  -- last_calculated_at 컬럼 추가
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_usage' AND column_name = 'last_calculated_at'
  ) THEN
    ALTER TABLE user_usage ADD COLUMN last_calculated_at timestamptz DEFAULT now();
    RAISE NOTICE '✅ user_usage.last_calculated_at 컬럼 추가됨';
  ELSE
    RAISE NOTICE '✅ user_usage.last_calculated_at 컬럼 이미 존재';
  END IF;
END $$;

-- 4. 기존 user_usage 테이블 업데이트 함수 (기존 구조 활용)
CREATE OR REPLACE FUNCTION refresh_user_usage(target_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  storage_mb bigint := 0;
  folder_count integer := 0;
  bookmark_count integer := 0;
  marketplace_count integer := 0;
  current_plan text := 'free';
  plan_limits jsonb;
  result jsonb;
BEGIN
  -- 현재 플랜 확인 (기존 테이블에서)
  SELECT COALESCE(plan, 'free') INTO current_plan
  FROM user_usage 
  WHERE user_id = target_user_id;
  
  -- 플랜별 제한 설정
  IF current_plan = 'pro' THEN
    plan_limits := '{"storage_limit_gb": 10, "max_folders": 50, "max_items_per_folder": 500, "max_marketplace_folders": 25}';
  ELSE
    plan_limits := '{"storage_limit_gb": 1, "max_folders": 20, "max_items_per_folder": 500, "max_marketplace_folders": 5}';
  END IF;
  
  -- 실제 사용량 계산
  SELECT COUNT(*) INTO folder_count FROM folders WHERE user_id = target_user_id;
  SELECT COUNT(*) INTO bookmark_count FROM bookmarks WHERE user_id = target_user_id;
  
  -- marketplace 폴더 계산 (어떤 테이블이든 사용 가능)
  SELECT COUNT(*) INTO marketplace_count 
  FROM marketplace_folders 
  WHERE user_id = target_user_id AND COALESCE(is_active, true) = true;
  
  -- 간단한 저장공간 계산
  storage_mb := (folder_count * 10) + (bookmark_count * 5);
  
  -- 기존 user_usage 테이블 업데이트
  UPDATE user_usage SET
    current_storage_mb = storage_mb,
    current_folders = folder_count,
    current_bookmarks = bookmark_count,
    current_marketplace_folders = marketplace_count,
    storage_usage_percent = LEAST(100, ROUND((storage_mb::numeric / (plan_limits->>'storage_limit_gb')::numeric / 1024) * 100)),
    folder_usage_percent = ROUND((folder_count::numeric / (plan_limits->>'max_folders')::numeric) * 100),
    marketplace_usage_percent = ROUND((marketplace_count::numeric / (plan_limits->>'max_marketplace_folders')::numeric) * 100),
    is_storage_warning = storage_mb > (plan_limits->>'storage_limit_gb')::numeric * 1024 * 0.9,
    is_storage_full = storage_mb >= (plan_limits->>'storage_limit_gb')::numeric * 1024,
    is_folders_full = folder_count >= (plan_limits->>'max_folders')::numeric,
    limits = plan_limits,
    last_calculated_at = now(),
    updated_at = now()
  WHERE user_id = target_user_id;
  
  -- 레코드가 없으면 생성
  INSERT INTO user_usage (user_id, plan, limits)
  VALUES (target_user_id, current_plan, plan_limits)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- 결과 반환
  SELECT to_jsonb(user_usage.*) INTO result
  FROM user_usage 
  WHERE user_id = target_user_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. 마켓플레이스 분석 함수
CREATE OR REPLACE FUNCTION track_marketplace_action(
  folder_id uuid,
  action_type text,
  user_country text DEFAULT 'KR'
)
RETURNS void AS $$
BEGIN
  INSERT INTO marketplace_analytics (
    marketplace_folder_id, date_tracked,
    daily_views, daily_downloads, daily_likes
  ) VALUES (
    folder_id, CURRENT_DATE,
    CASE WHEN action_type = 'view' THEN 1 ELSE 0 END,
    CASE WHEN action_type = 'download' THEN 1 ELSE 0 END,
    CASE WHEN action_type = 'like' THEN 1 ELSE 0 END
  )
  ON CONFLICT (marketplace_folder_id, date_tracked) DO UPDATE SET
    daily_views = marketplace_analytics.daily_views + 
      CASE WHEN action_type = 'view' THEN 1 ELSE 0 END,
    daily_downloads = marketplace_analytics.daily_downloads + 
      CASE WHEN action_type = 'download' THEN 1 ELSE 0 END,
    daily_likes = marketplace_analytics.daily_likes + 
      CASE WHEN action_type = 'like' THEN 1 ELSE 0 END,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RLS 설정
ALTER TABLE marketplace_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "marketplace_analytics_select_all" ON marketplace_analytics
  FOR SELECT USING (true);

CREATE POLICY "marketplace_analytics_insert_system" ON marketplace_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "marketplace_analytics_update_system" ON marketplace_analytics
  FOR UPDATE USING (true);

-- 7. 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_marketplace_analytics_folder_date 
ON marketplace_analytics(marketplace_folder_id, date_tracked);

CREATE INDEX IF NOT EXISTS idx_marketplace_analytics_date 
ON marketplace_analytics(date_tracked);

-- 8. 완료 확인
SELECT 
  'marketplace_analytics' as table_name,
  COUNT(*) as record_count
FROM marketplace_analytics;

SELECT '🎉 Fixed Analytics Migration 완료!' as message;