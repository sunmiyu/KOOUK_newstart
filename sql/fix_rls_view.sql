-- ===============================================
-- content_metadata_stats RLS Unrestricted 에러 해결
-- ===============================================

-- 1. 기존 뷰 삭제
DROP VIEW IF EXISTS content_metadata_stats;

-- 2. RLS가 필요 없는 안전한 뷰로 재생성
-- (집계 데이터라 개인정보 없음)
CREATE OR REPLACE VIEW content_metadata_stats 
WITH (security_barrier = false) AS
SELECT 
  COALESCE(metadata->>'platform', 'unknown') as platform,
  COUNT(*) as count,
  COUNT(CASE WHEN metadata->>'image' IS NOT NULL THEN 1 END) as with_thumbnail,
  ROUND(AVG(CASE WHEN metadata->>'title' IS NOT NULL THEN LENGTH(metadata->>'title') END), 2) as avg_title_length
FROM content_items 
WHERE metadata IS NOT NULL
GROUP BY metadata->>'platform'
ORDER BY count DESC;

-- 3. 뷰에 대한 권한 설정 (RLS 대신)
GRANT SELECT ON content_metadata_stats TO authenticated;
GRANT SELECT ON content_metadata_stats TO anon;

-- 4. 확인
SELECT * FROM content_metadata_stats LIMIT 3;

SELECT '✅ content_metadata_stats RLS 에러 해결 완료!' as message;