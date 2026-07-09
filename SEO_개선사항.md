# 공지사항 페이지 SEO 최적화 완료 ✅

## 개선 내역 (2026-07-08)

### 🎯 목표: 네이버 & 구글 크롤러 최적화

---

## 1. Server-Side Rendering (SSR) 구현

### 변경 전
- ❌ 'use client'로 전체 페이지 구현
- ❌ 클라이언트에서만 데이터 로드
- ❌ 크롤러가 빈 HTML만 수집

### 변경 후
- ✅ Server Component로 변경
- ✅ 서버에서 데이터 미리 로드
- ✅ 완전한 HTML을 크롤러에게 제공

**파일 구조:**
```
app/notice/
├── page.tsx (Server Component - SSR)
├── NoticeListClient.tsx (Client Component)
└── [id]/
    ├── page.tsx (Server Component - SSR)
    └── NoticeDetailClient.tsx (Client Component)
```

---

## 2. 동적 메타데이터 생성 (generateMetadata)

### 공지사항 상세 페이지 ([id]/page.tsx)

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const notice = await getNoticeById(params.id);
  
  return {
    title: `${notice.title} | 메이플 허브 공지사항`,
    description: notice.content.substring(0, 160), // 검색 결과 설명
    keywords: `메이플 허브, 공지사항, ${notice.category}`,
    
    // Open Graph (카카오톡, 페이스북 공유)
    openGraph: {
      type: 'article',
      title: notice.title,
      description: notice.content.substring(0, 160),
      images: [notice.imageUrl],
      url: `https://www.maplehub.co.kr/notice/${params.id}`,
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: notice.title,
      description: notice.content.substring(0, 160),
    },
    
    // 크롤러 허용 설정
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // 정규 URL (중복 콘텐츠 방지)
    alternates: {
      canonical: `https://www.maplehub.co.kr/notice/${params.id}`,
    },
  };
}
```

### 공지사항 목록 페이지 (page.tsx)

```typescript
export const metadata: Metadata = {
  title: '공지사항 | 메이플 허브 - 최신 소식 및 업데이트',
  description: '메이플 허브의 최신 소식, 이벤트, 업데이트 정보를 확인하세요.',
  // ... 동일한 SEO 설정
};
```

---

## 3. 구조화된 데이터 (JSON-LD Schema)

### 상세 페이지 - Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "공지사항 제목",
  "datePublished": "2026-07-08T...",
  "dateModified": "2026-07-08T...",
  "author": {
    "@type": "Organization",
    "name": "메이플 허브"
  },
  "publisher": {
    "@type": "Organization",
    "name": "메이플 허브",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.maplehub.co.kr/maple hub.png"
    }
  },
  "image": "공지사항_이미지_URL",
  "articleSection": "공지사항",
  "description": "공지사항 내용...",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.maplehub.co.kr/notice/xxx"
  }
}
```

### 목록 페이지 - ItemList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "메이플 허브 공지사항",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Article",
          "headline": "공지사항 1",
          "url": "https://www.maplehub.co.kr/notice/1"
        }
      }
    ]
  }
}
```

---

## 4. Firebase REST API 서버 사이드 데이터 로드

**파일:** `lib/firebase-admin.ts`

```typescript
// Admin SDK 없이 REST API 사용 (빌드 시간 단축)
export async function getNoticeById(id: string) {
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/notices/${id}`,
    { cache: 'no-store' }
  );
  // 데이터 파싱 및 반환
}

export async function getAllNotices() {
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/notices?orderBy=createdAt desc`,
    { cache: 'no-store' }
  );
  // 데이터 파싱 및 반환
}
```

---

## 5. 시맨틱 HTML 태그 적용

```html
<!-- 상세 페이지 -->
<article>
  <h1>공지사항 제목</h1>
  <time dateTime="2026-07-08T...">2026년 7월 8일</time>
  <div class="notice-content">
    <!-- 내용 -->
  </div>
</article>

<!-- 목록 페이지 -->
<time dateTime="2026-07-08T...">
  {new Date(notice.createdAt).toLocaleDateString()}
</time>
```

---

## 6. robots.txt 및 sitemap.xml 확인

### robots.txt ✅
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://www.maplehub.co.kr/sitemap.xml
```

### sitemap.ts ✅
```typescript
// 모든 공지사항 자동 추가
const noticePages = noticesData.documents?.map((doc) => ({
  url: `${baseUrl}/notice/${id}`,
  lastModified: new Date(createdAt),
  changeFrequency: 'weekly',
  priority: 0.7,
}));
```

---

## 7. 크롤러 확인 방법

### Google Search Console
1. https://search.google.com/search-console 접속
2. URL 검사 도구 사용: `https://www.maplehub.co.kr/notice/[공지사항ID]`
3. "색인 생성 요청" 클릭

### Naver Search Advisor
1. https://searchadvisor.naver.com/ 접속
2. 웹마스터 도구 > 수집 요청
3. URL 입력: `https://www.maplehub.co.kr/notice/[공지사항ID]`

### 메타데이터 확인 도구
- Open Graph: https://www.opengraph.xyz/
- Twitter Card: https://cards-dev.twitter.com/validator
- 구조화된 데이터: https://search.google.com/test/rich-results

---

## 8. 기대 효과

### ✅ 크롤링 최적화
- 서버에서 완전한 HTML 제공
- 메타 태그가 모든 페이지에 동적 생성
- 검색 엔진이 콘텐츠를 완벽하게 수집

### ✅ 검색 결과 개선
- 제목: `공지사항 제목 | 메이플 허브 공지사항`
- 설명: 실제 공지사항 내용 160자
- 이미지: 각 공지사항의 대표 이미지

### ✅ 소셜 미디어 공유 최적화
- 카카오톡, 페이스북 링크 공유 시 예쁜 카드 표시
- 제목, 설명, 이미지 자동 추출

### ✅ 검색 순위 향상 가능성
- 구조화된 데이터로 구글 Rich Results 가능
- 시맨틱 HTML로 페이지 의미 명확화
- Canonical URL로 중복 콘텐츠 방지

---

## 9. 배포 후 할 일

1. **Google Search Console에 색인 요청**
   ```
   모든 공지사항 URL을 수동으로 색인 요청
   ```

2. **Naver Search Advisor에 사이트맵 제출**
   ```
   https://www.maplehub.co.kr/sitemap.xml
   ```

3. **1-2주 후 검색 결과 확인**
   ```
   site:maplehub.co.kr 공지사항
   ```

4. **모니터링**
   - Google Search Console: 클릭수, 노출수, 평균 게재순위
   - Naver Search Advisor: 검색 반영 현황

---

## 10. 추가 개선 가능 사항 (선택)

- [ ] 페이지 로딩 속도 최적화 (이미지 최적화)
- [ ] 모바일 반응형 디자인 개선
- [ ] 내부 링크 최적화 (관련 공지사항 링크)
- [ ] 빵부스러기 (Breadcrumb) 네비게이션
- [ ] FAQ 스키마 추가 (Q&A 형식 공지사항)

---

## 참고 자료

- Next.js Metadata: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- Google SEO: https://developers.google.com/search/docs
- Schema.org: https://schema.org/
- Open Graph Protocol: https://ogp.me/
