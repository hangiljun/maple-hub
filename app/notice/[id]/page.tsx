import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NoticeDetailClient from './NoticeDetailClient';
import { getNoticeById } from '@/lib/firebase-admin';

// 동적 렌더링 설정 (SSR)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: { id: string };
};

// 동적 메타데이터 생성 (SSR) - 크롤러가 수집할 수 있음
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const notice = await getNoticeById(params.id);

  if (!notice) {
    return {
      title: '공지사항을 찾을 수 없습니다',
    };
  }

  // HTML 태그 제거하고 텍스트만 추출
  const description = notice.content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 160);

  const title = `${notice.title} | 메이플 허브 공지사항`;
  const url = `https://www.maplehub.co.kr/notice/${params.id}`;
  const imageUrl = notice.imageUrl || 'https://www.maplehub.co.kr/maple hub.png';

  return {
    title,
    description,
    keywords: `메이플 허브, 공지사항, ${notice.category}, ${notice.title}`,
    authors: [{ name: '메이플 허브' }],
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url,
      title,
      description,
      siteName: '메이플 허브',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: notice.title,
        },
      ],
      publishedTime: notice.createdAt,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
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
      canonical: url,
    },
  };
}

export default async function NoticeDetailPage({ params }: Props) {
  const notice = await getNoticeById(params.id);

  if (!notice) {
    notFound();
  }

  // 구조화된 데이터 (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: notice.title,
    datePublished: notice.createdAt,
    dateModified: notice.createdAt,
    author: {
      '@type': 'Organization',
      name: '메이플 허브',
    },
    publisher: {
      '@type': 'Organization',
      name: '메이플 허브',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.maplehub.co.kr/maple hub.png',
      },
    },
    image: notice.imageUrl || 'https://www.maplehub.co.kr/maple hub.png',
    articleSection: notice.category,
    description: notice.content.replace(/<[^>]*>/g, '').substring(0, 160),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.maplehub.co.kr/notice/${params.id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NoticeDetailClient notice={notice} />
    </>
  );
}
