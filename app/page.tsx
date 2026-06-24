'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{
      backgroundColor: '#FAFBFC',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F4FF 50%, #E8F0FE 100%)',
      minHeight: '100vh'
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
        * { font-family: 'Noto Sans KR', sans-serif; margin: 0; padding: 0; box-sizing: border-box; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .float-animation {
          animation: float 6s ease-in-out infinite;
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .card-hover:hover {
          transform: translateY(-12px) scale(1.02);
        }
      `}</style>

      {/* 고정 헤더 */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.85)',
        borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
        padding: '18px 5%',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 2px 20px rgba(102, 126, 234, 0.08)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{
            fontSize: '22px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🍁 메이플 허브
          </Link>
          <div style={{ display: 'flex', gap: '32px', fontSize: '15px', fontWeight: '600' }}>
            <Link href="/" style={{
              color: '#667eea',
              textDecoration: 'none',
              borderBottom: '2px solid #667eea',
              paddingBottom: '4px'
            }}>홈</Link>
            <Link href="/items" style={{ color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }}>급처템</Link>
            <Link href="/meso" style={{ color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }}>메소거래</Link>
            <Link href="/discord" style={{ color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }}>디스코드</Link>
            <Link href="/reviews" style={{ color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }}>이용후기</Link>
            <Link href="/notice" style={{ color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }}>공지사항</Link>
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(40px, 8vw, 80px) clamp(16px, 4vw, 20px)' }}>

        {/* 상단 상태 바 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          fontSize: '13px',
          color: '#64748B'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
            <span>실시간 운영 중</span>
          </div>
          <span>|</span>
          <div>⚡ 평균 응답 1분</div>
        </div>

        {/* 메인 타이틀 */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            lineHeight: 1.2
          }}>
            메이플스토리 거래의 모든 것
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#64748B',
            marginBottom: '40px'
          }}>
            안전하고 빠른 거래를 시작하세요
          </p>
        </div>

        {/* 메인 카드 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: '24px',
          marginBottom: '60px',
          perspective: '1000px'
        }}>

          {/* 급처템 홍보 카드 */}
          <Link href="/items" style={{ textDecoration: 'none' }}>
            <div className="card-hover" style={{
              background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
              padding: '48px 32px',
              borderRadius: '24px',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 20px 60px rgba(102, 126, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            }}>
              {/* 배경 장식 */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                borderRadius: '50%'
              }}></div>

              <div>
                <div className="float-animation" style={{
                  fontSize: '72px',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 4px 12px rgba(102, 126, 234, 0.3))'
                }}>⚡</div>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  marginBottom: '16px',
                  color: '#4C1D95'
                }}>급처템 홍보</h3>
                <p style={{
                  fontSize: '15px',
                  color: '#5B21B6',
                  lineHeight: 1.7,
                  opacity: 0.9
                }}>
                  아이템을 빠르게 판매하거나<br />구매할 수 있습니다
                </p>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#667eea',
                fontWeight: '700',
                marginTop: '24px'
              }}>
                → 거래 방법 보러가기
              </div>
            </div>
          </Link>

          {/* 메소 거래 카드 */}
          <Link href="/meso" style={{ textDecoration: 'none' }}>
            <div className="card-hover" style={{
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              padding: '48px 32px',
              borderRadius: '24px',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 20px 60px rgba(245, 158, 11, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            }}>
              {/* 배경 장식 */}
              <div style={{
                position: 'absolute',
                bottom: '-50px',
                left: '-50px',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                borderRadius: '50%'
              }}></div>

              <div>
                <div className="float-animation" style={{
                  fontSize: '72px',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 4px 12px rgba(245, 158, 11, 0.3))',
                  animationDelay: '1s'
                }}>💰</div>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  marginBottom: '16px',
                  color: '#92400E'
                }}>메소 거래</h3>
                <p style={{
                  fontSize: '15px',
                  color: '#B45309',
                  lineHeight: 1.7,
                  opacity: 0.9
                }}>
                  안전한 메소 거래<br />실시간 시세 확인
                </p>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#f59e0b',
                fontWeight: '700',
                marginTop: '24px'
              }}>
                → 시세 보러가기
              </div>
            </div>
          </Link>

          {/* 디스코드 홍보 카드 */}
          <Link href="/discord" style={{ textDecoration: 'none' }}>
            <div className="card-hover" style={{
              background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
              padding: '48px 32px',
              borderRadius: '24px',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 20px 60px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            }}>
              {/* 배경 장식 */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                left: '-30px',
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                borderRadius: '50%'
              }}></div>

              <div>
                <div className="float-animation" style={{
                  fontSize: '72px',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3))',
                  animationDelay: '2s'
                }}>💬</div>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  marginBottom: '16px',
                  color: '#1E3A8A'
                }}>디스코드 홍보</h3>
                <p style={{
                  fontSize: '15px',
                  color: '#1E40AF',
                  lineHeight: 1.7,
                  opacity: 0.9
                }}>
                  길드, 파티 모집<br />커뮤니티 홍보
                </p>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#3b82f6',
                fontWeight: '700',
                marginTop: '24px'
              }}>
                → 디스코드 보러가기
              </div>
            </div>
          </Link>

        </div>

        {/* 이용후기 대형 카드 */}
        <Link href="/reviews" style={{ textDecoration: 'none', display: 'block', marginBottom: '80px' }}>
          <div className="card-hover" style={{
            background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
            padding: '56px 48px',
            borderRadius: '28px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 20px 60px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '40px'
          }}>
            {/* 배경 장식 */}
            <div style={{
              position: 'absolute',
              bottom: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
              borderRadius: '50%'
            }}></div>

            <div style={{ flex: 1, zIndex: 1 }}>
              <div className="float-animation" style={{
                fontSize: '96px',
                marginBottom: '24px',
                filter: 'drop-shadow(0 4px 16px rgba(16, 185, 129, 0.3))',
                animationDelay: '0.5s'
              }}>⭐</div>
              <h3 style={{
                fontSize: '36px',
                fontWeight: '900',
                marginBottom: '20px',
                color: '#065F46'
              }}>이용후기</h3>
              <p style={{
                fontSize: '18px',
                color: '#047857',
                lineHeight: 1.8,
                opacity: 0.9
              }}>
                실제 거래 후기를 확인하고<br />
                직접 후기를 작성해보세요
              </p>
            </div>
            <div style={{
              fontSize: '16px',
              color: '#10b981',
              fontWeight: '700',
              zIndex: 1
            }}>
              → 후기 보러가기
            </div>
          </div>
        </Link>

        {/* 공지사항 섹션 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          padding: '48px',
          borderRadius: '24px',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          marginBottom: '80px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.08)'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '900',
            color: '#1E293B',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            📢 공지사항
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { title: '사이트 오픈 안내', date: '2026-06-23' },
              { title: '안전거래 가이드', date: '2026-06-20' },
              { title: '이용 약관 안내', date: '2026-06-18' }
            ].map((notice, i) => (
              <Link key={i} href="/notice" style={{
                textDecoration: 'none',
                padding: '20px 24px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.3s',
                border: '1px solid rgba(102, 126, 234, 0.08)'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B' }}>{notice.title}</span>
                <span style={{ fontSize: '14px', color: '#64748B' }}>{notice.date}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 거래 방법 안내 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(240, 244, 255, 0.6) 0%, rgba(224, 231, 255, 0.6) 100%)',
          padding: '56px 48px',
          borderRadius: '28px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.12)'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '900',
            color: '#1E293B',
            marginBottom: '48px',
            textAlign: 'center'
          }}>
            간편한 거래 방법
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))',
            gap: '24px'
          }}>
            {[
              { num: '1', title: '원하는 메뉴 선택', desc: '급처템/메소/디스코드' },
              { num: '2', title: '거래글 확인', desc: '실시간 거래 정보' },
              { num: '3', title: '연락하기', desc: '카톡/디스코드' },
              { num: '4', title: '안전 거래', desc: '거래 완료' }
            ].map((step, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '36px',
                  fontWeight: '900',
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748B' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 이용후기 섹션 (구글 연동 전 임시 비활성화) */}
      {/* 구글 연동 후 활성화 예정 */}

      {/* 푸터 */}
      <footer style={{
        background: '#1E293B',
        padding: '48px 20px',
        color: 'white',
        textAlign: 'center',
        marginTop: '80px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '28px', fontWeight: '900', marginBottom: '16px' }}>🍁 메이플 허브</div>
          <p style={{ fontSize: '15px', opacity: 0.7, marginBottom: '24px' }}>
            메이플스토리 거래의 모든 것
          </p>
          <div style={{ fontSize: '13px', opacity: 0.5, lineHeight: 1.8 }}>
            <p>© 2026 메이플 허브. All rights reserved.</p>
            <p style={{ marginTop: '12px' }}>
              본 사이트는 거래 중개 플랫폼이 아닌 홍보 공간이며,<br />
              당사자 간의 직거래로 인해 발생하는 피해에 대해 책임을 지지 않습니다.
            </p>
          </div>
        </div>
      </footer>

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
        <span>han8246 카톡</span>
      </a>
    </div>
  );
}
