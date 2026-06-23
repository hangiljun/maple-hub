'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PriceTier {
  label: string;
  maxQty: number | null;
  price: number;
  hot: boolean;
}

interface PriceTable {
  buy: PriceTier[];
  sell: PriceTier[];
}

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [priceTable, setPriceTable] = useState<PriceTable>({
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

  // 파일에서 가격 불러오기
  useEffect(() => {
    fetch('/api/meso-prices')
      .then(res => res.json())
      .then(data => setPriceTable(data))
      .catch(err => console.error('가격 로드 실패:', err));

    const savedAuth = localStorage.getItem('admin_auth');
    if (savedAuth === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // 로그인
  const handleLogin = () => {
    if (password === 'admin1234') {
      setIsLoggedIn(true);
      localStorage.setItem('admin_auth', 'true');
      alert('로그인 성공!');
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  // 로그아웃
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('admin_auth');
    setPassword('');
  };

  // 가격 변경
  const handlePriceChange = (type: 'buy' | 'sell', index: number, newPrice: number) => {
    const newTable = { ...priceTable };
    newTable[type][index].price = newPrice;
    setPriceTable(newTable);
  };

  // 저장
  const handleSave = async () => {
    try {
      const response = await fetch('/api/meso-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(priceTable)
      });

      if (response.ok) {
        alert('가격이 저장되었습니다!');
      } else {
        alert('저장 실패!');
      }
    } catch (error) {
      alert('저장 중 오류 발생!');
    }
  };

  // 초기화
  const handleReset = async () => {
    if (confirm('정말 초기화하시겠습니까?')) {
      const defaultTable: PriceTable = {
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
      };
      setPriceTable(defaultTable);

      try {
        await fetch('/api/meso-prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(defaultTable)
        });
        alert('초기화되었습니다!');
      } catch (error) {
        alert('초기화 중 오류 발생!');
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '48px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          width: '90%',
          maxWidth: '400px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '900',
            color: '#1a1a1a',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            🔐 관리자 로그인
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            메소 가격 관리
          </p>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '8px'
            }}>
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="관리자 비밀번호를 입력하세요"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid #e5e5e5',
                fontSize: '15px',
                fontWeight: '600'
              }}
            />
          </div>

          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)'
            }}
          >
            로그인
          </button>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#FEF3C7',
            borderRadius: '12px',
            fontSize: '13px',
            color: '#92400E',
            lineHeight: 1.6
          }}>
            💡 기본 비밀번호: admin1234
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* 헤더 */}
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '20px',
          marginBottom: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a1a', marginBottom: '8px' }}>
              🎛️ 메소 가격 관리
            </h1>
            <p style={{ fontSize: '14px', color: '#666' }}>
              메소 거래 시세를 설정합니다
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => router.push('/meso')}
              style={{
                padding: '12px 24px',
                background: '#0066CC',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              메소 페이지로
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '12px 24px',
                background: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              로그아웃
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', marginBottom: '32px' }}>

          {/* 구매가 (사이트가 유저로부터 메소를 구매) */}
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '900',
              color: '#7C3AED',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🪙 구매가 (사이트 → 유저)
            </h2>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px' }}>
              유저가 사이트에 메소를 판매할 때 가격
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {priceTable.buy.map((tier, index) => (
                <div key={index} style={{
                  padding: '20px',
                  background: '#F3E8FF',
                  borderRadius: '12px',
                  border: '1px solid #E4D1FF'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#7C3AED', marginBottom: '12px' }}>
                    {tier.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>1억당</span>
                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) => handlePriceChange('buy', index, parseInt(e.target.value))}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #E4D1FF',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#7C3AED'
                      }}
                    />
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>원</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 판매가 (사이트가 유저에게 메소를 판매) */}
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '900',
              color: '#0066CC',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💰 판매가 (유저 → 사이트)
            </h2>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px' }}>
              유저가 사이트에서 메소를 구매할 때 가격
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {priceTable.sell.map((tier, index) => (
                <div key={index} style={{
                  padding: '20px',
                  background: '#E6F3FF',
                  borderRadius: '12px',
                  border: '1px solid #B3D9FF'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0066CC', marginBottom: '12px' }}>
                    {tier.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>1억당</span>
                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) => handlePriceChange('sell', index, parseInt(e.target.value))}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #B3D9FF',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#0066CC'
                      }}
                    />
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>원</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 하단 버튼 */}
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          gap: '16px',
          justifyContent: 'center'
        }}>
          <button
            onClick={handleSave}
            style={{
              padding: '16px 48px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
            }}
          >
            💾 저장하기
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '16px 48px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
            }}
          >
            🔄 초기화
          </button>
        </div>

      </div>
    </div>
  );
}
