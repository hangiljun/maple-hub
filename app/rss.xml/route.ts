import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1시간마다 재생성

interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category: string;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').substring(0, 200);
}

export async function GET() {
  const baseUrl = 'https://www.maplehub.co.kr';
  const items: FeedItem[] = [];

  try {
    // Firebase REST API로 공지사항 가져오기
    const noticesResponse = await fetch(
      `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents/notices?pageSize=20&orderBy=createdAt desc`,
      { next: { revalidate: 3600 } }
    );

    if (noticesResponse.ok) {
      const noticesData = await noticesResponse.json();
      const notices = noticesData.documents?.map((doc: any) => {
        const id = doc.name.split('/').pop();
        const title = doc.fields.title?.stringValue || '제목 없음';
        const content = doc.fields.content?.stringValue || '';
        const createdAt = doc.fields.createdAt?.timestampValue || doc.createTime;

        return {
          title: escapeXml(title),
          link: `${baseUrl}/notice/${id}`,
          description: escapeXml(stripHtml(content)),
          pubDate: new Date(createdAt).toUTCString(),
          category: '공지사항'
        };
      }) || [];

      items.push(...notices);
    }

    // Firebase REST API로 리뷰 가져오기
    const reviewsResponse = await fetch(
      `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents/reviews?pageSize=20&orderBy=createdAt desc`,
      { next: { revalidate: 3600 } }
    );

    if (reviewsResponse.ok) {
      const reviewsData = await reviewsResponse.json();
      const reviews = reviewsData.documents?.map((doc: any) => {
        const id = doc.name.split('/').pop();
        const title = doc.fields.title?.stringValue || '제목 없음';
        const content = doc.fields.content?.stringValue || '';
        const rating = doc.fields.rating?.integerValue || '5';
        const createdAt = doc.fields.createdAt?.timestampValue || doc.createTime;

        return {
          title: escapeXml(`⭐ ${rating}/5 - ${title}`),
          link: `${baseUrl}/reviews/${id}`,
          description: escapeXml(stripHtml(content)),
          pubDate: new Date(createdAt).toUTCString(),
          category: '후기'
        };
      }) || [];

      items.push(...reviews);
    }

    // 날짜순 정렬
    items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    // RSS XML 생성
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MAPLE HUB - 메이플급처 &amp; 메이플스토리 아이템</title>
    <link>${baseUrl}</link>
    <description>메이플급처, 메이플스토리 급처템, 메소, 아이템 전 서버 최고가 매입. 최신 공지사항과 거래 후기를 확인하세요.</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items.map(item => `
    <item>
      <title>${item.title}</title>
      <link>${item.link}</link>
      <description>${item.description}</description>
      <pubDate>${item.pubDate}</pubDate>
      <category>${item.category}</category>
      <guid isPermaLink="true">${item.link}</guid>
    </item>`).join('')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });

  } catch (error) {
    console.error('RSS generation error:', error);

    // 에러 시 기본 RSS 반환
    const fallbackRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>MAPLE HUB</title>
    <link>${baseUrl}</link>
    <description>메이플급처 &amp; 메이플스토리 아이템 거래</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`;

    return new NextResponse(fallbackRss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600'
      }
    });
  }
}
