-- 향상된 메타데이터를 위한 데이터베이스 스키마 업데이트
-- KOOUK Enhanced Content Card System

-- ContentItem 테이블에 새로운 메타데이터 필드 추가
-- 기존 metadata 컬럼이 JSON이므로 추가 컬럼은 불필요하지만, 
-- 명확한 구조를 위해 선택적으로 사용 가능

-- 1. Content Items 테이블 확장 (선택사항 - JSON metadata 사용 권장)
ALTER TABLE content_items 
ADD COLUMN IF NOT EXISTS enhanced_metadata JSONB DEFAULT '{}';

-- 2. 향상된 메타데이터를 위한 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_content_items_metadata_domain 
ON content_items USING GIN ((metadata->>'domain'));

CREATE INDEX IF NOT EXISTS idx_content_items_metadata_platform 
ON content_items USING GIN ((metadata->>'platform'));

CREATE INDEX IF NOT EXISTS idx_content_items_metadata_title 
ON content_items USING GIN ((metadata->>'title'));

-- 3. 메타데이터 JSON 구조 예시 및 제약조건
-- metadata 컬럼에 저장될 JSON 구조:
/*
{
  "title": "실제 웹페이지 제목",
  "description": "웹페이지 설명",
  "image": "썸네일 이미지 URL",
  "thumbnail": "썸네일 URL (호환성)",
  "domain": "example.com",
  "platform": "youtube|web|naver|tistory|github",
  "favicon": "파비콘 URL",
  "videoId": "YouTube Video ID (YouTube 전용)",
  "duration": "영상 길이 (YouTube 전용)",
  "channelTitle": "채널명 (YouTube 전용)",
  "contentPreview": "문서 미리보기 텍스트 (document 전용)"
}
*/

-- 4. 메타데이터 유효성 검증 함수 (선택사항)
CREATE OR REPLACE FUNCTION validate_content_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- YouTube 콘텐츠의 경우 필수 필드 검증
  IF NEW.type = 'link' AND NEW.metadata->>'platform' = 'youtube' THEN
    IF NEW.metadata->>'videoId' IS NULL OR NEW.metadata->>'videoId' = '' THEN
      RAISE EXCEPTION 'YouTube content must have videoId in metadata';
    END IF;
  END IF;
  
  -- 메타데이터 크기 제한 (1MB)
  IF pg_column_size(NEW.metadata) > 1048576 THEN
    RAISE EXCEPTION 'Metadata size exceeds 1MB limit';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. 트리거 추가 (선택사항)
CREATE TRIGGER content_metadata_validation
  BEFORE INSERT OR UPDATE ON content_items
  FOR EACH ROW
  EXECUTE FUNCTION validate_content_metadata();

-- 6. 메타데이터 통계를 위한 뷰 (분석용)
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

-- 7. 전체 텍스트 검색을 위한 인덱스 (검색 기능 향상)
CREATE INDEX IF NOT EXISTS idx_content_search_metadata 
ON content_items USING gin(to_tsvector('english', 
  COALESCE(title, '') || ' ' || 
  COALESCE(description, '') || ' ' || 
  COALESCE(metadata->>'title', '') || ' ' || 
  COALESCE(metadata->>'description', '')
));

-- 8. 기존 데이터 마이그레이션 (필요시)
-- 기존 메타데이터 구조를 새 구조로 변환하는 함수
CREATE OR REPLACE FUNCTION migrate_legacy_metadata()
RETURNS void AS $$
DECLARE
  item_record RECORD;
BEGIN
  FOR item_record IN 
    SELECT id, metadata, url, type FROM content_items 
    WHERE metadata IS NOT NULL
  LOOP
    -- 기존 메타데이터를 새 구조로 보강
    UPDATE content_items 
    SET metadata = metadata || jsonb_build_object(
      'platform', CASE 
        WHEN item_record.url ILIKE '%youtube.com%' OR item_record.url ILIKE '%youtu.be%' THEN 'youtube'
        WHEN item_record.url ILIKE '%naver.com%' THEN 'naver'
        WHEN item_record.url ILIKE '%tistory.com%' THEN 'tistory'
        WHEN item_record.url ILIKE '%github.com%' THEN 'github'
        ELSE 'web'
      END,
      'contentPreview', CASE 
        WHEN item_record.type = 'document' OR item_record.type = 'note' THEN 
          LEFT(COALESCE(item_record.metadata->>'description', ''), 300)
        ELSE NULL
      END
    )
    WHERE id = item_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 마이그레이션 실행 (주석 해제하여 사용)
-- SELECT migrate_legacy_metadata();

-- 9. 메타데이터 성능 모니터링 쿼리
/*
-- 메타데이터가 있는 콘텐츠 비율
SELECT 
  type,
  COUNT(*) as total_items,
  COUNT(CASE WHEN metadata IS NOT NULL AND metadata != '{}'::jsonb THEN 1 END) as with_metadata,
  ROUND(
    COUNT(CASE WHEN metadata IS NOT NULL AND metadata != '{}'::jsonb THEN 1 END) * 100.0 / COUNT(*), 2
  ) as metadata_percentage
FROM content_items
GROUP BY type
ORDER BY metadata_percentage DESC;

-- 플랫폼별 메타데이터 품질
SELECT 
  metadata->>'platform' as platform,
  COUNT(*) as total,
  COUNT(CASE WHEN metadata->>'title' IS NOT NULL THEN 1 END) as with_title,
  COUNT(CASE WHEN metadata->>'image' IS NOT NULL THEN 1 END) as with_image,
  COUNT(CASE WHEN metadata->>'description' IS NOT NULL THEN 1 END) as with_description
FROM content_items 
WHERE metadata->>'platform' IS NOT NULL
GROUP BY metadata->>'platform'
ORDER BY total DESC;
*/

COMMENT ON TABLE content_items IS '향상된 메타데이터 시스템을 지원하는 콘텐츠 아이템 테이블';
COMMENT ON COLUMN content_items.metadata IS 'JSON 형태의 향상된 메타데이터 (title, description, image, platform, videoId, duration 등)';