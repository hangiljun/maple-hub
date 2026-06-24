'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { firebaseConfig } from '@/lib/firebase-config';
import Navigation from '@/components/Navigation';
import FAB from '@/components/FAB';

interface Review {
  id: string;
  title: string;
  nickname: string;
  content: string;
  imageUrl?: string;
  views: number;
  createdAt: any;
}

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchReview(params.id as string);
      incrementViews(params.id as string);
    }
  }, [params.id]);

  const fetchReview = async (id: string) => {
    try {
      const { projectId, apiKey } = firebaseConfig;
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/reviews/${id}?key=${apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('후기를 찾을 수 없습니다.');
      }

      const data = await response.json();

      setReview({
        id: data.name.split('/').pop(),
        title: data.fields.title?.stringValue || '',
        nickname: data.fields.nickname?.stringValue || '',
        content: data.fields.content?.stringValue || '',
        imageUrl: data.fields.imageUrl?.stringValue || '',
        views: parseInt(data.fields.views?.integerValue || '0'),
        createdAt: data.fields.createdAt?.timestampValue || data.createTime
      });

      setLoading(false);
    } catch (error) {
      console.error('후기 불러오기 실패:', error);
      alert('후기를 불러올 수 없습니다.');
      router.push('/reviews');
    }
  };

  const incrementViews = async (id: string) => {
    try {
      const { projectId, apiKey } = firebaseConfig;

      // 현재 조회수 가져오기
      const getUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/reviews/${id}?key=${apiKey}`;
      const getResponse = await fetch(getUrl);
      const getData = await getResponse.json();
      const currentViews = parseInt(getData.fields?.views?.integerValue || '0');

      // 조회수 +1 업데이트
      const updateUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/reviews/${id}?key=${apiKey}&updateMask.fieldPaths=views`;
      await fetch(updateUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            views: { integerValue: (currentViews + 1).toString() }
          }
        })
      });
    } catch (error) {
      console.error('조회수 업데이트 실패:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
        <Navigation currentPage="reviews" />
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', color: '#64748B' }}>불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return null;
  }

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <Navigation currentPage="reviews" />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px' }}>
        {/* 뒤로가기 버튼 */}
        <Link href="/reviews" style={{
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

        {/* 후기 상세 */}
        <div style={{
          background: 'white',
          padding: '48px',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
        }}>
          {/* 제목 */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: '900',
            color: '#1E293B',
            marginBottom: '16px',
            lineHeight: 1.4
          }}>
            {review.title}
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
              👤 {review.nickname}
            </span>
            <span style={{ fontSize: '15px', color: '#CBD5E1' }}>|</span>
            <span style={{ fontSize: '15px', color: '#64748B' }}>
              📅 {new Date(review.createdAt).toLocaleDateString('ko-KR')}
            </span>
            <span style={{ fontSize: '15px', color: '#CBD5E1' }}>|</span>
            <span style={{ fontSize: '15px', color: '#64748B' }}>
              👁️ {review.views.toLocaleString()}
            </span>
          </div>

          {/* 이미지 */}
          {review.imageUrl && (
            <div style={{ marginBottom: '32px' }}>
              <img
                src={review.imageUrl}
                alt="후기 이미지"
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
          <div style={{
            fontSize: '16px',
            color: '#475569',
            lineHeight: 1.9,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {review.content}
          </div>
        </div>

        {/* 목록으로 버튼 */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link href="/reviews" style={{
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
