'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ItemsPage() {
  const [selectedServer, setSelectedServer] = useState('전체');
  const [selectedType, setSelectedType] = useState('전체');

  const items = [
    { id: 1, server: '스카니아', type: '팝니다', itemName: '22성 앱솔 완판 세트', price: '80억', seller: '메이플마스터', contact: '카톡' },
    { id: 2, server: '리부트', type: '팝니다', itemName: '에테르넬 플레임 1셋', price: '협의', seller: '불독123', contact: '디코' },
    { id: 3, server: '루나', type: '팝니다', itemName: '3줄큐브 300개 일괄', price: '개당 3천만', seller: '큐브왕', contact: '카톡' },
    { id: 4, server: '크로아', type: '팝니다', itemName: '18성 아케인 무기', price: '120억', seller: '크로아유저', contact: '카톡' },
    { id: 5, server: '메이플랜드', type: '팝니다', itemName: '공격의징표 50개', price: '협의', seller: '랜드마스터', contact: '디코' }
  ];

  const servers = ['전체', '스카니아', '루나', '크로아', '리부트', '메이플랜드'];
  const types = ['전체', '팝니다'];

  const filteredItems = items.filter(item =>
    (selectedServer === '전체' || item.server === selectedServer) &&
    (selectedType === '전체' || item.type === selectedType)
  );

  return (
    <div style={{ backgroundColor: '#FAFBFC', minHeight: '100vh' }}>
      {/* 고정 헤더 */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'white',
        borderBottom: '2px solid #667eea',
        padding: '20px 5%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '28px', fontWeight: '900', color: '#667eea', textDecoration: 'none' }}>
            🍁 메이플 허브
          </Link>
          <div style={{ display: 'flex', gap: '32px', fontSize: '16px', fontWeight: '600' }}>
            <Link href="/" style={{ color: '#64748B', textDecoration: 'none' }}>홈</Link>
            <Link href="/items" style={{ color: '#667eea', textDecoration: 'none', borderBottom: '2px solid #667eea', paddingBottom: '4px' }}>급처템</Link>
            <Link href="/meso" style={{ color: '#64748B', textDecoration: 'none' }}>메소거래</Link>
            <Link href="/discord" style={{ color: '#64748B', textDecoration: 'none' }}>디스코드</Link>
            <Link href="/reviews" style={{ color: '#64748B', textDecoration: 'none' }}>이용후기</Link>
            <Link href="/notice" style={{ color: '#64748B', textDecoration: 'none' }}>공지사항</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>

        {/* 페이지 제목 */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1E293B', marginBottom: '12px' }}>
            ⚡ 급처템 구매
          </h1>
          <p style={{ fontSize: '16px', color: '#64748B' }}>
            판매자들이 올린 급처템을 확인하고 구매하세요
          </p>
        </div>

        {/* 거래 방법 안내 */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          borderRadius: '20px',
          marginBottom: '40px',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '24px' }}>
            💡 급처템 구매 방법
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '900', marginBottom: '12px' }}>1</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>원하는 아이템 찾기</h3>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>서버별로 필터링하여 원하는 아이템을 검색합니다</p>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '900', marginBottom: '12px' }}>2</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>가격 확인</h3>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>게시글의 가격을 확인하고 협의 여부를 체크합니다</p>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '900', marginBottom: '12px' }}>3</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>판매자 연락</h3>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>카톡 또는 디스코드로 판매자에게 연락합니다</p>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '900', marginBottom: '12px' }}>4</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>게임 내 거래</h3>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>약속한 시간에 게임 접속 후 안전하게 구매합니다</p>
            </div>
          </div>

          <div style={{
            marginTop: '32px',
            padding: '20px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
            lineHeight: 1.8
          }}>
            <strong>⚠️ 안전 구매 팁:</strong><br />
            • 선입금은 절대 하지 마세요<br />
            • 게임 내에서 직접 거래하세요<br />
            • 거래 전 판매자 캐릭터를 확인하세요<br />
            • 의심스러운 거래는 피하세요
          </div>
        </div>

        {/* 필터 */}
        <div style={{ marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748B', marginBottom: '8px' }}>서버 선택</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {servers.map(server => (
                <button
                  key={server}
                  onClick={() => setSelectedServer(server)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: selectedServer === server ? '2px solid #667eea' : '2px solid #E5E7EB',
                    background: selectedServer === server ? '#667eea' : 'white',
                    color: selectedServer === server ? 'white' : '#64748B',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {server}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 거래글 목록 */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          {/* 테이블 헤더 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '100px 80px 1fr 120px 120px 120px',
            padding: '20px',
            background: '#F9FAFB',
            borderBottom: '1px solid #E5E7EB',
            fontSize: '14px',
            fontWeight: '700',
            color: '#64748B'
          }}>
            <div>서버</div>
            <div>구분</div>
            <div>아이템명</div>
            <div>판매자</div>
            <div>가격</div>
            <div>연락하기</div>
          </div>

          {/* 거래글 */}
          {filteredItems.map(item => (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 80px 1fr 120px 120px 120px',
                padding: '20px',
                borderBottom: '1px solid #F1F5F9',
                alignItems: 'center',
                transition: 'background 0.2s',
                cursor: 'pointer'
              }}
            >
              <div>
                <span style={{
                  padding: '6px 12px',
                  background: '#E0E7FF',
                  color: '#667eea',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700'
                }}>
                  {item.server}
                </span>
              </div>
              <div>
                <span style={{
                  padding: '6px 12px',
                  background: '#FEF3C7',
                  color: '#F59E0B',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700'
                }}>
                  {item.type}
                </span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#1E293B' }}>
                {item.itemName}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748B' }}>
                {item.seller}
              </div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#F59E0B' }}>
                {item.price}
              </div>
              <div>
                <button style={{
                  padding: '10px 20px',
                  background: item.contact === '카톡' ? '#FEE500' : '#5865F2',
                  color: item.contact === '카톡' ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}>
                  {item.contact}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
            해당 서버의 거래글이 없습니다.
          </div>
        )}

      </div>
    </div>
  );
}
