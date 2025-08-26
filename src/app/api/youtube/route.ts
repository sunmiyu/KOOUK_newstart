import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // YouTube Video ID 추출
    const videoId = extractYouTubeVideoId(url)
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
    }

    // YouTube API 키가 없는 경우 폴백 데이터 반환
    if (!process.env.YOUTUBE_API_KEY) {
      return NextResponse.json({
        videoId,
        title: `YouTube Video ${videoId}`,
        description: '',
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        channelTitle: '',
        duration: '',
        publishedAt: '',
        url: url
      })
    }

    // YouTube Data API v3 호출
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,contentDetails,statistics`
    
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error('YouTube API request failed')
    }

    const data = await response.json()
    
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const video = data.items[0]
    const snippet = video.snippet
    const contentDetails = video.contentDetails
    
    // Duration 파싱 (PT4M13S -> 4:13 형식)
    const duration = parseDuration(contentDetails.duration)
    
    // 썸네일 우선순위: maxres > high > medium > default
    const thumbnails = snippet.thumbnails
    const thumbnail = 
      thumbnails.maxresdefault?.url ||
      thumbnails.high?.url ||
      thumbnails.medium?.url ||
      thumbnails.default?.url ||
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`

    return NextResponse.json({
      videoId,
      title: snippet.title || '',
      description: snippet.description || '',
      thumbnail,
      channelTitle: snippet.channelTitle || '',
      duration,
      publishedAt: snippet.publishedAt || '',
      viewCount: video.statistics?.viewCount || '0',
      url: url
    })

  } catch (error) {
    console.error('YouTube API error:', error)
    
    // 에러 시 폴백 데이터 반환
    const url_param = new URL(request.url).searchParams.get('url')
    const videoId = url_param ? extractYouTubeVideoId(url_param) : null
    
    if (videoId) {
      return NextResponse.json({
        videoId,
        title: `YouTube Video ${videoId}`,
        description: '',
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        channelTitle: '',
        duration: '',
        publishedAt: '',
        url: url_param
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch YouTube data' }, 
      { status: 500 }
    )
  }
}

// YouTube Video ID 추출 함수
function extractYouTubeVideoId(url: string): string | null {
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

// YouTube Duration 파싱 (PT4M13S -> 4:13)
function parseDuration(duration: string): string {
  try {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return ''

    const hours = parseInt(match[1] || '0')
    const minutes = parseInt(match[2] || '0')
    const seconds = parseInt(match[3] || '0')

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  } catch {
    return ''
  }
}