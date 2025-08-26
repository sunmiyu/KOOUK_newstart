import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // URL 유효성 검사 및 정규화
    let validUrl: URL
    try {
      // http:// 또는 https://가 없으면 https:// 추가
      const processedUrl = url.startsWith('http') ? url : `https://${url}`
      validUrl = new URL(processedUrl)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // YouTube URL 특별 처리 (YouTube API 호출)
    const hostname = validUrl.hostname.toLowerCase()
    if (hostname.includes('youtube.com') || hostname === 'youtu.be') {
      try {
        const youtubeResponse = await fetch(`${request.nextUrl.origin}/api/youtube?url=${encodeURIComponent(validUrl.toString())}`)
        if (youtubeResponse.ok) {
          const youtubeData = await youtubeResponse.json()
          return NextResponse.json({
            title: youtubeData.title || 'YouTube Video',
            description: youtubeData.description || '',
            image: youtubeData.thumbnail || '',
            url: validUrl.toString(),
            domain: validUrl.hostname,
            platform: 'youtube',
            favicon: 'https://www.youtube.com/favicon.ico'
          })
        }
      } catch (error) {
        console.error('YouTube API failed:', error)
      }
    }

    // 웹페이지 메타데이터 스크래핑
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
      },
      signal: AbortSignal.timeout(15000), // 15초 타임아웃
      redirect: 'follow'
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 400 })
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // 메타데이터 초기화
    const metadata = {
      title: '',
      description: '',
      image: '',
      url: validUrl.toString(),
      domain: validUrl.hostname,
      platform: 'web',
      favicon: '',
      contentPreview: ''
    }

    // 🎯 제목 추출 (우선순위별)
    metadata.title = 
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('meta[name="title"]').attr('content') ||
      $('title').text() ||
      $('h1').first().text() ||
      ''

    // 🌐 플랫폼별 특화 제목 추출
    if (hostname.includes('naver.com')) {
      // 네이버 블로그/카페 제목
      const naverTitle = 
        $('.se-title-text').text() ||
        $('.ArticleContentBox .title_text').text() ||
        $('.article_header .title').text() ||
        $('.tit').text() ||
        $('h3.title_text').text() ||
        $('.se-main-container h1, .se-main-container h2, .se-main-container h3').first().text()
      
      if (naverTitle) metadata.title = naverTitle.trim()
    } else if (hostname.includes('tistory.com')) {
      // 티스토리 블로그 제목
      const tistoryTitle = 
        $('.article-view .title').text() ||
        $('.entry-title').text() ||
        $('.titleWrap .title').text()
        
      if (tistoryTitle) metadata.title = tistoryTitle.trim()
    }

    // 📝 설명 추출
    metadata.description = 
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="abstract"]').attr('content') ||
      ''

    // 🖼️ 이미지 추출 (플랫폼별 최적화)
    let imageUrl = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      ''

    // 네이버 블로그/카페 특화 이미지 추출
    if (!imageUrl && hostname.includes('naver.com')) {
      const naverImage = 
        $('.se-main-container img').first().attr('src') ||
        $('.se-component-image img').first().attr('src') ||
        $('._img').first().attr('src') ||
        $('img[src*="blogfiles.naver.net"]').first().attr('src') ||
        $('img[src*="pstatic.net"]').first().attr('src') ||
        $('.article_viewer img').first().attr('src')
      
      if (naverImage) imageUrl = naverImage
    }

    // 일반 사이트 이미지 폴백
    if (!imageUrl) {
      imageUrl = $('img[src*="http"]').first().attr('src') || ''
    }

    // 이미지 URL 정규화
    if (imageUrl) {
      try {
        if (imageUrl.startsWith('//')) {
          imageUrl = validUrl.protocol + imageUrl
        } else if (imageUrl.startsWith('/')) {
          imageUrl = validUrl.origin + imageUrl
        } else if (!imageUrl.startsWith('http')) {
          imageUrl = new URL(imageUrl, validUrl.toString()).toString()
        }
        metadata.image = imageUrl
      } catch {
        metadata.image = ''
      }
    }

    // 🌟 파비콘 추출
    const favicon = 
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href') ||
      '/favicon.ico'

    if (favicon) {
      try {
        if (favicon.startsWith('//')) {
          metadata.favicon = validUrl.protocol + favicon
        } else if (favicon.startsWith('/')) {
          metadata.favicon = validUrl.origin + favicon
        } else if (!favicon.startsWith('http')) {
          metadata.favicon = new URL(favicon, validUrl.toString()).toString()
        } else {
          metadata.favicon = favicon
        }
      } catch {
        metadata.favicon = `${validUrl.origin}/favicon.ico`
      }
    }

    // 📄 콘텐츠 미리보기 (문서용 - 처음 2-3줄)
    const contentText = $('p, .content, .article-content, .post-content, .se-main-container')
      .first()
      .text()
      .trim()
      .slice(0, 300) // 처음 300자

    if (contentText) {
      metadata.contentPreview = contentText
    }

    // 🧹 텍스트 정리
    metadata.title = cleanText(metadata.title)
    metadata.description = cleanText(metadata.description)

    // 제목이 너무 길면 자르기
    if (metadata.title.length > 100) {
      metadata.title = metadata.title.substring(0, 97) + '...'
    }

    // 설명이 너무 길면 자르기  
    if (metadata.description.length > 200) {
      metadata.description = metadata.description.substring(0, 197) + '...'
    }

    return NextResponse.json(metadata)

  } catch (error) {
    console.error('Metadata extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to extract metadata' }, 
      { status: 500 }
    )
  }
}

// 텍스트 정리 유틸리티 함수
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/♦+/g, '')
    .replace(/[^\x20-\x7E\xA0-\uFFFF]/g, '')
    .trim()
}