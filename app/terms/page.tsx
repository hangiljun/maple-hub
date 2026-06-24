'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <Navigation currentPage="home" />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px' }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '900',
          color: '#1E293B',
          marginBottom: '16px'
        }}>
          이용약관
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#64748B',
          marginBottom: '48px'
        }}>
          최종 수정일: 2026년 6월 24일
        </p>

        <div style={{
          background: 'white',
          padding: '48px',
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              제1조 (목적)
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
              본 약관은 메이플 허브(이하 "사이트")가 제공하는 메이플스토리 거래 정보 제공 서비스(이하 "서비스")의 이용과 관련하여 사이트와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              제2조 (정의)
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginBottom: '12px' }}>
              본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
            </p>
            <ul style={{ fontSize: '15px', color: '#475569', lineHeight: 2, paddingLeft: '24px' }}>
              <li>"사이트"란 메이플 허브를 의미합니다.</li>
              <li>"이용자"란 사이트에 접속하여 본 약관에 따라 사이트가 제공하는 서비스를 받는 자를 말합니다.</li>
              <li>"거래 정보"란 메이플스토리 아이템, 메소 등의 거래 관련 정보를 의미합니다.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              제3조 (서비스의 내용)
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginBottom: '12px' }}>
              사이트는 다음과 같은 서비스를 제공합니다.
            </p>
            <ul style={{ fontSize: '15px', color: '#475569', lineHeight: 2, paddingLeft: '24px' }}>
              <li>메이플스토리 아이템 거래 정보 제공</li>
              <li>메소 거래 시세 정보 제공</li>
              <li>디스코드 커뮤니티 정보 제공</li>
              <li>거래 후기 작성 및 열람 서비스</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              제4조 (사이트의 의무)
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
              사이트는 안정적인 서비스 제공을 위해 최선을 다하며, 개인정보 보호에 관한 법규를 준수합니다. 다만, 사이트는 거래 중개 플랫폼이 아니며, 이용자 간 직거래로 인해 발생하는 분쟁이나 피해에 대해서는 책임을 지지 않습니다.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              제5조 (이용자의 의무)
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginBottom: '12px' }}>
              이용자는 다음 행위를 하여서는 안됩니다.
            </p>
            <ul style={{ fontSize: '15px', color: '#475569', lineHeight: 2, paddingLeft: '24px' }}>
              <li>허위 정보 입력 및 타인의 정보 도용</li>
              <li>사이트의 정보를 무단으로 변경하거나 복제하는 행위</li>
              <li>사이트의 운영을 방해하는 행위</li>
              <li>타인의 명예를 손상시키거나 불이익을 주는 행위</li>
              <li>법령에 위반되는 불법적인 거래 행위</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              제6조 (면책사항)
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginBottom: '12px' }}>
              사이트는 다음의 경우 책임을 지지 않습니다.
            </p>
            <ul style={{ fontSize: '15px', color: '#475569', lineHeight: 2, paddingLeft: '24px' }}>
              <li>이용자 간 직거래로 인해 발생하는 모든 분쟁 및 손해</li>
              <li>천재지변 또는 이에 준하는 불가항력으로 인한 서비스 중단</li>
              <li>이용자의 귀책사유로 인한 서비스 이용 장애</li>
              <li>제3자가 제공하는 정보의 정확성 및 신뢰성</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              제7조 (분쟁해결)
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
              서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우, 사이트의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              제8조 (약관의 효력 및 변경)
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
              본 약관은 사이트를 이용하는 모든 이용자에게 적용됩니다. 사이트는 필요시 약관을 변경할 수 있으며, 변경된 약관은 공지사항을 통해 공지합니다.
            </p>
          </section>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link href="/" style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: '#667eea',
            color: 'white',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '600'
          }}>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
