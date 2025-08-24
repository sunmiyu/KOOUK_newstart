import { Folder, MarketplaceFolder, ShareOptions, ContentItem, FolderVersionHistory } from '@/types/folder'
import { generateContentHash, detectChanges, generateChangesSummary } from '@/utils/contentHash'

export class FolderSharingService {
  
  static async shareFolder(
    folder: Folder & { items: ContentItem[] }, 
    shareOptions: ShareOptions
  ): Promise<{ success: boolean; message: string; version?: MarketplaceFolder }> {
    try {
      // 1. 현재 폴더 상태 스냅샷
      const contentHash = generateContentHash(folder.items)
      
      // 2. 중복 확인 (같은 내용이면 공유 스킵)
      const existingVersion = await this.getActiveMarketplaceVersion(folder.id)
      if (existingVersion?.content_hash === contentHash) {
        return { success: false, message: "이미 최신 버전입니다 ✅" }
      }
      
      // 3. 새 버전 생성
      const newVersion = await this.createMarketplaceVersion({
        original_folder_id: folder.id,
        snapshot_data: {
          name: folder.name,
          description: shareOptions.description || folder.description || '',
          items: this.deepCopyItems(folder.items), // 완전히 분리된 복사본
          item_count: folder.items.length,
          created_at: folder.created_at
        },
        version_number: (existingVersion?.version_number || 0) + 1,
        content_hash: contentHash,
        is_active: true,
        can_rollback: true,
        category: shareOptions.category,
        tags: shareOptions.tags,
        price: shareOptions.price,
        cover_image: shareOptions.cover_image,
        downloads: 0,
        likes: 0,
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      
      // 4. 이전 버전 비활성화
      if (existingVersion) {
        await this.deactivateVersion(existingVersion.id)
      }
      
      // 5. 원본 폴더 상태 업데이트
      await this.updateFolderSharingStatus(folder.id, {
        shared_version_id: newVersion.id,
        last_shared_at: new Date().toISOString(),
        shared_status: 'shared-synced'
      })
      
      return { success: true, message: "성공적으로 공유되었습니다! 🎉", version: newVersion }
    } catch (error) {
      console.error('폴더 공유 중 오류:', error)
      return { success: false, message: "공유 중 오류가 발생했습니다." }
    }
  }
  
  static async checkSyncStatus(folder: Folder & { items: ContentItem[] }): Promise<Folder['shared_status']> {
    const sharedVersion = await this.getActiveMarketplaceVersion(folder.id)
    
    if (!sharedVersion) {
      return 'private'
    }
    
    const currentHash = generateContentHash(folder.items)
    const sharedHash = sharedVersion.content_hash
    
    return currentHash === sharedHash ? 'shared-synced' : 'shared-outdated'
  }
  
  static async addToMyFolder(
    marketplaceFolderId: string, 
    userId: string
  ): Promise<{ success: boolean; folder?: Folder }> {
    try {
      const marketplaceFolder = await this.getMarketplaceFolder(marketplaceFolderId)
      
      if (!marketplaceFolder) {
        return { success: false }
      }
      
      // 1. 스냅샷 데이터로 새 폴더 생성
      const newFolder = await this.createFolder({
        name: `${marketplaceFolder.snapshot_data.name} (from Marketplace)`,
        description: marketplaceFolder.snapshot_data.description,
        user_id: userId,
        items: this.deepCopyItems(marketplaceFolder.snapshot_data.items),
        shared_status: 'private',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source_marketplace_id: marketplaceFolderId // 출처 추적
      })
      
      // 2. 다운로드 수 증가
      await this.incrementDownloadCount(marketplaceFolderId)
      
      return { success: true, folder: newFolder }
    } catch (error) {
      console.error('폴더 가져오기 중 오류:', error)
      return { success: false }
    }
  }
  
  static async getChangesPreview(folderId: string): Promise<{
    hasChanges: boolean
    summary: string
    details: ReturnType<typeof detectChanges>
  }> {
    try {
      const currentFolder = await this.getFolder(folderId)
      const sharedVersion = await this.getActiveMarketplaceVersion(folderId)
      
      if (!currentFolder || !sharedVersion) {
        return { hasChanges: false, summary: '변경사항 없음', details: { added_items: [], removed_items: [], modified_items: [], has_changes: false } }
      }
      
      const changes = detectChanges(sharedVersion.snapshot_data.items, currentFolder.items)
      const summary = generateChangesSummary(changes)
      
      return {
        hasChanges: changes.has_changes,
        summary,
        details: changes
      }
    } catch (error) {
      console.error('변경사항 확인 중 오류:', error)
      return { hasChanges: false, summary: '확인 불가', details: { added_items: [], removed_items: [], modified_items: [], has_changes: false } }
    }
  }
  
  // 유틸리티 메서드들
  private static deepCopyItems(items: ContentItem[]): ContentItem[] {
    return JSON.parse(JSON.stringify(items))
  }
  
  // 임시 구현 - 실제로는 데이터베이스 호출
  private static async getActiveMarketplaceVersion(folderId: string): Promise<MarketplaceFolder | null> {
    // TODO: 실제 데이터베이스 구현
    return null
  }
  
  private static async createMarketplaceVersion(data: Omit<MarketplaceFolder, 'id'>): Promise<MarketplaceFolder> {
    // TODO: 실제 데이터베이스 구현
    return { ...data, id: Math.random().toString(36) } as MarketplaceFolder
  }
  
  private static async deactivateVersion(versionId: string): Promise<void> {
    // TODO: 실제 데이터베이스 구현
    console.log(`Deactivating version: ${versionId}`)
  }
  
  private static async updateFolderSharingStatus(
    folderId: string, 
    updates: Pick<Folder, 'shared_version_id' | 'last_shared_at' | 'shared_status'>
  ): Promise<void> {
    // TODO: 실제 데이터베이스 구현
    console.log(`Updating folder ${folderId} sharing status:`, updates)
  }
  
  private static async getMarketplaceFolder(id: string): Promise<MarketplaceFolder | null> {
    // TODO: 실제 데이터베이스 구현
    return null
  }
  
  private static async createFolder(data: any): Promise<Folder> {
    // TODO: 실제 데이터베이스 구현
    return { ...data, id: Math.random().toString(36) } as Folder
  }
  
  private static async incrementDownloadCount(marketplaceFolderId: string): Promise<void> {
    // TODO: 실제 데이터베이스 구현
    console.log(`Incrementing download count for: ${marketplaceFolderId}`)
  }
  
  private static async getFolder(id: string): Promise<(Folder & { items: ContentItem[] }) | null> {
    // TODO: 실제 데이터베이스 구현
    return null
  }
}

export const VERSION_POLICY = {
  MAX_VERSIONS: 3,              // 최대 3개 버전 유지
  AUTO_DELETE_DAYS: 90,         // 90일 후 자동 삭제
  ROLLBACK_LIMIT_DAYS: 30,      // 30일 내 롤백만 허용
  COMPRESS_OLD_VERSIONS: true   // 구 버전 압축 저장
}