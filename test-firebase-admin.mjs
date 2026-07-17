// Test firebase-admin.ts getNoticeById function
async function getNoticeById(id) {
  const projectId = 'maple-hub-e1e33';

  console.log('🔍 getNoticeById 호출:', { id, projectId });

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/notices/${id}`;
    console.log('📡 Firebase URL:', url);

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('📥 응답 상태:', response.status, response.statusText);

    if (!response.ok) {
      console.error('❌ 응답 실패:', response.status);
      const text = await response.text();
      console.error('응답 내용:', text);
      return null;
    }

    const doc = await response.json();
    console.log('✅ 문서 받음:', JSON.stringify(doc, null, 2).substring(0, 500));

    // Firestore REST API 응답을 일반 객체로 변환
    const result = {
      id: doc.name.split('/').pop() || '',
      title: doc.fields?.title?.stringValue || '',
      content: doc.fields?.content?.stringValue || '',
      category: doc.fields?.category?.stringValue || '공지사항',
      imageUrl: doc.fields?.imageUrl?.stringValue || '',
      isPinned: doc.fields?.isPinned?.booleanValue || false,
      views: doc.fields?.views?.integerValue ? parseInt(doc.fields.views.integerValue) : 0,
      createdAt: doc.fields?.createdAt?.timestampValue || doc.createTime || new Date().toISOString(),
    };

    console.log('📦 변환된 객체:', result);
    return result;
  } catch (error) {
    console.error('💥 오류 발생:', error);
    return null;
  }
}

// Test
const result = await getNoticeById('puJUtHNILkZdH4OOktYI');
console.log('\n=== 최종 결과 ===');
console.log(result ? '✅ 성공' : '❌ 실패');
if (result) {
  console.log('제목:', result.title);
  console.log('views:', result.views);
}
