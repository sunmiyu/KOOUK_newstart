import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // URL 유효성 검사
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // YouTube URL인 경우 YouTube API로 리다이렉트
    const hostname = validUrl.hostname.toLowerCase()
    if (hostname === 'youtube.com' || hostname === 'www.youtube.com' || hostname === 'youtu.be') {
      try {
        const youtubeResponse = await fetch(`${request.nextUrl.origin}/api/youtube?url=${encodeURIComponent(url)}`)
        if (youtubeResponse.ok) {
          const youtubeData = await youtubeResponse.json()
          return NextResponse.json({
            title: youtubeData.title || 'YouTube Video',
            description: youtubeData.description || '',
            image: youtubeData.thumbnail || '',
            url: validUrl.toString(),
            domain: validUrl.hostname
          })
        }
      } catch (error) {
        console.error('YouTube API call failed:', error)
      }
    }

    // 웹페이지 HTML 가져오기
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      signal: AbortSignal.timeout(10000) // 10초 타임아웃
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 400 })
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Meta 정보 추출
    const metadata = {
      title: '',
      description: '',
      image: '',
      url: validUrl.toString(),
      domain: validUrl.hostname
    }

    // 제목 추출
    let title = 
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      ''

    // 네이버 블로그 특화 처리 - 실제 포스트 제목 찾기
    if (hostname === 'blog.naver.com' || hostname.endsWith('.blog.naver.com')) {
      const naverTitle = 
        $('.se-title-text').text() ||              // 스마트 에디터 제목
        $('.se_title').text() ||                   // 구 버전 스마트 에디터
        $('.post-title').text() ||                 // 포스트 제목 클래스
        $('.post_title').text() ||                 // 대체 포스트 제목
        $('h1.post-title').text() ||               // h1 포스트 제목
        $('h2.post-title').text() ||               // h2 포스트 제목  
        $('h3.post-title').text() ||               // h3 포스트 제목
        $('.title_area h3').text() ||              // 제목 영역의 h3
        $('.title_area h2').text() ||              // 제목 영역의 h2
        $('.title_area h1').text() ||              // 제목 영역의 h1
        $('div[data-module="SE2M_title"] .se_title').text() ||  // SE2 모듈 제목
        $('.se-main-container .se-title-text').text()      // 메인 컨테이너 제목
      
      if (naverTitle && naverTitle.trim() && naverTitle !== title) {
        title = naverTitle.trim()
      }
    }
    
    // 티스토리 블로그 특화 처리
    else if (hostname.endsWith('.tistory.com') || hostname === 'tistory.com') {
      const tistoryTitle = 
        $('.entry-title').text() ||
        $('.post-title').text() ||
        $('h1.entry-title').text() ||
        $('h2.entry-title').text() ||
        $('.article-header h1').text() ||
        $('.article-header h2').text() ||
        $('.titleWrap .title').text()
      
      if (tistoryTitle && tistoryTitle.trim() && tistoryTitle !== title) {
        title = tistoryTitle.trim()
      }
    }
    
    // 브런치 특화 처리
    else if (hostname === 'brunch.co.kr') {
      const brunchTitle = 
        $('.wrap_view_article .cover_title').text() ||
        $('.article-title').text() ||
        $('h1.cover-title').text() ||
        $('.cover .title').text()
      
      if (brunchTitle && brunchTitle.trim() && brunchTitle !== title) {
        title = brunchTitle.trim()
      }
    }
    
    metadata.title = title

    // 설명 추출
    metadata.description = 
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      ''

    // 이미지 추출
    let imageUrl = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      ''

    // 네이버 블로그 특화 처리
    if (!imageUrl && (hostname === 'blog.naver.com' || hostname.endsWith('.blog.naver.com'))) {
      const naverImage = 
        $('.se-main-container img').first().attr('src') ||
        $('.se-component-image img').first().attr('src') ||
        $('._img').first().attr('src') ||
        $('img[src*="blogfiles.naver.net"]').first().attr('src') ||
        $('img[src*="pstatic.net"]').first().attr('src')
      
      if (naverImage) {
        imageUrl = naverImage
      }
    }

    // 일반 사이트 폴백
    if (!imageUrl) {
      imageUrl = $('img').first().attr('src') || ''
    }

    // 상대 URL을 절대 URL로 변환
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

    // 텍스트 정리
    metadata.title = metadata.title
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/&(?!amp;|lt;|gt;|quot;|#39;)amp;/g, '&')
      .replace(/&(?!lt;|gt;|quot;|#39;|amp;)lt;/g, '<')
      .replace(/&(?!gt;|quot;|#39;|amp;|lt;)gt;/g, '>')
      .replace(/&(?!quot;|#39;|amp;|lt;|gt;)quot;/g, '"')
      .replace(/&(?!#39;|amp;|lt;|gt;|quot;)#39;/g, "'")

    metadata.description = metadata.description
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/&(?!amp;|lt;|gt;|quot;|#39;)amp;/g, '&')
      .replace(/&(?!lt;|gt;|quot;|#39;|amp;)lt;/g, '<')
      .replace(/&(?!gt;|quot;|#39;|amp;|lt;)gt;/g, '>')
      .replace(/&(?!quot;|#39;|amp;|lt;|gt;)quot;/g, '"')
      .replace(/&(?!#39;|amp;|lt;|gt;|quot;)#39;/g, "'")

    // 텍스트 길이 제한
    if (metadata.title.length > 100) {
      metadata.title = metadata.title.substring(0, 97) + '...'
    }

    if (metadata.description.length > 200) {
      metadata.description = metadata.description.substring(0, 197) + '...'
    }

    return NextResponse.json(metadata)

  } catch (error) {
    console.error('Meta extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to extract metadata' }, 
      { status: 500 }
    )
  }
}