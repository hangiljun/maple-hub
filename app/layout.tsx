import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.maplehub.co.kr'),
  title: '메이플급처 & 메이플스토리 아이템 - 전 서버 최고가 매입 및 시세 비교 | MAPLE HUB',
  description: '메이플급처, 메이플스토리 급처템, 메소, 아이템 전 서버 최고가 매입. 24시간 상담 및 검증된 업체 리스트를 통해 안전하게 메이플급처 거래하세요.',
  keywords: '메이플급처, 메이플스토리급처, 메이플 급처, 메이플스토리, 메이플, 메이플스토리 급처, 급처템, 아이템 매입, 메소 거래, 메이플 시세',
  icons: {
    icon: '/logo.ico',
    shortcut: '/logo.ico',
    apple: '/logo.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://www.maplehub.co.kr',
    siteName: 'MAPLE HUB',
    title: '메이플급처 & 메이플스토리 아이템 - MAPLE HUB',
    description: '메이플급처, 메이플스토리 급처템, 메소, 아이템 전 서버 최고가 매입. 24시간 상담 및 검증된 업체 리스트를 통해 안전하게 메이플급처 거래하세요.',
    images: [
      {
        url: '/kakao.jpg',
        width: 1200,
        height: 630,
        alt: 'MAPLE HUB - 메이플급처 & 메이플스토리 아이템 거래',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '메이플급처 & 메이플스토리 아이템 - MAPLE HUB',
    description: '메이플급처, 메이플스토리 급처템, 메소, 아이템 전 서버 최고가 매입',
    images: ['/kakao.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MAPLE HUB",
    "url": "https://www.maplehub.co.kr",
    "description": "메이플급처, 메이플스토리 급처템, 메소, 아이템 전 서버 최고가 매입. 24시간 상담 및 검증된 업체 리스트를 통해 안전하게 메이플급처 거래하세요.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.maplehub.co.kr/reviews?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "메이플 허브",
      "url": "https://www.maplehub.co.kr"
    }
  };

  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={notoSansKr.className}>
        {children}
      </body>
    </html>
  );
}
