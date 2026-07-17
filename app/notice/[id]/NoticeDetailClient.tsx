'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import FAB from '@/components/FAB';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  isPinned: boolean;
  views: number;
  createdAt: string;
}

interface NoticeDetailClientProps {
  notice: Notice;
}

export default function NoticeDetailClient({ notice }: NoticeDetailClientProps) {
  // 조회수 증가
  useEffect(() => {
    const incrementViews = async () => {
      try {
        await fetch(`/api/notice/${notice.id}/view`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('조회수 업데이트 실패:', error);
      }
    };

    incrementViews();
  }, [notice.id]);

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
        <article style={{
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
            <time style={{ fontSize: '15px', color: '#64748B' }} dateTime={notice.createdAt}>
              📅 {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
            </time>
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
                alt={`${notice.title} 이미지`}
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
              .notice-content p {
                margin: 16px 0;
                line-height: 1.8;
              }
              .notice-content p:first-child {
                margin-top: 0;
              }
              .notice-content p:last-child {
                margin-bottom: 0;
              }
              .notice-content h1,
              .notice-content h2,
              .notice-content h3,
              .notice-content h4 {
                margin: 24px 0 16px 0;
                font-weight: 700;
              }
              .notice-content h1 {
                font-size: 28px;
                border-bottom: 2px solid #E2E8F0;
                padding-bottom: 8px;
              }
              .notice-content h2 {
                font-size: 24px;
              }
              .notice-content h3 {
                font-size: 20px;
              }
              .notice-content ul,
              .notice-content ol {
                margin: 16px 0;
                padding-left: 24px;
              }
              .notice-content li {
                margin: 8px 0;
                line-height: 1.8;
              }
              .notice-content hr {
                margin: 32px 0;
                border: none;
                border-top: 2px solid #E2E8F0;
              }
              .notice-content blockquote {
                margin: 16px 0;
                padding: 12px 16px;
                border-left: 4px solid #667eea;
                background: #F8FAFC;
                color: #475569;
              }
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
              .notice-content strong {
                font-weight: 700;
                color: #1E293B;
              }
              .notice-content code {
                padding: 2px 6px;
                background: #F1F5F9;
                border-radius: 4px;
                font-family: monospace;
                font-size: 14px;
              }
              .notice-content a {
                color: #667eea;
                text-decoration: underline;
              }
              .notice-content a:hover {
                color: #764ba2;
              }
              .notice-content img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                margin: 16px 0;
              }
            `
          }} />
        </article>

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
