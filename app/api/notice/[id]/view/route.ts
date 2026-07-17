import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = 'maple-hub-e1e33';

    // 1. 현재 공지사항 가져오기
    const getUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/notices/${id}`;

    const getResponse = await fetch(getUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!getResponse.ok) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
    }

    const doc = await getResponse.json();
    const currentViews = doc.fields?.views?.integerValue ? parseInt(doc.fields.views.integerValue) : 0;

    // 2. views +1 업데이트
    const updateUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/notices/${id}?updateMask.fieldPaths=views`;

    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          views: {
            integerValue: (currentViews + 1).toString()
          }
        }
      })
    });

    if (!updateResponse.ok) {
      return NextResponse.json({ error: 'Failed to update views' }, { status: 500 });
    }

    return NextResponse.json({ views: currentViews + 1 });
  } catch (error) {
    console.error('조회수 업데이트 실패:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
