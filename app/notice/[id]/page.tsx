'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navigation from '@/components/Navigation';
import FAB from '@/components/FAB';
import { marked } from 'marked';

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

export default function NoticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchNotice(params.id as string);
    }
  }, [params.id]);

  const fetchNotice = async (id: string) => {
    try {
      const docRef = doc(db, 'notices', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        let content = data.content;

        // HTML로 변환된 콘텐츠인지 더 정확하게 확인
        const hasCompleteHtmlTags =
          /<(p|h[1-6]|div|table|ul|ol)>[\s\S]*?<\/\1>/.test(content) ||
          content.includes('<table>') ||
          content.includes('</table>');

        if (!hasCompleteHtmlTags) {
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

        setNotice({
          id: docSnap.id,
          ...data,
          content
        } as Notice);
      } else {
        alert('공지사항을 찾을 수 없습니다.');
        router.push('/notice');
      }

      setLoading(false);
    } catch (error) {
      console.error('공지사항 불러오기 실패:', error);
      alert('공지사항을 불러올 수 없습니다.');
      router.push('/notice');
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
        <Navigation currentPage="notice" />
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', color: '#64748B' }}>불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!notice) {
    return null;
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
            className="notice-content"
            style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: 1.9,
              wordBreak: 'break-word'
            }}
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />
          <style dangerouslySetInnerHTML={{
            __html: `
              .notice-content table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                background: white;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                border-radius: 8px;
                overflow: hidden;
              }
              .notice-content thead {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .notice-content th {
                padding: 14px 16px;
                text-align: left;
                font-weight: 700;
                color: white;
                font-size: 15px;
                border: none;
              }
              .notice-content td {
                padding: 12px 16px;
                border-bottom: 1px solid #E2E8F0;
                font-size: 15px;
              }
              .notice-content tbody tr:last-child td {
                border-bottom: none;
              }
              .notice-content tbody tr:hover {
                background: #F8FAFC;
              }
            `
          }} />
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
