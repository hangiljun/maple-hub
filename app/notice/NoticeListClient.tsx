'use client';

import React, { useState } from 'react';
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
  createdAt: string;
}

interface NoticeListClientProps {
  initialNotices: Notice[];
}

export default function NoticeListClient({ initialNotices }: NoticeListClientProps) {
  const [activeTab, setActiveTab] = useState('전체');
  const categories = ['전체', '공지사항'];

  const filteredNotices = activeTab === '전체'
    ? initialNotices
    : initialNotices.filter(n => n.category === activeTab);

  const extractFirstImg = (content: string) => {
    if (!content) return null;
    const imgReg = /<img[^>]+src=["']([^"']+)["']/;
    const match = imgReg.exec(content);
    return match ? match[1] : null;
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: '#1E293B' }}>
      <Navigation currentPage="notice" />

      {/* 배너 */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1200px', height: '300px', position: 'relative', overflow: 'hidden' }}>
          <img
            src="/notice-banner.png"
            alt="메이플 허브 공지사항 - 최신 소식 및 업데이트"
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>

        {/* 카테고리 탭 */}
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
                      <time dateTime={notice.createdAt}>
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </time>
                      <span style={{ color: '#667eea', fontWeight: 'bold' }}>자세히 →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* SEO 텍스트 섹션 - 간결하게 */}
        <div style={{
          marginTop: '80px',
          marginBottom: '60px',
          padding: '40px',
          background: 'white',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: '#1E293B',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            📢 공지사항 안내
          </h2>
          <div style={{
            fontSize: '15px',
            color: '#475569',
            lineHeight: 1.8,
            textAlign: 'left'
          }}>
            <p style={{ marginBottom: '20px' }}>
              메이플 허브 공지사항에서는 <strong style={{ color: '#667eea' }}>디스코드 소식, 메이플 이슈, 급처템 구매 관련 소식, 이벤트 정보</strong> 등
              유저 여러분께 필요한 최신 정보를 전달합니다.
            </p>

            <div style={{
              background: '#F8FAFC',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '18px', marginBottom: '8px' }}>💬</div>
                  <strong style={{ color: '#1E293B', fontSize: '14px' }}>디스코드 소식</strong>
                  <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                    채널 업데이트, 인증 방법 변경 등
                  </p>
                </div>
                <div>
                  <div style={{ fontSize: '18px', marginBottom: '8px' }}>⚠️</div>
                  <strong style={{ color: '#1E293B', fontSize: '14px' }}>주의 소식</strong>
                  <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                    최근 사기 수법, 유저 주의사항
                  </p>
                </div>
                <div>
                  <div style={{ fontSize: '18px', marginBottom: '8px' }}>🔥</div>
                  <strong style={{ color: '#1E293B', fontSize: '14px' }}>메이플 이슈</strong>
                  <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                    패치 소식, 시세 변동 정보
                  </p>
                </div>
                <div>
                  <div style={{ fontSize: '18px', marginBottom: '8px' }}>💰</div>
                  <strong style={{ color: '#1E293B', fontSize: '14px' }}>급처템 구매</strong>
                  <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                    매입 정책, 정산 안내
                  </p>
                </div>
                <div>
                  <div style={{ fontSize: '18px', marginBottom: '8px' }}>🎉</div>
                  <strong style={{ color: '#1E293B', fontSize: '14px' }}>이벤트</strong>
                  <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                    특별 할인, 보너스 지급
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '20px',
              borderRadius: '12px',
              color: 'white',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '14px', lineHeight: 1.6 }}>
                📌 <strong>고정 공지는 꼭 확인하세요!</strong><br />
                중요한 소식은 상단에 고정되어 있습니다.
              </p>
            </div>
          </div>
        </div>

      </div>

      <FAB type="kakao" />
    </div>
  );
}
