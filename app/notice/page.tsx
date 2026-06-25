'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { getDocs, query, orderBy, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navigation from '@/components/Navigation';
import FAB from '@/components/FAB';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  isPinned: boolean;
  createdAt: any;
}

// Admin password moved to server-side API for security

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeTab, setActiveTab] = useState('전체');

  const categories = ['전체', '공지사항'];

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      let noticesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notice[];

      // 고정된 공지를 맨 위로
      noticesData.sort((a, b) => {
        if (a.isPinned === b.isPinned) return 0;
        return a.isPinned ? -1 : 1;
      });

      setNotices(noticesData);
    } catch (error) {
      console.error('공지사항 불러오기 실패:', error);
    }
  };


  const filteredNotices = activeTab === '전체' ? notices : notices.filter(n => n.category === activeTab);

  const extractFirstImg = (content: string) => {
    if (!content) return null;
    const imgReg = /<img[^>]+src=["']([^"']+)["']/;
    const match = imgReg.exec(content);
    return match ? match[1] : null;
  };

  return (
    <>
      <Script id="notice-structured-data" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "공지사항",
          "url": "https://www.maplehub.co.kr/notice",
          "description": "MAPLE HUB의 최신 소식과 공지사항을 확인하세요.",
          "isPartOf": {
            "@type": "WebSite",
            "name": "MAPLE HUB",
            "url": "https://www.maplehub.co.kr"
          }
        })}
      </Script>
      <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: '#1E293B' }}>
        <Navigation currentPage="notice" />

      {/* 배너 */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1200px', position: 'relative', overflow: 'hidden' }}>
          <img
            src="/공지.png"
            alt="공지사항 배너"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>

        {/* 카테고리 탭 + 관리자 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '30px',
                  border: activeTab === tab ? '1px solid #667eea' : '1px solid #E2E8F0',
                  backgroundColor: activeTab === tab ? '#667eea' : '#FFFFFF',
                  color: activeTab === tab ? '#FFF' : '#64748B',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: '0.3s',
                  boxShadow: activeTab === tab ? '0 2px 8px rgba(102,126,234,0.3)' : 'none'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 공지사항 카드 그리드 */}
        {filteredNotices.length === 0 ? (
          <div style={{
            padding: '80px 20px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📢</div>
            <p style={{ fontSize: '18px', color: '#64748B', fontWeight: '600', marginBottom: '12px' }}>
              등록된 공지사항이 없습니다
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {filteredNotices.map((notice) => {
              const thumbnail = notice.imageUrl || extractFirstImg(notice.content);
              return (
                <Link
                  key={notice.id}
                  href={`/notice/${notice.id}`}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: notice.isPinned ? '2px solid #667eea' : '1px solid #E2E8F0',
                    boxShadow: notice.isPinned ? '0 4px 20px rgba(102, 126, 234, 0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = notice.isPinned ? '0 4px 20px rgba(102, 126, 234, 0.15)' : '0 2px 8px rgba(0,0,0,0.06)';
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#F1F5F9' }}>
                    {thumbnail ? (
                      <img src={thumbnail} alt={notice.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94A3B8', fontSize: '13px' }}>
                        이미지 없음
                      </div>
                    )}
                    {notice.isPinned && (
                      <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '24px' }}>📌</div>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      left: '15px',
                      backgroundColor: '#667eea',
                      color: '#FFF',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      padding: '4px 10px',
                      borderRadius: '5px'
                    }}>
                      {notice.category || '공지'}
                    </div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#1E293B' }}>
                      {notice.title}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{notice.createdAt?.toDate ? notice.createdAt.toDate().toLocaleDateString() : ''}</span>
                      <span style={{ color: '#667eea', fontWeight: 'bold' }}>자세히 →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* 관리자 작성 모달 */}
      <FAB type="kakao" />
      </div>
    </>
  );
}

