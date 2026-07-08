import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  preload: true,
  variable: '--font-noto-sans-kr',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.maplehub.co.kr'),
  title: {
    default: '메이플스토리 급처템 | 메이플스토리 아이템 - 전 서버 최고가 구매 및 시세 비교',
    template: '%s | 메이플 허브'
  },
  description: '메이플급처, 메이플스토리 급처템, 아이템 전 서버 최고가 구매. 24시간 상담 및 검증된 경매장 분석을 통해 안전하게 메이플급처 거래하세요.',
  keywords: '메이플급처, 메이플스토리급처, 메이플 급처, 메이플스토리, 메이플, 메이플스토리 급처, 급처템, 메이플장사, 메이플장사꾼, 메이플판매, 메이플 템 처분, 아이템 구매, 메이플 시세, 메이플메소, 메이플 아이템, 메이플허브',
  authors: [{ name: '메이플 허브' }],
  creator: '메이플 허브',
  publisher: '메이플 허브',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logo.ico',
    shortcut: '/logo.ico',
    apple: '/logo.ico',
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
    canonical: 'https://www.maplehub.co.kr',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://www.maplehub.co.kr',
    siteName: 'MAPLE HUB',
    title: '메이플스토리 급처템 | 메이플스토리 아이템 - 전 서버 최고가 구매 및 시세 비교',
    description: '메이플급처, 메이플스토리 급처템, 아이템 전 서버 최고가 구매. 24시간 상담 및 검증된 경매장 분석을 통해 안전하게 메이플급처 거래하세요.',
    images: [
      {
        url: '/maple hub.png',
        width: 1200,
        height: 630,
        alt: 'MAPLE HUB - 메이플급처 & 메이플스토리 아이템 거래',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '메이플스토리 급처템 | 메이플스토리 아이템 - 전 서버 최고가 구매 및 시세 비교',
    description: '메이플급처, 메이플스토리 급처템, 아이템 전 서버 최고가 구매. 24시간 상담 및 검증된 경매장 분석을 통해 안전하게 메이플급처 거래하세요.',
    images: ['/maple hub.png'],
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
    "description": "메이플급처, 메이플스토리 급처템, 아이템 전 서버 최고가 구매. 24시간 상담 및 검증된 경매장 분석을 통해 안전하게 메이플급처 거래하세요.",
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
        <meta name="google-site-verification" content="vKwxqeCyU-SMMoxjChOUegTNxHzzj7PmdHc2sO_iDLQ" />
        <meta name="naver-site-verification" content="8351ba44d4bcc248369b4c2d712ba5efb8e83db8" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="alternate" type="application/rss+xml" title="메이플 허브 RSS" href="/rss.xml" />
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
