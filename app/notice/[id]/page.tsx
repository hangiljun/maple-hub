import React from 'react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navigation from '@/components/Navigation';
import FAB from '@/components/FAB';
import { marked } from 'marked';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  isPinned: boolean;
  views: number;
  createdAt: any;
}

async function getNotice(id: string): Promise<Notice | null> {
  try {
    const docRef = doc(db, 'notices', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    let content = data.content;

    // HTML 태그가 없으면 마크다운으로 간주하고 변환
    const hasHtmlTags = /<(h1|h2|h3|p|table|div|span)[^>]*>/i.test(content);

    if (!hasHtmlTags) {
      try {
        marked.setOptions({
          breaks: true,
          gfm: true,
        } as any);

        const parsed = await marked.parse(content);
        content = typeof parsed === 'string' ? parsed : String(parsed);

        // 빈 태그 및 불필요한 공백 제거
        content = content
          .replace(/<p>\s*<\/p>/g, '')
          .replace(/<p><\/p>/g, '')
          .replace(/(<\/p>)\s*(<p>\s*<\/p>\s*)+/g, '$1')
          .replace(/(<p>\s*<\/p>\s*)+(<table)/g, '$2')
          .replace(/(<\/table>)\s*(<p>\s*<\/p>\s*)+/g, '$1')
          .replace(/<br\s*\/?>\s*(<table)/g, '$1')
          .replace(/(<\/table>)\s*<br\s*\/?>/g, '$1')
          .trim();
      } catch (error) {
        console.error('마크다운 변환 실패:', error);
      }
    }

    return {
      id: docSnap.id,
      ...data,
      content
    } as Notice;
  } catch (error) {
    console.error('공지사항 불러오기 실패:', error);
    return null;
  }
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const notice = await getNotice(params.id);

  if (!notice) {
    return {
      title: '공지사항을 찾을 수 없습니다 - 메이플 허브',
    };
  }

  // HTML 태그 제거하여 순수 텍스트 추출 (description용)
  const plainText = notice.content.replace(/<[^>]*>/g, '').substring(0, 160);

  return {
    title: `${notice.title} - 메이플 허브`,
    description: plainText,
    openGraph: {
      title: notice.title,
      description: plainText,
      images: notice.imageUrl ? [notice.imageUrl] : ['/maple hub.png'],
      type: 'article',
      siteName: '메이플 허브',
    },
    twitter: {
      card: 'summary_large_image',
      title: notice.title,
      description: plainText,
      images: notice.imageUrl ? [notice.imageUrl] : ['/maple hub.png'],
    },
  };
}

export default async function NoticeDetailPage({ params }: { params: { id: string } }) {
  const notice = await getNotice(params.id);

  if (!notice) {
    notFound();
  }

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <Navigation currentPage="notice" />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px' }}>
        {/* 뒤로가기 버튼 */}
        <Link href="/notice" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
          padding: '10px 16px',
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          textDecoration: 'none',
          color: '#64748B',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'all 0.2s'
        }}>
          ← 목록으로
        </Link>

        {/* 공지사항 상세 */}
        <div style={{
          background: 'white',
          padding: '48px',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
        }}>
          {/* 카테고리 & 고정 뱃지 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 12px',
              background: '#667eea',
              color: 'white',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '700'
            }}>
              {notice.category}
            </span>
            {notice.isPinned && (
              <span style={{
                display: 'inline-block',
                padding: '6px 12px',
                background: '#EF4444',
                color: 'white',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '700'
              }}>
                📌 고정
              </span>
            )}
          </div>

          {/* 제목 */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: '900',
            color: '#1E293B',
            marginBottom: '16px',
            lineHeight: 1.4
          }}>
            {notice.title}
          </h1>

          {/* 메타 정보 */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            paddingBottom: '24px',
            marginBottom: '32px',
            borderBottom: '2px solid #F1F5F9'
          }}>
            <span style={{ fontSize: '15px', color: '#64748B' }}>
              📅 {new Date(notice.createdAt?.toDate ? notice.createdAt.toDate() : notice.createdAt).toLocaleDateString('ko-KR')}
            </span>
            {notice.views !== undefined && (
              <>
                <span style={{ fontSize: '15px', color: '#CBD5E1' }}>|</span>
                <span style={{ fontSize: '15px', color: '#64748B' }}>
                  👁️ {notice.views.toLocaleString()}
                </span>
              </>
            )}
          </div>

          {/* 이미지 */}
          {notice.imageUrl && (
            <div style={{ marginBottom: '32px' }}>
              <img
                src={notice.imageUrl}
                alt="공지사항 이미지"
                style={{
                  width: '100%',
                  maxHeight: '600px',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0'
                }}
              />
            </div>
          )}

          {/* 내용 */}
          <div
            style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: 1.9,
              wordBreak: 'break-word'
            }}
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />
          <style jsx>{`
            div :global(table) {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              background: white;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
              border-radius: 8px;
              overflow: hidden;
            }
            div :global(thead) {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            div :global(th) {
              padding: 14px 16px;
              text-align: left;
              font-weight: 700;
              color: white;
              font-size: 15px;
              border: none;
            }
            div :global(td) {
              padding: 12px 16px;
              border-bottom: 1px solid #E2E8F0;
              font-size: 15px;
            }
            div :global(tbody tr:last-child td) {
              border-bottom: none;
            }
            div :global(tbody tr:hover) {
              background: #F8FAFC;
            }
          `}</style>
        </div>

        {/* 목록으로 버튼 */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link href="/notice" style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '700',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.2s'
          }}>
            목록으로 돌아가기
          </Link>
        </div>
      </div>

      <FAB type="kakao" />
    </div>
  );
}
