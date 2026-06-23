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
  title: '메이플급처 & 메이플스토리 아이템 - 전 서버 최고가 매입 및 시세 비교 | MAPLE HUB',
  description: '메이플급처, 메이플스토리 급처템, 메소, 아이템 전 서버 최고가 매입. 24시간 상담 및 검증된 업체 리스트를 통해 안전하게 메이플급처 거래하세요.',
  keywords: '메이플급처, 메이플스토리급처, 메이플 급처, 메이플스토리, 메이플, 메이플스토리 급처, 급처템, 아이템 매입, 메소 거래, 메이플 시세',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
      </head>
      <body className={notoSansKr.className}>
        {children}
      </body>
    </html>
  );
}
