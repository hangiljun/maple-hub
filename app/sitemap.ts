import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1시간마다 재생성

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.maplehub.co.kr';

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/notice`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/items`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/meso`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/qna`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/discord`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  try {
    // Firebase REST API로 후기 가져오기
    const reviewsResponse = await fetch(
      `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents/reviews?pageSize=1000`,
      { next: { revalidate: 3600 } }
    );

    const reviewsData = await reviewsResponse.json();
    const reviewPages: MetadataRoute.Sitemap = reviewsData.documents?.map((doc: any) => {
      const id = doc.name.split('/').pop();
      const createdAt = doc.fields.createdAt?.timestampValue || doc.createTime;
      return {
        url: `${baseUrl}/reviews/${id}`,
        lastModified: new Date(createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    }) || [];

    // Firebase REST API로 공지사항 가져오기
    const noticesResponse = await fetch(
      `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents/notices?pageSize=1000`,
      { next: { revalidate: 3600 } }
    );

    const noticesData = await noticesResponse.json();
    const noticePages: MetadataRoute.Sitemap = noticesData.documents?.map((doc: any) => {
      const id = doc.name.split('/').pop();
      const createdAt = doc.fields.createdAt?.timestampValue || doc.createTime;
      return {
        url: `${baseUrl}/notice/${id}`,
        lastModified: new Date(createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    }) || [];

    return [...staticPages, ...reviewPages, ...noticePages];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    // 에러 시 정적 페이지만 반환
    return staticPages;
  }
}
