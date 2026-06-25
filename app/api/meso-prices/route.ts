import { NextResponse } from 'next/server';

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// GET: 가격 불러오기
export async function GET() {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/mesoPrices/current?key=${FIREBASE_API_KEY}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      // 문서가 없으면 기본값 반환
      if (response.status === 404) {
        const defaultData = {
          buy: [
            { label: "1 ~ 100억", maxQty: 100, price: 1300, hot: false },
            { label: "101 ~ 300억", maxQty: 300, price: 1350, hot: false },
            { label: "301억 이상", maxQty: null, price: 1370, hot: true }
          ],
          sell: [
            { label: "1 ~ 100억", maxQty: 100, price: 1550, hot: true },
            { label: "101 ~ 300억", maxQty: 300, price: 1530, hot: false },
            { label: "301억 이상", maxQty: null, price: 1520, hot: false }
          ]
        };
        return NextResponse.json(defaultData);
      }
      throw new Error('Failed to fetch');
    }

    const data = await response.json();

    // Firestore 형식을 일반 객체로 변환
    const result = {
      buy: JSON.parse(data.fields.buy.stringValue),
      sell: JSON.parse(data.fields.sell.stringValue)
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET Error:', error);
    // 에러 시 기본값 반환
    const defaultData = {
      buy: [
        { label: "1 ~ 100억", maxQty: 100, price: 1300, hot: false },
        { label: "101 ~ 300억", maxQty: 300, price: 1350, hot: false },
        { label: "301억 이상", maxQty: null, price: 1370, hot: true }
      ],
      sell: [
        { label: "1 ~ 100억", maxQty: 100, price: 1550, hot: true },
        { label: "101 ~ 300억", maxQty: 300, price: 1530, hot: false },
        { label: "301억 이상", maxQty: null, price: 1520, hot: false }
      ]
    };
    return NextResponse.json(defaultData);
  }
}

// POST: 가격 저장하기
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/mesoPrices/current?key=${FIREBASE_API_KEY}`;

    const body = {
      fields: {
        buy: { stringValue: JSON.stringify(data.buy) },
        sell: { stringValue: JSON.stringify(data.sell) },
        updatedAt: { timestampValue: new Date().toISOString() }
      }
    };

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      // 문서가 없으면 생성
      if (response.status === 404) {
        const createUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/mesoPrices?documentId=current&key=${FIREBASE_API_KEY}`;
        const createResponse = await fetch(createUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        });

        if (!createResponse.ok) {
          throw new Error('Failed to create document');
        }

        return NextResponse.json({ success: true });
      }
      throw new Error('Failed to save');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: '가격 저장에 실패했습니다', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
