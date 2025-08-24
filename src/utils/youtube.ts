/**
 * YouTube 관련 유틸리티 함수들
 */

export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null
}

export function getYouTubeThumbnail(url: string): string | null {
  const videoId = extractYouTubeVideoId(url)
  if (!videoId) return null
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
}

export function getYouTubeThumbnails(url: string) {
  const videoId = extractYouTubeVideoId(url)
  if (!videoId) return null

  return {
    default: `https://img.youtube.com/vi/${videoId}/default.jpg`, // 120x90
    medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, // 320x180
    high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, // 480x360
    standard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`, // 640x480
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` // 1280x720
  }
}

export async function getYouTubeMetadata(url: string) {
  const videoId = extractYouTubeVideoId(url)
  if (!videoId) return null

  try {
    const response = await fetch(`/api/youtube?url=${encodeURIComponent(url)}`)
    if (!response.ok) {
      return {
        videoId,
        title: `YouTube Video ${videoId}`,
        thumbnail: getYouTubeThumbnail(url),
        url
      }
    }

    const data = await response.json()
    
    return {
      videoId,
      title: data.title || `YouTube Video ${videoId}`,
      description: data.description,
      thumbnail: data.thumbnail || getYouTubeThumbnail(url),
      channelTitle: data.channelTitle,
      duration: data.duration,
      publishedAt: data.publishedAt,
      url
    }
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error)
    return {
      videoId,
      title: `YouTube Video ${videoId}`,
      thumbnail: getYouTubeThumbnail(url),
      url
    }
  }
}