import { Metadata } from 'next';
import NoticeListClient from './NoticeListClient';
import { getAllNotices } from '@/lib/firebase-admin';

// 동적 렌더링 설정 (매 요청마다 새로운 데이터)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 정적 메타데이터 (공지사항 목록 페이지)
export const metadata: Metadata = {
  title: '공지사항 | 메이플 허브 - 최신 소식 및 업데이트',
  description: '메이플 허브의 최신 소식, 이벤트, 업데이트 정보를 확인하세요. 메이플스토리 급처템 및 아이템 거래 관련 공지사항을 실시간으로 제공합니다.',
  keywords: '메이플 허브 공지사항, 메이플스토리 소식, 메이플 급처 이벤트, 메이플 아이템 업데이트',
  openGraph: {
    title: '공지사항 | 메이플 허브 - 최신 소식 및 업데이트',
    description: '메이플 허브의 최신 소식, 이벤트, 업데이트 정보를 확인하세요.',
    url: 'https://www.maplehub.co.kr/notice',
    siteName: '메이플 허브',
    images: [
      {
        url: 'https://www.maplehub.co.kr/notice-banner.png',
        width: 1200,
        height: 300,
        alt: '메이플 허브 공지사항',
      },
    ],
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '공지사항 | 메이플 허브',
    description: '메이플 허브의 최신 소식, 이벤트, 업데이트 정보를 확인하세요.',
    images: ['https://www.maplehub.co.kr/notice-banner.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.maplehub.co.kr/notice',
  },
};

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  isPinned: boolean;
  views: number;
  createdAt: string;
}

export default async function NoticePage() {
  // 서버에서 공지사항 데이터 미리 가져오기 (SSR)
  const initialNotices = await getAllNotices();

  // 구조화된 데이터 (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '메이플 허브 공지사항',
    description: '메이플 허브의 최신 소식, 이벤트, 업데이트 정보',
    url: 'https://www.maplehub.co.kr/notice',
    publisher: {
      '@type': 'Organization',
      name: '메이플 허브',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.maplehub.co.kr/maple hub.png',
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: initialNotices.slice(0, 10).map((notice: Notice, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          headline: notice.title,
          url: `https://www.maplehub.co.kr/notice/${notice.id}`,
          datePublished: notice.createdAt,
          image: notice.imageUrl || 'https://www.maplehub.co.kr/maple hub.png',
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NoticeListClient initialNotices={initialNotices} />
    </>
  );
}
