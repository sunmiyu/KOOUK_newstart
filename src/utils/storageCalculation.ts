import { ContentItem, ContentItemSize, UserUsage, UserPlan, PLAN_LIMITS } from '@/types/folder'

export class StorageCalculator {
  
  // 보수적 접근: 모든 데이터를 실제보다 크게 계산
  static calculateItemSize(item: ContentItem): ContentItemSize {
    let sizeBytes = 0
    let calculationMethod: ContentItemSize['calculation_method']
    
    switch (item.type) {
      case 'link':
        // URL 링크: 메타데이터 + 썸네일 예상 크기
        sizeBytes += this.calculateTextSize(item.title || '')
        sizeBytes += this.calculateTextSize(item.description || '')
        sizeBytes += this.calculateTextSize(item.url || '')
        
        // 썸네일이 있다면 보수적으로 500KB 추가 (실제로는 더 작을 수 있음)
        if (item.thumbnail || item.metadata?.thumbnail) {
          sizeBytes += 500 * 1024 // 500KB
        }
        
        // 메타데이터 JSON 크기 (보수적으로 50KB)
        if (item.metadata) {
          sizeBytes += 50 * 1024
        }
        
        calculationMethod = 'url_metadata'
        break
        
      case 'note':
        // 텍스트 노트: 실제 텍스트 크기 + 버퍼
        const textSize = this.calculateTextSize(item.content || '')
        sizeBytes = Math.max(textSize * 2, 1024) // 최소 1KB, 실제의 2배
        calculationMethod = 'text_content'
        break
        
      case 'image':
        // 이미지: 실제 업로드된 경우는 큰 크기, URL인 경우는 썸네일만
        if (item.url?.startsWith('http')) {
          sizeBytes = 500 * 1024 // URL 이미지: 500KB 썸네일 예상
        } else {
          sizeBytes = 5 * 1024 * 1024 // 업로드 이미지: 5MB 예상 (보수적)
        }
        calculationMethod = 'thumbnail'
        break
        
      case 'document':
        // 문서: 실제 파일인 경우와 URL인 경우 구분
        if (item.url?.startsWith('http')) {
          sizeBytes = 100 * 1024 // URL 문서: 100KB 메타데이터
        } else {
          sizeBytes = 10 * 1024 * 1024 // 업로드 문서: 10MB 예상 (보수적)
        }
        calculationMethod = 'file_upload'
        break
        
      default:
        sizeBytes = 10 * 1024 // 기본 10KB
        calculationMethod = 'text_content'
    }
    
    // 기본 아이템 오버헤드 추가 (DB 저장, 인덱싱 등)
    sizeBytes += 5 * 1024 // 5KB 오버헤드
    
    return {
      item_id: item.id,
      type: item.type,
      size_bytes: sizeBytes,
      calculation_method: calculationMethod
    }
  }
  
  // 텍스트 크기 계산 (UTF-8 기준, 보수적)
  private static calculateTextSize(text: string): number {
    // UTF-8에서 한글은 3바이트, 영문은 1바이트
    // 보수적으로 평균 2.5바이트로 계산
    return Math.ceil(text.length * 2.5)
  }
  
  // 폴더의 총 크기 계산
  static calculateFolderSize(items: ContentItem[]): number {
    return items.reduce((total, item) => {
      const itemSize = this.calculateItemSize(item)
      return total + itemSize.size_bytes
    }, 0)
  }
  
  // 사용자 전체 사용량 계산
  static async calculateUserUsage(
    userId: string, 
    folders: Array<{ items: ContentItem[] }>,
    marketplaceFolders: number,
    currentPlan: UserPlan
  ): Promise<UserUsage> {
    
    // 전체 스토리지 사용량 계산
    let totalStorageBytes = 0
    for (const folder of folders) {
      totalStorageBytes += this.calculateFolderSize(folder.items)
    }
    
    const limits = PLAN_LIMITS[currentPlan]
    const storageMB = Math.ceil(totalStorageBytes / (1024 * 1024))
    const storageUsagePercent = Math.min((storageMB / (limits.storage_limit_gb * 1024)) * 100, 100)
    const folderUsagePercent = Math.min((folders.length / limits.max_folders) * 100, 100)
    const marketplaceUsagePercent = Math.min((marketplaceFolders / limits.max_marketplace_folders) * 100, 100)
    
    return {
      user_id: userId,
      plan: currentPlan,
      current_storage_mb: storageMB,
      current_folders: folders.length,
      current_marketplace_folders: marketplaceFolders,
      limits,
      storage_usage_percent: Math.round(storageUsagePercent),
      folder_usage_percent: Math.round(folderUsagePercent),
      marketplace_usage_percent: Math.round(marketplaceUsagePercent),
      is_storage_warning: storageUsagePercent >= 90,
      is_storage_full: storageUsagePercent >= 100,
      is_folders_full: folders.length >= limits.max_folders,
      last_calculated_at: new Date().toISOString()
    }
  }
  
  // 새 아이템 추가 가능 여부 체크
  static canAddItem(usage: UserUsage, newItem: ContentItem): {
    canAdd: boolean
    reason?: string
    estimatedSize?: number
  } {
    const itemSize = this.calculateItemSize(newItem)
    const newSizeMB = itemSize.size_bytes / (1024 * 1024)
    const newTotalMB = usage.current_storage_mb + newSizeMB
    const newStoragePercent = (newTotalMB / (usage.limits.storage_limit_gb * 1024)) * 100
    
    if (newStoragePercent > 100) {
      return {
        canAdd: false,
        reason: `저장 공간이 부족합니다. (${Math.round(newSizeMB * 10) / 10}MB 추가 필요)`,
        estimatedSize: Math.round(newSizeMB * 10) / 10
      }
    }
    
    return {
      canAdd: true,
      estimatedSize: Math.round(newSizeMB * 10) / 10
    }
  }
  
  // 새 폴더 생성 가능 여부 체크
  static canCreateFolder(usage: UserUsage): {
    canCreate: boolean
    reason?: string
  } {
    if (usage.is_folders_full) {
      return {
        canCreate: false,
        reason: `폴더 개수 제한에 도달했습니다. (${usage.current_folders}/${usage.limits.max_folders})`
      }
    }
    
    return { canCreate: true }
  }
  
  // 마켓플레이스 공유 가능 여부 체크
  static canShareToMarketplace(usage: UserUsage, isPaidShare: boolean = false): {
    canShare: boolean
    reason?: string
  } {
    if (usage.current_marketplace_folders >= usage.limits.max_marketplace_folders) {
      return {
        canShare: false,
        reason: `마켓플레이스 공유 제한에 도달했습니다. (${usage.current_marketplace_folders}/${usage.limits.max_marketplace_folders})`
      }
    }
    
    if (isPaidShare && !usage.limits.can_sell_paid_folders) {
      return {
        canShare: false,
        reason: 'Pro 플랜에서만 유료 판매가 가능합니다.'
      }
    }
    
    return { canShare: true }
  }
  
  // 사용량을 보기 좋은 형태로 포맷팅
  static formatSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`
    } else if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024 * 10) / 10} KB`
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${Math.round(bytes / (1024 * 1024) * 10) / 10} MB`
    } else {
      return `${Math.round(bytes / (1024 * 1024 * 1024) * 10) / 10} GB`
    }
  }
}