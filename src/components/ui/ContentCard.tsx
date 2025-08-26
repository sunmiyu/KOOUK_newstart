'use client'

import { ContentItem } from '@/types/folder'
import { isYouTubeUrl } from '@/utils/youtube'
import { getDomainInfo, getContentTypeIcon, getPlatformColor, EnhancedMetadata } from '@/utils/enhancedMetadata'
import { useState } from 'react'

interface ContentCardProps {
  item: ContentItem
  onEdit?: (item: ContentItem) => void
  onDelete?: (item: ContentItem) => void
}

export default function ContentCard({ item, onEdit, onDelete }: ContentCardProps) {
  const getIcon = () => {
    switch (item.type) {
      case 'link':
        if (isYouTubeUrl(item.url || '')) {
          return (
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          )
        }
        return (
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
        )
      case 'image':
        return (
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        )
      case 'note':
        return (
          <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
            <path d="M6 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
          </svg>
        )
      case 'document':
        return (
          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const getBackgroundColor = () => {
    switch (item.type) {
      case 'link':
        return isYouTubeUrl(item.url || '') ? 'bg-red-50' : 'bg-blue-50'
      case 'image':
        return 'bg-green-50'
      case 'note':
        return 'bg-yellow-50'
      case 'document':
        return 'bg-purple-50'
      default:
        return 'bg-gray-50'
    }
  }

  const getThumbnail = () => {
    // 향상된 썸네일 로직
    const [imageError, setImageError] = useState(false)
    const thumbnail = item.metadata?.thumbnail || item.thumbnail || item.metadata?.image
    const domainInfo = getDomainInfo(item.url || item.metadata?.domain || '')
    
    // 1순위: 실제 썸네일이 있고 로드 에러가 없는 경우
    if (thumbnail && !imageError) {
      return (
        <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100 relative">
          <img
            src={thumbnail}
            alt={item.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          {/* YouTube 영상 재생 아이콘 */}
          {isYouTubeUrl(item.url || '') && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      )
    }

    // 2순위: YouTube URL인 경우 플랫폼 특화 프리뷰
    if (isYouTubeUrl(item.url || '')) {
      return (
        <div className="w-full h-32 mb-3 rounded-lg flex items-center justify-center bg-red-600 text-white relative">
          <div className="text-center">
            <div className="text-4xl mb-2">▶️</div>
            <div className="text-sm font-semibold">YouTube Video</div>
            <div className="text-xs opacity-75 mt-1">{item.metadata?.domain || 'youtube.com'}</div>
          </div>
        </div>
      )
    }

    // 3순위: 링크인 경우 도메인 기반 프리뷰
    if (item.type === 'link' && domainInfo) {
      return (
        <div className={`w-full h-32 mb-3 rounded-lg flex items-center justify-center ${domainInfo.color} text-white relative`}>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{domainInfo.icon}</div>
            <div className="text-sm font-semibold">{domainInfo.name}</div>
            <div className="text-xs opacity-75 mt-1">{item.metadata?.domain || 'Web Link'}</div>
          </div>
        </div>
      )
    }

    // 4순위: 문서인 경우 내용 미리보기
    if (item.type === 'document' || item.type === 'note') {
      return (
        <div className="w-full h-32 mb-3 rounded-lg border-2 border-dashed border-gray-300 bg-white p-3">
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getContentTypeIcon(item.type)}</span>
              <span className="text-xs text-gray-500 font-medium uppercase">{item.type}</span>
            </div>
            <div className="text-xs text-gray-700 line-clamp-6 flex-1 leading-relaxed">
              {item.description || item.content || item.title || 'No preview available'}
            </div>
          </div>
        </div>
      )
    }

    // 5순위: 기본 타입별 아이콘 (기존 로직)
    return (
      <div className={`w-full h-32 mb-3 rounded-lg flex items-center justify-center ${getBackgroundColor()}`}>
        <div className="text-4xl opacity-50">
          {getContentTypeIcon(item.type)}
        </div>
      </div>
    )
  }

  const handleClick = () => {
    if (item.type === 'link' && item.url) {
      window.open(item.url, '_blank')
    } else if (onEdit) {
      onEdit(item)
    }
  }

  return (
    <div 
      className={`bg-white rounded-lg border hover:shadow-md transition-all cursor-pointer group ${getPlatformColor(item.metadata?.platform || item.type)}`}
      onClick={handleClick}
    >
      {/* 향상된 썸네일 */}
      {getThumbnail()}

      <div className="p-4">
        {/* 향상된 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start min-w-0 flex-1 gap-2">
            {/* 플랫폼 아이콘 */}
            <div className="flex-shrink-0 mt-0.5">
              <span className="text-sm">{getContentTypeIcon(item.type)}</span>
            </div>
            
            <div className="min-w-0 flex-1">
              {/* 제목 */}
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 leading-tight">
                {item.title}
              </h3>
              
              {/* 도메인 + 추가 메타정보 */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {item.metadata?.domain && (
                  <span className="truncate">{item.metadata.domain}</span>
                )}
                
                {/* YouTube 특화 정보 */}
                {isYouTubeUrl(item.url || '') && item.metadata?.channelTitle && (
                  <>
                    <span>•</span>
                    <span className="truncate">{item.metadata.channelTitle}</span>
                  </>
                )}
                
                {/* 유튜브 재생시간 */}
                {item.metadata?.duration && (
                  <>
                    <span>•</span>
                    <span className="text-red-600 font-medium">{item.metadata.duration}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 ml-2 flex-shrink-0">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(item)
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="편집"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`"${item.title}"을(를) 삭제하시겠습니까?`)) {
                    onDelete(item)
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="삭제"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 향상된 설명 */}
        {(item.description || item.metadata?.description || item.content) && (
          <p className="text-xs text-gray-600 line-clamp-3 mb-3 leading-relaxed">
            {item.description || item.metadata?.description || 
             (item.content ? item.content.substring(0, 150) + (item.content.length > 150 ? '...' : '') : '')}
          </p>
        )}

        {/* 향상된 메타정보 */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="capitalize px-2 py-1 bg-gray-100 rounded-full text-gray-600 font-medium">
              {item.type}
            </span>
            
            {/* 추가 뱃지들 */}
            {isYouTubeUrl(item.url || '') && (
              <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full font-medium">
                Video
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span>{new Date(item.created_at).toLocaleDateString()}</span>
            {item.url && (
              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}