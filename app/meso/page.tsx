'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PriceTier {
  label: string;
  maxQty: number | null;
  price: number;
  hot: boolean;
}

export default function MesoPage() {
  const [server, setServer] = useState('스카니아');
  const [nickname, setNickname] = useState('');
  const [amount, setAmount] = useState('');
  const [contact, setContact] = useState('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  // 서버 목록 (리부트 제외)
  const challengersServers = ['챌린저스1', '챌린저스2', '챌린저스3', '챌린저스4'];
  const regularServers = ['스카니아', '루나', '엘리시움', '크로아', '베라', '오로라', '레드', '이노시스', '유니온', '아케인', '노바', '에오스', '헬리오스'];

  // 가격표 (localStorage에서 불러오기)
  const getDefaultPriceTable = () => ({
    buy: [
      { label: '1 ~ 100억', maxQty: 100, price: 1300, hot: false },
      { label: '101 ~ 300억', maxQty: 300, price: 1350, hot: false },
      { label: '301억 이상', maxQty: null, price: 1370, hot: true }
    ],
    sell: [
      { label: '1 ~ 100억', maxQty: 100, price: 1550, hot: true },
      { label: '101 ~ 300억', maxQty: 300, price: 1530, hot: false },
      { label: '301억 이상', maxQty: null, price: 1520, hot: false }
    ]
  });

  const [priceTable, setPriceTable] = useState(getDefaultPriceTable());

  // 가격 로드
  React.useEffect(() => {
    fetch('/api/meso-prices')
      .then(res => res.json())
      .then(data => setPriceTable(data))
      .catch(err => console.error('가격 로드 실패:', err));
  }, []);

  // 가격 계산 (유저가 구매 = 사이트 판매가 / 유저가 판매 = 사이트 구매가)
  const calculatePrice = () => {
    const qty = parseFloat(amount);
    if (isNaN(qty) || qty <= 0) return { total: 0, pricePerBillion: 0 };

    const table = tradeType === 'buy' ? priceTable.sell : priceTable.buy;

    for (const tier of table) {
      if (tier.maxQty === null || qty <= tier.maxQty) {
        return { total: Math.floor(qty * tier.price), pricePerBillion: tier.price };
      }
    }
    return { total: 0, pricePerBillion: 0 };
  };

  const { total: totalPrice, pricePerBillion } = calculatePrice();

  // 신청하기
  const handleSubmit = () => {
    if (!server || !nickname || !amount || !contact) {
      alert('모든 항목을 입력해주세요!');
      return;
    }

    const message = `[메소 ${tradeType === 'buy' ? '구매' : '판매'}]\n서버: ${server}\n닉네임: ${nickname}\n수량: ${amount}억\n연락처: ${contact}\n1억당 가격: ${pricePerBillion.toLocaleString()}원\n예상 금액: ${totalPrice.toLocaleString()}원`;

    // 클립보드에 복사
    navigator.clipboard.writeText(message);
    alert('신청 내용이 복사되었습니다!\n카카오톡 오픈채팅에 붙여넣어주세요.');

    // 카카오톡 오픈채팅 열기
    window.open('https://open.kakao.com/o/sx49Xazi', '_blank');
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
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
            <Link href="/items" style={{ color: '#64748B', textDecoration: 'none' }}>급처템</Link>
            <Link href="/meso" style={{ color: '#667eea', textDecoration: 'none', borderBottom: '2px solid #667eea', paddingBottom: '4px' }}>메소거래</Link>
            <Link href="/discord" style={{ color: '#64748B', textDecoration: 'none' }}>디스코드</Link>
            <Link href="/reviews" style={{ color: '#64748B', textDecoration: 'none' }}>이용후기</Link>
            <Link href="/notice" style={{ color: '#64748B', textDecoration: 'none' }}>공지사항</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>

        {/* 히어로 섹션 */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'rgba(0, 102, 204, 0.1)',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '700',
            color: '#0066CC',
            marginBottom: '20px'
          }}>
            메이플 메소 전문 거래
          </div>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '900',
            color: '#1a1a1a',
            marginBottom: '16px',
            letterSpacing: '-0.02em'
          }}>
            안전하고 신속한<br />메소 거래
          </h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px', lineHeight: 1.6 }}>
            빠르고 안전한 메이플스토리 메소 거래 서비스.<br />
            신청부터 처리까지 평균 5분 이내로 완료됩니다.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
              <span style={{ fontSize: '20px' }}>🛡️</span> 안전한 거래 보장
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
              <span style={{ fontSize: '20px' }}>⚡</span> 평균 5분 이내 처리
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
              <span style={{ fontSize: '20px' }}>💯</span> 100% 안전한 거래
            </div>
          </div>
        </div>

        {/* 메인 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          marginBottom: '60px'
        }}>

          {/* 왼쪽: 가격표 */}
          <div style={{
            background: '#fff',
            padding: '28px',
            borderRadius: '16px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #f5f5f5'
            }}>
              <h3 style={{
                fontWeight: '700',
                fontSize: '20px',
                color: '#1a1a1a',
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '22px' }}>📊</span>
                현재 시세
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <div style={{ fontSize: '12px', color: '#1a1a1a', fontWeight: '600' }}>
                  {new Date().toLocaleDateString('ko-KR')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666', fontWeight: '500' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'inline-block'
                  }} />
                  실시간 업데이트
                </div>
              </div>
            </div>

            {/* 구매가 */}
            <div style={{ marginBottom: '28px' }}>
              <p style={{
                color: '#0066CC',
                fontWeight: '700',
                fontSize: '16px',
                marginBottom: '12px',
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>💰</span>
                구매가
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {priceTable.buy.map((tier, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: tier.hot ? '#E6F3FF' : '#fafafa',
                      border: tier.hot ? '1.5px solid rgba(0, 102, 204, 0.2)' : '1px solid #e5e5e5',
                      borderRadius: '12px'
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
                      {tier.label}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {tier.hot && (
                        <span style={{
                          background: '#0066CC',
                          color: 'white',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '6px'
                        }}>
                          인기
                        </span>
                      )}
                      <span style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a1a' }}>
                        <span style={{ fontSize: '13px', color: '#666', marginRight: '4px', fontWeight: '500' }}>
                          1억당
                        </span>
                        {tier.price.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 구분선 */}
            <div style={{ height: '1px', background: '#e5e5e5', margin: '24px 0' }} />

            {/* 판매가 */}
            <div>
              <p style={{
                color: '#7C3AED',
                fontWeight: '700',
                fontSize: '16px',
                marginBottom: '12px',
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>🪙</span>
                판매가
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {priceTable.sell.map((tier, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: tier.hot ? '#F3E8FF' : '#fafafa',
                      border: tier.hot ? '1.5px solid rgba(124, 58, 237, 0.2)' : '1px solid #e5e5e5',
                      borderRadius: '12px'
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
                      {tier.label}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {tier.hot && (
                        <span style={{
                          background: '#7C3AED',
                          color: 'white',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '6px'
                        }}>
                          인기
                        </span>
                      )}
                      <span style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a1a' }}>
                        <span style={{ fontSize: '13px', color: '#666', marginRight: '4px', fontWeight: '500' }}>
                          1억당
                        </span>
                        {tier.price.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 안내 */}
            <div style={{
              marginTop: '20px',
              padding: '12px 14px',
              background: '#f5f5f5',
              borderRadius: '10px',
              fontSize: '13px',
              color: '#666',
              lineHeight: 1.6
            }}>
              ※ 수량·서버에 따라 변동될 수 있습니다
            </div>
          </div>

          {/* 중앙: 신청 폼 */}
          <div style={{
            background: '#fff',
            padding: '28px',
            borderRadius: '16px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '24px' }}>
              💳 거래 신청
            </h3>

            {/* 거래 유형 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px', display: 'block' }}>
                거래 유형
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setTradeType('buy')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: tradeType === 'buy' ? '2px solid #0066CC' : '1px solid #e5e5e5',
                    background: tradeType === 'buy' ? '#E6F3FF' : 'white',
                    color: tradeType === 'buy' ? '#0066CC' : '#666',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  💰 메소 구매
                </button>
                <button
                  onClick={() => setTradeType('sell')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: tradeType === 'sell' ? '2px solid #7C3AED' : '1px solid #e5e5e5',
                    background: tradeType === 'sell' ? '#F3E8FF' : 'white',
                    color: tradeType === 'sell' ? '#7C3AED' : '#666',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  🪙 메소 판매
                </button>
              </div>
            </div>

            {/* 서버 선택 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px', display: 'block' }}>
                서버 선택
              </label>
              <select
                value={server}
                onChange={(e) => setServer(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #e5e5e5',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  background: '#fafafa'
                }}
              >
                <optgroup label="챌린저스 서버">
                  {challengersServers.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </optgroup>
                <optgroup label="일반 서버">
                  {regularServers.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* 닉네임 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px', display: 'block' }}>
                캐릭터 닉네임
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="게임 내 캐릭터 닉네임"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #e5e5e5',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  background: '#fafafa'
                }}
              />
            </div>

            {/* 수량 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px', display: 'block' }}>
                거래 수량 (억)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="예: 100 (100억)"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #e5e5e5',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  background: '#fafafa'
                }}
              />
            </div>

            {/* 연락처 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px', display: 'block' }}>
                연락처 (카톡ID 또는 전화번호)
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="예: kakao123 또는 010-1234-5678"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #e5e5e5',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  background: '#fafafa'
                }}
              />
            </div>

            {/* 계산 결과 */}
            {amount && totalPrice > 0 && (
              <div style={{
                background: tradeType === 'buy' ? '#E6F3FF' : '#F3E8FF',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px',
                border: tradeType === 'buy' ? '1px solid #B3D9FF' : '1px solid #E4D1FF'
              }}>
                <div style={{ fontSize: '13px', color: tradeType === 'buy' ? '#0066CC' : '#7C3AED', marginBottom: '4px', fontWeight: '600' }}>
                  1억당 {tradeType === 'buy' ? '구매' : '판매'}가: {pricePerBillion.toLocaleString()}원
                </div>
                <div style={{ fontSize: '13px', color: tradeType === 'buy' ? '#0066CC' : '#7C3AED', marginBottom: '8px', fontWeight: '600' }}>
                  수량: {amount}억
                </div>
                <div style={{ height: '1px', background: tradeType === 'buy' ? '#B3D9FF' : '#E4D1FF', margin: '12px 0' }}></div>
                <div style={{ fontSize: '13px', color: tradeType === 'buy' ? '#0066CC' : '#7C3AED', marginBottom: '8px', fontWeight: '600' }}>
                  예상 {tradeType === 'buy' ? '구매' : '판매'} 금액
                </div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: tradeType === 'buy' ? '#0066CC' : '#7C3AED' }}>
                  {totalPrice.toLocaleString()}원
                </div>
              </div>
            )}

            {/* 신청 버튼 */}
            <button
              onClick={handleSubmit}
              style={{
                width: '100%',
                padding: '18px',
                background: 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '17px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)'
              }}
            >
              신청하기 (문구 자동 복사)
            </button>
          </div>

          {/* 오른쪽: 거래 방법 */}
          <div style={{
            background: '#fff',
            padding: '28px',
            borderRadius: '16px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '24px' }}>
              📝 거래 방법
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                '서버·닉네임·수량을 폼에 입력',
                '[신청 버튼] 클릭 → 신청 문구 자동 복사',
                '오픈채팅방 입장 후 Ctrl+V 붙여넣기',
                '담당자 확인 후 5분 이내 처리 완료'
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    minWidth: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '900',
                    color: 'white'
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: '600', lineHeight: 1.6, paddingTop: '4px' }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: '#FEF3C7',
              borderRadius: '12px',
              fontSize: '13px',
              color: '#92400E',
              lineHeight: 1.6,
              fontWeight: '500'
            }}>
              ⚠️ <strong>안전 거래 안내</strong><br />
              • 최소 50억 메소부터 거래 가능<br />
              • 선입금 절대 금지<br />
              • 게임 내 직접 거래<br />
              • 365일 24시간 운영
            </div>
          </div>

        </div>

      </div>

      {/* 고정 카카오톡 문의 버튼 */}
      <a
        href="https://open.kakao.com/o/sfxfJyAi"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          padding: '16px 32px',
          background: 'linear-gradient(135deg, #FEE500 0%, #FFD400 100%)',
          color: '#3C1E1E',
          borderRadius: '50px',
          fontSize: '16px',
          fontWeight: '900',
          textDecoration: 'none',
          boxShadow: '0 8px 32px rgba(254, 229, 0, 0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          border: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(254, 229, 0, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(254, 229, 0, 0.4)';
        }}
      >
        <span style={{ fontSize: '20px' }}>💬</span>
        <span>카톡 문의하기</span>
      </a>
    </div>
  );
}
