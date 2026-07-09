'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import FAB from '@/components/FAB';

export default function DiscordPage() {
  const [members, setMembers] = useState(47529);
  const [activity, setActivity] = useState(85);
  const [chats, setChats] = useState(105);

  // 3분마다 통계 업데이트
  useEffect(() => {
    // 하루에 150명씩 증가 = 분당 약 0.104명
    const dailyIncrease = 150 / (24 * 60); // 분당 증가량

    const interval = setInterval(() => {
      // 회원수: 하루 150명씩 증가
      setMembers(prev => Math.floor(prev + dailyIncrease * 3));

      // 활동수: 80~90 사이 랜덤
      setActivity(Math.floor(Math.random() * 11) + 80);

      // 채팅수: 100~110 사이 랜덤
      setChats(Math.floor(Math.random() * 11) + 100);
    }, 180000); // 3분 = 180000ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#FAFBFC', minHeight: '100vh' }}>
      <style jsx global>{`
        @media (max-width: 768px) {
          .discord-banner {
            height: 300px !important;
          }
          .discord-banner-title {
            font-size: 24px !important;
          }
          .discord-banner-text {
            font-size: 14px !important;
          }
          .discord-banner-button {
            padding: 16px 32px !important;
            font-size: 16px !important;
          }
          .discord-stat-card {
            padding: 24px 20px !important;
          }
          .discord-stat-number {
            font-size: 32px !important;
          }
          .discord-content-padding {
            padding: 30px 16px !important;
          }
          .discord-section-title {
            font-size: 20px !important;
          }
          .discord-channel-list {
            font-size: 14px !important;
          }
        }
      `}</style>

      <Navigation currentPage="discord" />

      <div className="discord-content-padding" style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>

        {/* 디스코드 이미지 배너 */}
        <div className="discord-banner" style={{
          width: '100%',
          height: '600px',
          borderRadius: '20px',
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(88, 101, 242, 0.3)'
        }}>
          <img
            src="/discord.png"
            alt="메이플 디스코드"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          {/* 참가하기 버튼 오버레이 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
            padding: '80px 40px 40px',
            textAlign: 'center'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="discord-banner-title" style={{ fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '16px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                지금 바로 참여하세요!
              </h2>
              <p className="discord-banner-text" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.95)', marginBottom: '32px' }}>
                {members.toLocaleString()}명의 메이플 유저와 함께하는 공간
              </p>
              <a
                href="https://discord.gg/2UwBw8dnSv"
                target="_blank"
                rel="noopener noreferrer"
                className="discord-banner-button"
                style={{
                  display: 'inline-block',
                  padding: '20px 60px',
                  background: 'linear-gradient(135deg, #5865F2 0%, #7289DA 100%)',
                  color: 'white',
                  borderRadius: '16px',
                  fontSize: '20px',
                  fontWeight: '900',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(88, 101, 242, 0.5)',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(88, 101, 242, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(88, 101, 242, 0.5)';
                }}
              >
                디스코드 참가하기 →
              </a>
            </div>
          </div>
        </div>

        {/* 서버 카테고리 */}
        <div style={{
          display: 'inline-block',
          padding: '8px 20px',
          backgroundColor: '#10b981',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '700',
          color: 'white',
          marginBottom: '32px'
        }}>
          게임 • 최소 14세 부터 참여 가능
        </div>

        {/* 통계 카드 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '48px' }}>

          {/* 회원수 */}
          <div className="discord-stat-card" style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            padding: '32px 24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>👥 회원수</div>
            <div className="discord-stat-number" style={{ fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>{members.toLocaleString()}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>하루 150명씩 증가 중</div>
          </div>

          {/* 활동수 */}
          <div className="discord-stat-card" style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
            padding: '32px 24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>⚡ 활동수</div>
            <div className="discord-stat-number" style={{ fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>{activity}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>3분마다 갱신</div>
          </div>

          {/* 채팅수 */}
          <div className="discord-stat-card" style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '32px 24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>💬 채팅수</div>
            <div className="discord-stat-number" style={{ fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>{chats}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>3분마다 갱신</div>
          </div>

          {/* 동화수 */}
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            padding: '32px 24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>🔌 동화수</div>
            <div style={{ fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>1</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>안정적 연결</div>
          </div>

          {/* 최근활동 */}
          <div style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            padding: '32px 24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>⏰ 최근활동</div>
            <div style={{ fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>방금 전</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>실시간 활동 중</div>
          </div>

        </div>

        {/* 체크박스 설명 섹션 */}
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          border: '1px solid #E5E7EB',
          marginBottom: '48px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                minWidth: '28px',
                borderRadius: '8px',
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '900',
                color: 'white'
              }}>
                ✓
              </div>
              <div style={{ fontSize: '16px', color: '#1E293B', fontWeight: '600', lineHeight: 1.7 }}>
                메이플[일반서버/챌린저스서버/메이플M/메이플랜드]
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                minWidth: '28px',
                borderRadius: '8px',
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '900',
                color: 'white'
              }}>
                ✓
              </div>
              <div style={{ fontSize: '16px', color: '#1E293B', fontWeight: '600', lineHeight: 1.7 }}>
                컨텐츠[거래/보스/구직/길드/고확] 채널 운영
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                minWidth: '28px',
                borderRadius: '8px',
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '900',
                color: 'white'
              }}>
                ✓
              </div>
              <div style={{ fontSize: '16px', color: '#1E293B', fontWeight: '600', lineHeight: 1.7 }}>
                모든 메이플 유저가 참여하는 디스코드 채널입니다
              </div>
            </div>

          </div>
        </div>

        {/* 디스코드 입장 안내 */}
        <div style={{
          background: 'linear-gradient(135deg, #5865F2 0%, #7289DA 100%)',
          padding: '40px',
          borderRadius: '20px',
          marginBottom: '48px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(88, 101, 242, 0.3)'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            🍁 메이플 디스코드 입장 안내 (사진 참고)
          </h2>

          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '24px', borderRadius: '16px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✅ 인증방법
            </h3>
            <ol style={{ paddingLeft: '20px', lineHeight: 2, fontSize: '15px' }}>
              <li>게임내에서 현재 시간 꼭 찍은 후 &lt;사진 참고&gt;<br/>
                  사진을 📸|인증안내 채널에 1:1 메시지로 보내주세요.</li>
              <li>사진찍을이 완료 되었으면 꼭 아래에 ⭐인증 신청⭐ 버튼을 눌러주세요!</li>
            </ol>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🌸 주의사항
            </h3>
            <ol style={{ paddingLeft: '20px', lineHeight: 2, fontSize: '15px' }}>
              <li>메랜/클래닉 유저분들은 아예에 메랜/클래닉 채널 이동 ➜ #✅|통합-공지사항</li>
              <li>사진 찍을이 안되시면 관리자에 친구추가 요청.</li>
              <li>입증 신청이 완성이 안되면 상대에 메이플스토리 디스코드에 참가하기 잘 가기가 클릭</li>
            </ol>
          </div>
        </div>

        {/* 채널 구조 안내 */}
        <div style={{
          background: 'white',
          padding: '48px 40px',
          borderRadius: '20px',
          border: '1px solid #E5E7EB',
          marginBottom: '48px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1E293B', marginBottom: '32px', textAlign: 'center' }}>
            📋 디스코드 채널 구조
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

            {/* 메이플 커뮤니티 */}
            <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#667eea', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🌸 메이플 커뮤니티
              </h3>
              <ul style={{ fontSize: '14px', color: '#64748B', lineHeight: 2, paddingLeft: '20px' }}>
                <li>게시판</li>
                <li>이벤트</li>
                <li>자유대화</li>
                <li>닉변요청</li>
                <li>패치노트</li>
                <li>화면공유</li>
              </ul>
            </div>

            {/* 거래 채널 */}
            <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#10b981', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🌸 메이플 거래채널
              </h3>
              <ul style={{ fontSize: '14px', color: '#64748B', lineHeight: 2, paddingLeft: '20px' }}>
                <li>챌린저스</li>
                <li>루나, 스카니아</li>
                <li>엘리시움, 크로아</li>
                <li>베라, 오로라</li>
                <li>애오스, 헬리오스</li>
                <li>기타서버, 메이플m</li>
              </ul>
            </div>

            {/* 작업 공고 */}
            <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f59e0b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🌸 메이플 작업공고
              </h3>
              <ul style={{ fontSize: '14px', color: '#64748B', lineHeight: 2, paddingLeft: '20px' }}>
                <li>부주작업</li>
                <li>보스작업</li>
                <li>낙변거래</li>
                <li>인기도작</li>
                <li>커미션존</li>
              </ul>
            </div>

            {/* 길드 문의 */}
            <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ec4899', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🌸 메이플 길드문의
              </h3>
              <ul style={{ fontSize: '14px', color: '#64748B', lineHeight: 2, paddingLeft: '20px' }}>
                <li>루나, 스카니아</li>
                <li>엘리시움, 크로아</li>
                <li>베라, 오로라</li>
                <li>기타서버</li>
                <li>애오스, 헬리오스</li>
              </ul>
            </div>

            {/* 클래식 디스코드 */}
            <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🌸 클래식 디스코드
              </h3>
              <ul style={{ fontSize: '14px', color: '#64748B', lineHeight: 2, paddingLeft: '20px' }}>
                <li>통합-공지사항</li>
                <li>통합-닉변요청</li>
                <li>클래닉-거래방</li>
                <li>클래닉-파티-겸</li>
                <li>메랜-거래방</li>
                <li>메랜-파티모집</li>
              </ul>
            </div>

          </div>
        </div>

        {/* 관리자 문의 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          padding: '40px',
          borderRadius: '20px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          textAlign: 'center',
          marginBottom: '80px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1E293B', marginBottom: '16px' }}>
            💬 메이플 디스코드 인증 문의
          </h2>
          <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '8px' }}>
            - 관리자 메시지 인증 문의 및 요청사항: @IMS.DJ - 관리자
          </p>
          <p style={{ fontSize: '16px', color: '#64748B' }}>
            - 메랜/클래닉 채널 이동: #✅|통합-공지사항 (수정됨)
          </p>
        </div>

        {/* SEO 텍스트 섹션 1: 메이플 디스코드란? */}
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
            🎮 메이플 디스코드, 왜 필요할까요?
          </h2>
          <div style={{
            fontSize: '15px',
            color: '#475569',
            lineHeight: 1.9,
            textAlign: 'left'
          }}>
            <p style={{ marginBottom: '20px' }}>
              메이플스토리는 단순히 게임을 넘어 하나의 거대한 커뮤니티입니다. 인게임에서는 제한적인 소통만 가능하지만,
              메이플 디스코드를 통해 전국의 메이플 유저들과 실시간으로 자유롭게 소통할 수 있습니다.
              보스 파티 구인, 길드 모집, 아이템 거래, 사냥터 정보 공유, 메이플 꿀팁까지 모든 것이 이곳에서 이루어집니다.
            </p>
            <p style={{ marginBottom: '20px' }}>
              특히 메이플스토리 디스코드는 서버별(스카니아, 루나, 크로아, 챌린저스, 메이플랜드 등) 전용 채널이 세분화되어 있어,
              자신의 서버에 맞는 정보만 빠르게 확인할 수 있습니다. 또한 음성 채팅 기능을 통해 보스 레이드나 파티 플레이를 더욱 효율적으로 진행할 수 있으며,
              메이플 관련 최신 패치 정보와 이벤트 소식을 가장 먼저 접할 수 있습니다.
            </p>
            <p style={{ marginBottom: '20px' }}>
              현재 47,000명 이상의 메이플 유저가 활동 중인 국내 최대 메이플스토리 디스코드 커뮤니티에서
              혼자가 아닌 함께하는 메이플의 재미를 느껴보세요. 메이플 디코, 메이플 디스코드 서버 중 가장 활성화된 커뮤니티로
              24시간 언제나 누군가와 대화하고 정보를 나눌 수 있습니다.
            </p>
          </div>
        </div>

        {/* SEO 텍스트 섹션 2: 디스코드 주요 기능 */}
        <div style={{
          marginBottom: '60px',
          padding: '48px',
          background: 'linear-gradient(135deg, #5865F2 0%, #7289DA 100%)',
          borderRadius: '24px',
          color: 'white',
          boxShadow: '0 8px 24px rgba(88, 101, 242, 0.25)'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '900',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            💎 메이플 디스코드에서 할 수 있는 것들
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '24px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🤝 보스 파티 구인/구직
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                카링, 카오스 벨룸, 하드 루시드 등 고난이도 보스 파티를 빠르게 구할 수 있습니다.
                무릉 층수와 주스탯을 확인하며 실력에 맞는 파티원을 찾을 수 있어 인게임보다 훨씬 효율적입니다.
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '24px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🏰 길드 모집 & 홍보
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                서버별 길드 모집 채널에서 자신에게 맞는 길드를 찾거나, 길드 마스터라면 효과적으로 길드원을 모집할 수 있습니다.
                길드 컨텐츠(수로, 노블레스 등) 정보도 공유됩니다.
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '24px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💰 아이템 실시간 거래
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                경매장 수수료 없이 유저 간 직거래가 가능합니다. 급처 매물, 고가 장비, 큐브, 강화권 등
                다양한 아이템을 실시간 시세로 안전하게 거래할 수 있습니다.
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '24px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📰 패치 & 이벤트 정보
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                메이플스토리 공식 패치노트, 신규 이벤트, 업데이트 소식을 가장 빠르게 확인할 수 있습니다.
                유저들의 패치 분석과 꿀팁도 실시간으로 공유됩니다.
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '24px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎯 사냥터 & 스펙업 정보
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                구간별 추천 사냥터, 효율적인 스펙업 루트, 육성 가이드를 공유받을 수 있습니다.
                초보자부터 고스펙 유저까지 모두에게 유용한 정보가 가득합니다.
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '24px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎨 커미션 & 작업 의뢰
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                부캐 육성 대행, 보스 작업, 낙엽 거래, 인기도 작업 등 다양한 의뢰를 주고받을 수 있습니다.
                안전한 거래 인증 시스템으로 사기 걱정 없이 이용 가능합니다.
              </p>
            </div>
          </div>
        </div>

        {/* SEO 텍스트 섹션 3: 안전한 커뮤니티 */}
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
            🛡️ 안전하고 검증된 메이플 디스코드 커뮤니티
          </h2>
          <div style={{
            fontSize: '15px',
            color: '#475569',
            lineHeight: 1.9,
            textAlign: 'left'
          }}>
            <p style={{ marginBottom: '20px' }}>
              메이플 디스코드 중에서도 사기나 악성 유저로부터 안전하게 보호받을 수 있는 커뮤니티는 많지 않습니다.
              저희 메이플 디스코드는 <strong style={{ color: '#667eea' }}>게임 내 인증 시스템</strong>을 통해 실제 메이플스토리 유저만 입장할 수 있도록 철저히 관리합니다.
              인증 절차는 간단하지만 효과적이어서, 봇이나 광고 계정, 사기꾼들의 유입을 원천 차단합니다.
            </p>
            <p style={{ marginBottom: '20px' }}>
              또한 전담 관리자가 24시간 모니터링하며 부적절한 행동(욕설, 사기, 스팸 등)을 즉시 제재합니다.
              거래 관련 분쟁이 발생하면 중재 시스템을 통해 공정하게 해결하며, 신고 접수 시 증빙 자료를 바탕으로 신속하게 조치합니다.
              이러한 체계적인 관리 덕분에 47,000명 이상의 대규모 커뮤니티임에도 불구하고 안전하고 건전한 분위기가 유지되고 있습니다.
            </p>
            <p style={{ marginBottom: '20px' }}>
              특히 메이플 디스코드 거래 채널에서는 거래 전후 스크린샷 인증을 권장하며,
              의심스러운 거래나 유저는 즉시 제재 대상이 됩니다. 메이플 디코 추천 커뮤니티를 찾고 계신다면,
              안전성과 활성도를 모두 갖춘 이곳에서 안심하고 메이플을 즐기세요.
            </p>
          </div>
        </div>

        {/* SEO 텍스트 섹션 4: 참여 방법 */}
        <div style={{
          marginBottom: '60px',
          padding: '48px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '900',
            color: '#1E293B',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            🚀 메이플 디스코드 참여 방법 (초간단 3단계)
          </h2>
          <div style={{
            fontSize: '15px',
            color: '#475569',
            lineHeight: 1.9,
            textAlign: 'left'
          }}>
            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '16px',
              border: '1px solid #E2E8F0'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#10b981', marginBottom: '12px' }}>
                1단계: 디스코드 서버 입장
              </h3>
              <p>
                페이지 상단의 "디스코드 참가하기" 버튼을 클릭하여 서버에 입장합니다.
                디스코드 계정이 없다면 무료로 1분 안에 간편하게 회원가입할 수 있습니다.
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '16px',
              border: '1px solid #E2E8F0'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#10b981', marginBottom: '12px' }}>
                2단계: 메이플 게임 내 인증
              </h3>
              <p>
                메이플스토리에 접속하여 현재 시간이 보이는 스크린샷을 찍습니다.
                디스코드 📸|인증안내 채널에서 해당 이미지를 1:1 메시지로 전송하고, ⭐인증 신청⭐ 버튼을 클릭하면 됩니다.
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #E2E8F0'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#10b981', marginBottom: '12px' }}>
                3단계: 인증 완료 후 자유롭게 활동
              </h3>
              <p>
                관리자가 인증을 승인하면 모든 채널에 접근할 수 있습니다.
                서버별 채널, 거래 채널, 길드 모집 채널 등 원하는 곳에서 자유롭게 활동하며 메이플 유저들과 소통하세요!
              </p>
            </div>

            <div style={{
              marginTop: '32px',
              padding: '24px',
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              borderRadius: '12px',
              border: '1px solid #F59E0B'
            }}>
              <p style={{ fontSize: '15px', color: '#92400E', lineHeight: 1.8, marginBottom: '12px' }}>
                <strong>💡 인증 TIP:</strong>
              </p>
              <ul style={{ fontSize: '14px', color: '#78350F', lineHeight: 1.9, paddingLeft: '20px' }}>
                <li>메이플랜드/클래식 유저는 #✅|통합-공지사항 채널을 먼저 확인하세요</li>
                <li>인증이 안 될 경우 관리자(@IMS.DJ)에게 친구 추가 요청을 보내주세요</li>
                <li>인증 승인은 평균 5~10분 내에 완료됩니다 (24시간 대응)</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      <FAB type="discord" />
    </div>
  );
}
