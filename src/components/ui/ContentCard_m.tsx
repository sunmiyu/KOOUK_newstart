'use client'

import { ContentItem } from '@/types/folder'
import { isYouTubeUrl } from '@/utils/youtube'
import { getDomainInfo } from '@/utils/enhancedMetadata'
import { useState } from 'react'
import Image from 'next/image'

interface ContentCardMobileProps {
  item: ContentItem
  onEdit?: (item: ContentItem) => void
  onDelete?: (item: ContentItem) => void
}

export default function ContentCardMobile({ item, onEdit, onDelete }: ContentCardMobileProps) {
  const [imageError, setImageError] = useState(false)
  
  const getThumbnail = () => {
    const thumbnail = (typeof item.metadata?.thumbnail === 'string' ? item.metadata.thumbnail : '') || 
                     item.thumbnail || 
                     (typeof item.metadata?.image === 'string' ? item.metadata.image : '')
    
    // 모바일용 더 작은 썸네일
    if (thumbnail && !imageError) {
      return (
        <div className="w-full h-24 mb-2 rounded-lg overflow-hidden bg-gray-100 relative">
          <Image
            src={thumbnail}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            onError={() => setImageError(true)}
            unoptimized
          />
          {/* YouTube 모바일 재생 아이콘 */}
          {isYouTubeUrl(item.url || '') && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      )
    }
    
    return null
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      {/* 모바일: 썸네일이 위에 */}
      {getThumbnail()}
      
      {/* 모바일: 컨텐츠 정보 */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
            {item.title}
          </h3>
          
          {/* 모바일: 더 작은 메뉴 버튼 */}
          <div className="flex space-x-1 ml-2">
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 모바일: 간단한 설명 */}
        {item.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* 모바일: 타입 및 도메인 정보 */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            {/* 타입 아이콘 */}
            {item.type === 'link' && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              </svg>
            )}
            {item.type === 'note' && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
              </svg>
            )}
            <span className="capitalize">{item.type}</span>
          </div>
          
          {/* 도메인 */}
          {item.url && typeof item.metadata?.domain === 'string' && (
            <span className="truncate max-w-20">
              {item.metadata.domain}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}