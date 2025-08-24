import { ContentItem } from '@/types/folder'
import crypto from 'crypto'

export function generateContentHash(items: ContentItem[]): string {
  const sortedItems = items
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(item => ({
      id: item.id,
      title: item.title,
      type: item.type,
      url: item.url,
      content: item.content
    }))

  const hashInput = JSON.stringify(sortedItems)
  return crypto.createHash('sha256').update(hashInput).digest('hex')
}

export function detectChanges(oldItems: ContentItem[], newItems: ContentItem[]) {
  const oldIds = new Set(oldItems.map(item => item.id))
  const newIds = new Set(newItems.map(item => item.id))
  
  const added = newItems.filter(item => !oldIds.has(item.id))
  const removed = oldItems.filter(item => !newIds.has(item.id))
  
  const modified = newItems.filter(newItem => {
    const oldItem = oldItems.find(old => old.id === newItem.id)
    if (!oldItem) return false
    
    return (
      oldItem.title !== newItem.title ||
      oldItem.content !== newItem.content ||
      oldItem.url !== newItem.url
    )
  })
  
  return {
    added_items: added.map(item => item.id),
    removed_items: removed.map(item => item.id),
    modified_items: modified.map(item => item.id),
    has_changes: added.length > 0 || removed.length > 0 || modified.length > 0
  }
}

export function generateChangesSummary(changes: ReturnType<typeof detectChanges>): string {
  const parts: string[] = []
  
  if (changes.added_items.length > 0) {
    parts.push(`${changes.added_items.length}개 추가`)
  }
  
  if (changes.modified_items.length > 0) {
    parts.push(`${changes.modified_items.length}개 수정`)
  }
  
  if (changes.removed_items.length > 0) {
    parts.push(`${changes.removed_items.length}개 삭제`)
  }
  
  return parts.length > 0 ? parts.join(', ') : '변경사항 없음'
}