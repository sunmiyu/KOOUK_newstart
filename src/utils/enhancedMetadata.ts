// 향상된 메타데이터 유틸리티
export interface EnhancedMetadata {
  title: string
  description: string
  image: string
  url: string
  domain: string
  platform: string
  favicon: string
  contentPreview?: string
  videoId?: string // YouTube용
  duration?: string // YouTube용
  channelTitle?: string // YouTube용
}

export async function fetchEnhancedMetadata(url: string): Promise<EnhancedMetadata | null> {
  try {
    const response = await fetch('/api/metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      console.error('Failed to fetch metadata:', response.statusText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching enhanced metadata:', error)
    return null
  }
}

export function isYouTubeUrl(url: string): boolean {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)/
  ]
  
  return patterns.some(pattern => pattern.test(url))
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string.startsWith('http') ? string : `https://${string}`)
    return true
  } catch {
    return false
  }
}

// 도메인별 특별 처리 정보
export interface DomainInfo {
  name: string
  color: string
  icon: string
  specialHandling?: boolean
}

export function getDomainInfo(url: string): DomainInfo | null {
  if (!url) return null
  
  try {
    const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.toLowerCase()
    
    const domainMap: Record<string, DomainInfo> = {
      'youtube.com': { name: 'YouTube', color: 'bg-red-600', icon: '▶️', specialHandling: true },
      'youtu.be': { name: 'YouTube', color: 'bg-red-600', icon: '▶️', specialHandling: true },
      'github.com': { name: 'GitHub', color: 'bg-gray-800', icon: '🐙', specialHandling: true },
      'naver.com': { name: 'Naver', color: 'bg-green-600', icon: 'N', specialHandling: true },
      'blog.naver.com': { name: 'Naver Blog', color: 'bg-green-600', icon: '📝', specialHandling: true },
      'cafe.naver.com': { name: 'Naver Cafe', color: 'bg-orange-600', icon: '☕', specialHandling: true },
      'tistory.com': { name: 'Tistory', color: 'bg-orange-500', icon: 'T', specialHandling: true },
      'medium.com': { name: 'Medium', color: 'bg-black', icon: 'M', specialHandling: true },
      'twitter.com': { name: 'Twitter', color: 'bg-blue-500', icon: '🐦', specialHandling: true },
      'x.com': { name: 'X', color: 'bg-black', icon: 'X', specialHandling: true },
      'reddit.com': { name: 'Reddit', color: 'bg-orange-600', icon: '👽', specialHandling: true },
      'stackoverflow.com': { name: 'Stack Overflow', color: 'bg-orange-500', icon: '📚', specialHandling: true },
      'notion.so': { name: 'Notion', color: 'bg-gray-900', icon: '📋', specialHandling: true },
    }
    
    // 정확한 호스트명 매칭
    if (domainMap[hostname]) {
      return domainMap[hostname]
    }
    
    // 서브도메인 매칭 (예: *.tistory.com)
    for (const [domain, info] of Object.entries(domainMap)) {
      if (hostname.endsWith(domain) && hostname !== domain) {
        return info
      }
    }
    
    // 기본 정보 반환
    const domainInitial = hostname.split('.')[0].charAt(0).toUpperCase()
    const colorIndex = domainInitial.charCodeAt(0) % 10
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
      'bg-yellow-500', 'bg-red-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
    ]
    
    return {
      name: hostname.replace('www.', ''),
      color: colors[colorIndex],
      icon: domainInitial,
      specialHandling: false
    }
    
  } catch {
    return null
  }
}

// 컨텐츠 타입별 아이콘
export function getContentTypeIcon(type: string): string {
  const iconMap: Record<string, string> = {
    'link': '🔗',
    'url': '🔗',
    'youtube': '📹',
    'image': '🖼️',
    'note': '📝',
    'memo': '📝',
    'document': '📄',
    'pdf': '📄',
    'folder': '📁'
  }
  
  return iconMap[type.toLowerCase()] || '📄'
}

// 플랫폼별 색상
export function getPlatformColor(platform: string): string {
  const colorMap: Record<string, string> = {
    'youtube': 'bg-red-50 border-red-200',
    'github': 'bg-gray-50 border-gray-200', 
    'naver': 'bg-green-50 border-green-200',
    'tistory': 'bg-orange-50 border-orange-200',
    'medium': 'bg-gray-50 border-gray-200',
    'twitter': 'bg-blue-50 border-blue-200',
    'reddit': 'bg-orange-50 border-orange-200',
    'web': 'bg-blue-50 border-blue-200'
  }
  
  return colorMap[platform.toLowerCase()] || 'bg-gray-50 border-gray-200'
}