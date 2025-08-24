import { NextRequest, NextResponse } from 'next/server'
import { extractYouTubeVideoId } from '@/utils/youtube'

// 안전한 HTML 엔티티 디코딩 함수
function decodeHTMLEntities(text: string): string {
  if (!text) return ''
  
  const entityMap: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<', 
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' '
  }
  
  let decoded = text
  
  for (const [entity, char] of Object.entries(entityMap)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char)
  }
  
  return decoded.trim()
}

// HTML 스크래핑으로 YouTube 제목 추출
async function scrapeYouTubeTitle(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    
    if (!response.ok) throw new Error('Failed to fetch')
    
    const html = await response.text()
    
    // ytInitialPlayerResponse에서 제목 추출
    const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/)
    if (playerResponseMatch) {
      try {
        const playerResponse = JSON.parse(playerResponseMatch[1])
        const title = playerResponse?.videoDetails?.title
        if (title) {
          return title
        }
      } catch {
        console.log('Failed to parse ytInitialPlayerResponse')
      }
    }
    
    // title 태그에서 추출
    const titleMatch = html.match(/<title>([^<]+)<\/title>/)
    if (titleMatch) {
      let title = titleMatch[1]
      title = title.replace(/ - YouTube$/, '')
      title = decodeHTMLEntities(title)
      
      if (title && title !== 'YouTube') {
        return title
      }
    }
    
    return null
  } catch (error) {
    console.error('YouTube scraping error:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    
    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
    }

    const videoId = extractYouTubeVideoId(url)
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
    }

    let videoInfo = {
      title: undefined as string | undefined,
      description: undefined as string | undefined,
      duration: undefined as string | undefined,
      channelTitle: undefined as string | undefined,
      publishedAt: undefined as string | undefined,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    }

    // 스크래핑으로 제목 가져오기
    const scrapedTitle = await scrapeYouTubeTitle(url)
    if (scrapedTitle) {
      videoInfo.title = scrapedTitle
    } else {
      videoInfo.title = `YouTube Video ${videoId}`
    }

    return NextResponse.json(videoInfo)
  } catch (error) {
    console.error('YouTube processing error:', error)
    return NextResponse.json({ error: 'Failed to fetch video information' }, { status: 500 })
  }
}