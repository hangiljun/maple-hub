'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.ico" alt="MAPLE HUB" style={{ width: '40px', height: '40px' }} />
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#667eea' }}>메이플 허브</span>
          </Link>
          <div style={{ display: 'flex', gap: '32px', fontSize: '16px', fontWeight: '600' }}>
            <Link href="/" style={{ color: '#64748B', textDecoration: 'none' }}>홈</Link>
            <Link href="/items" style={{ color: '#64748B', textDecoration: 'none' }}>급처템</Link>
            <Link href="/meso" style={{ color: '#64748B', textDecoration: 'none' }}>메소거래</Link>
            <Link href="/discord" style={{ color: '#667eea', textDecoration: 'none', borderBottom: '2px solid #667eea', paddingBottom: '4px' }}>디스코드</Link>
            <Link href="/reviews" style={{ color: '#64748B', textDecoration: 'none' }}>이용후기</Link>
            <Link href="/notice" style={{ color: '#64748B', textDecoration: 'none' }}>공지사항</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>

        {/* 디스코드 이미지 배너 */}
        <div style={{
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
              <h2 style={{ fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '16px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                지금 바로 참여하세요!
              </h2>
              <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.95)', marginBottom: '32px' }}>
                {members.toLocaleString()}명의 메이플 유저와 함께하는 공간
              </p>
              <a
                href="https://discord.gg/2UwBw8dnSv"
                target="_blank"
                rel="noopener noreferrer"
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
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            padding: '32px 24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>👥 회원수</div>
            <div style={{ fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>{members.toLocaleString()}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>하루 150명씩 증가 중</div>
          </div>

          {/* 활동수 */}
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
            padding: '32px 24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>⚡ 활동수</div>
            <div style={{ fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>{activity}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>3분마다 갱신</div>
          </div>

          {/* 채팅수 */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '32px 24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>💬 채팅수</div>
            <div style={{ fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>{chats}</div>
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
          textAlign: 'center'
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

      </div>

      <FAB type="discord" />
    </div>
  );
}
