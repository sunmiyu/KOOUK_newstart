// Mock 데이터 분리 - my-folder 페이지 번들 크기 최적화
import { Folder, ContentItem } from '@/types/folder'

export const initialFolders: Folder[] = [
  {
    id: '1',
    name: 'React 개발 자료',
    user_id: 'user1',
    is_shared: false,
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    item_count: 5,
    shared_status: 'private'
  },
  {
    id: '2',
    name: '맛집 & 여행',
    user_id: 'user1',
    is_shared: false,
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    item_count: 4,
    shared_status: 'shared-synced'
  }
]

// 대용량 mock 데이터는 별도 파일로 분리하여 dynamic import 사용
export const loadMockContentItems = async (): Promise<ContentItem[]> => {
  // 실제 사용 시에만 로드 (lazy loading)
  const { mockContentItems } = await import('./mockContentItems')
  return mockContentItems
}