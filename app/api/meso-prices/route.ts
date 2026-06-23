import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'meso-prices.json');

// GET: 가격 불러오기
export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: '가격 정보를 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

// POST: 가격 저장하기
export async function POST(request: Request) {
  try {
    const data = await request.json();
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: '가격 저장에 실패했습니다' },
      { status: 500 }
    );
  }
}
