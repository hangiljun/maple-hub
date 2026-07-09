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

        {/* SEO 텍스트 섹션 1: 공지사항의 중요성 */}
        <div style={{
          marginTop: '80px',
          marginBottom: '60px',
          padding: '48px',
          background: 'white',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '900',
            color: '#1E293B',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            📢 메이플 허브 공지사항, 왜 확인해야 할까요?
          </h2>
          <div style={{
            fontSize: '15px',
            color: '#475569',
            lineHeight: 1.9,
            textAlign: 'left'
          }}>
            <p style={{ marginBottom: '20px' }}>
              메이플 허브 공지사항은 급처템 거래와 디스코드 커뮤니티 운영에 관한 모든 중요한 소식을 전달하는 공간입니다.
              <strong style={{ color: '#667eea' }}>서비스 업데이트, 거래 정책 변경, 특별 이벤트, 점검 안내</strong> 등
              메이플 허브를 이용하시는 모든 분들께 꼭 필요한 정보가 실시간으로 공유됩니다.
            </p>
            <p style={{ marginBottom: '20px' }}>
              특히 메이플스토리 아이템 시세는 패치와 이벤트에 따라 수시로 변동되기 때문에,
              공지사항을 통해 최신 시세 정보와 거래 트렌드를 파악하는 것이 중요합니다.
              또한 사기 예방 가이드, 안전 거래 수칙, 금지 행위 안내 등 안전한 거래를 위한 필수 정보도 제공됩니다.
            </p>
            <p style={{ marginBottom: '20px' }}>
              공지사항을 정기적으로 확인하시면 메이플 허브의 신규 서비스나 혜택을 가장 먼저 접할 수 있으며,
              예상치 못한 서비스 중단이나 변경 사항을 미리 알고 대비할 수 있습니다.
              모든 공지사항은 고정(📌) 기능으로 중요한 공지를 상단에 노출하여 놓치지 않도록 돕습니다.
            </p>
          </div>
        </div>

        {/* SEO 텍스트 섹션 2: 주요 공지 카테고리 */}
        <div style={{
          marginBottom: '60px',
          padding: '48px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '24px',
          color: 'white',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '900',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            📋 주요 공지사항 카테고리
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '28px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔔</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
                서비스 업데이트
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                메이플 허브의 새로운 기능 추가, UI/UX 개선, 시스템 업그레이드 등
                서비스 개선 사항을 안내합니다. 더 나은 사용자 경험을 위한 지속적인 발전 과정을 공유합니다.
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '28px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>💰</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
                거래 정책 안내
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                급처템 매입 기준, 시세 산정 방식, 정산 절차 변경 등 거래 관련 중요 정책을
                투명하게 공개합니다. 공정하고 합리적인 거래를 위한 운영 원칙을 확인하세요.
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '28px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🎉</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
                이벤트 소식
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                특별 할인 이벤트, 추가 보너스 지급, 경품 행사 등 유저 여러분께 드리는
                다양한 혜택 정보를 가장 먼저 전해드립니다. 놓치지 말고 참여하세요!
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '28px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔧</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
                점검 및 장애 안내
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                정기/긴급 점검 일정, 시스템 장애 발생 현황, 복구 진행 상황 등을 실시간으로 안내합니다.
                서비스 이용에 불편함이 없도록 사전 공지해드립니다.
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '28px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🛡️</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
                보안 및 사기 예방
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                최근 발생한 사기 수법, 피싱 사이트 주의보, 안전 거래 가이드 등
                유저 보호를 위한 보안 정보를 제공합니다. 안전한 거래 환경을 만들어갑니다.
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '28px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>💬</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
                디스코드 커뮤니티
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                디스코드 채널 추가/변경, 인증 방법 업데이트, 커뮤니티 규칙 개정 등
                메이플 디스코드 운영에 관한 모든 소식을 전달합니다.
              </p>
            </div>
          </div>
        </div>

        {/* SEO 텍스트 섹션 3: 공지 알림 받는 방법 */}
        <div style={{
          marginBottom: '60px',
          padding: '48px',
          background: 'white',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '900',
            color: '#1E293B',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            🔔 공지사항 알림 받는 방법
          </h2>
          <div style={{
            fontSize: '15px',
            color: '#475569',
            lineHeight: 1.9,
            textAlign: 'left'
          }}>
            <p style={{ marginBottom: '24px' }}>
              중요한 공지사항을 놓치지 않으려면 다양한 알림 채널을 활용하세요.
              메이플 허브는 여러분이 필요한 정보를 적시에 받아볼 수 있도록 다양한 경로로 공지합니다.
            </p>

            <div style={{
              background: '#F8FAFC',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '20px',
              border: '1px solid #E2E8F0'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#667eea', marginBottom: '16px' }}>
                📱 알림 받는 3가지 방법
              </h3>
              <div style={{ fontSize: '14px', lineHeight: 2, color: '#475569' }}>
                <div style={{ marginBottom: '16px', paddingLeft: '20px' }}>
                  <strong style={{ color: '#1E293B' }}>1. 공지사항 페이지 방문</strong><br />
                  메이플 허브 웹사이트의 공지사항 메뉴를 통해 모든 공지를 한눈에 확인할 수 있습니다.
                  고정된 중요 공지는 상단에 📌 표시됩니다.
                </div>
                <div style={{ marginBottom: '16px', paddingLeft: '20px' }}>
                  <strong style={{ color: '#1E293B' }}>2. 디스코드 공지 채널</strong><br />
                  메이플 허브 디스코드 서버의 전용 공지 채널에서 실시간 알림을 받을 수 있습니다.
                  디스코드 앱 알림 설정을 켜두면 새 공지를 즉시 확인할 수 있습니다.
                </div>
                <div style={{ paddingLeft: '20px' }}>
                  <strong style={{ color: '#1E293B' }}>3. 카카오톡 문의 채널</strong><br />
                  카카오톡 오픈채팅방에서도 주요 공지사항을 전달해드립니다.
                  거래 문의 시 최신 공지사항도 함께 안내받으실 수 있습니다.
                </div>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #F59E0B'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#92400E', marginBottom: '12px' }}>
                💡 공지사항 확인 TIP
              </h3>
              <ul style={{ fontSize: '14px', lineHeight: 2, paddingLeft: '20px', color: '#78350F' }}>
                <li>거래 전에는 반드시 최신 공지사항을 확인하세요 (정책 변경 가능)</li>
                <li>📌 고정 공지는 특히 중요한 내용이니 꼭 읽어보세요</li>
                <li>점검 공지를 미리 확인하면 서비스 이용 계획을 세울 수 있습니다</li>
                <li>이벤트 공지는 기한이 있으니 놓치지 말고 참여하세요</li>
                <li>문의하기 전에 FAQ나 최근 공지사항을 먼저 확인하면 더 빠른 해결이 가능합니다</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEO 텍스트 섹션 4: 투명한 운영 */}
        <div style={{
          marginBottom: '60px',
          padding: '48px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '900',
            color: '#1E293B',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            ✨ 투명하고 신뢰할 수 있는 운영
          </h2>
          <div style={{
            fontSize: '15px',
            color: '#475569',
            lineHeight: 1.9,
            textAlign: 'left'
          }}>
            <p style={{ marginBottom: '20px' }}>
              메이플 허브는 <strong style={{ color: '#667eea' }}>투명한 정보 공개</strong>를 최우선 가치로 삼습니다.
              모든 서비스 변경 사항, 정책 업데이트, 점검 일정은 사전에 공지하며,
              유저 여러분의 의견을 적극 수렴하여 서비스를 개선해 나갑니다.
            </p>
            <p style={{ marginBottom: '20px' }}>
              특히 급처템 거래는 신뢰가 가장 중요한 만큼, 시세 산정 기준, 매입 정책, 정산 절차 등
              모든 거래 관련 정보를 투명하게 공개합니다. 불합리하거나 일방적인 정책 변경은 절대 하지 않으며,
              변경이 필요한 경우 충분한 사전 공지와 함께 유예 기간을 드립니다.
            </p>
            <p style={{ marginBottom: '20px' }}>
              공지사항을 통해 메이플 허브의 운영 철학과 방향성을 확인하실 수 있으며,
              궁금한 점이나 건의사항이 있으시면 언제든 카카오톡이나 디스코드를 통해 문의해주세요.
              여러분의 목소리가 메이플 허브를 더 나은 서비스로 만듭니다.
            </p>

            <div style={{
              marginTop: '32px',
              padding: '24px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '16px', color: '#1E293B', lineHeight: 1.8 }}>
                <strong style={{ color: '#667eea' }}>메이플 허브는 항상 유저와 함께 성장합니다</strong><br />
                <span style={{ fontSize: '14px', color: '#64748B' }}>
                  공지사항을 통해 더 나은 서비스로 발전하는 메이플 허브를 지켜봐 주세요!
                </span>
              </p>
            </div>
          </div>
        </div>

      </div>

      <FAB type="kakao" />
    </div>
  );
}
