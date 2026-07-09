// Server-side Firebase REST API for SSR (No Admin SDK required)
export async function getNoticeById(id: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/notices/${id}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    const doc = await response.json();

    // Firestore REST API 응답을 일반 객체로 변환
    return {
      id: doc.name.split('/').pop(),
      title: doc.fields.title?.stringValue || '',
      content: doc.fields.content?.stringValue || '',
      category: doc.fields.category?.stringValue || '',
      imageUrl: doc.fields.imageUrl?.stringValue || '',
      isPinned: doc.fields.isPinned?.booleanValue || false,
      views: doc.fields.views?.integerValue ? parseInt(doc.fields.views.integerValue) : 0,
      createdAt: doc.fields.createdAt?.timestampValue || doc.createTime,
    };
  } catch (error) {
    console.error('공지사항 조회 실패:', error);
    return null;
  }
}

export async function getAllNotices() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/notices?orderBy=createdAt desc&pageSize=100`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (!data.documents) return [];

    const notices = data.documents.map((doc: any) => ({
      id: doc.name.split('/').pop(),
      title: doc.fields.title?.stringValue || '',
      content: doc.fields.content?.stringValue || '',
      category: doc.fields.category?.stringValue || '',
      imageUrl: doc.fields.imageUrl?.stringValue || '',
      isPinned: doc.fields.isPinned?.booleanValue || false,
      views: doc.fields.views?.integerValue ? parseInt(doc.fields.views.integerValue) : 0,
      createdAt: doc.fields.createdAt?.timestampValue || doc.createTime,
    }));

    // 고정된 공지를 맨 위로
    notices.sort((a: any, b: any) => {
      if (a.isPinned === b.isPinned) return 0;
      return a.isPinned ? -1 : 1;
    });

    return notices;
  } catch (error) {
    console.error('공지사항 목록 조회 실패:', error);
    return [];
  }
}
