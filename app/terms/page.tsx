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
              사이트는 다음과 같은 거래 중개 서비스를 제공합니다.
            </p>
            <ul style={{ fontSize: '15px', color: '#475569', lineHeight: 2, paddingLeft: '24px' }}>
              <li>메이플스토리 아이템 거래 중개 (카카오톡 기반)</li>
              <li>메소 거래 중개 및 시세 정보 제공</li>
              <li>디스코드 커뮤니티 정보 제공</li>
              <li>거래 후기 작성 및 열람 서비스</li>
            </ul>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginTop: '12px' }}>
              <strong>※ 사이트는 거래를 중개하는 플랫폼이며, 사이트 내에서 직접 거래가 이루어지지 않습니다. 실제 거래는 판매자와 구매자 간 카카오톡을 통해 직접 진행됩니다.</strong>
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              제4조 (사이트의 의무)
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
              사이트는 안정적인 거래 중개 서비스 제공을 위해 최선을 다하며, 개인정보 보호에 관한 법규를 준수합니다. 다만, 사이트는 거래를 중개하는 플랫폼으로서 판매자와 구매자를 연결해주는 역할만 담당하며, 실제 거래는 당사자 간 직접 진행됩니다. 따라서 거래 과정에서 발생하는 분쟁이나 피해에 대해서는 책임을 지지 않습니다.
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
              <li><strong style={{ color: '#DC2626' }}>메이플스토리 게임 운영정책 위반으로 인한 계정 회수, 정지, 제재 등 모든 불이익</strong></li>
              <li><strong style={{ color: '#DC2626' }}>게임 운영사의 정책 변경 및 제재 조치</strong></li>
              <li>천재지변 또는 이에 준하는 불가항력으로 인한 서비스 중단</li>
              <li>이용자의 귀책사유로 인한 서비스 이용 장애</li>
              <li>제3자가 제공하는 정보의 정확성 및 신뢰성</li>
            </ul>
            <div style={{
              background: '#FEF2F2',
              border: '2px solid #DC2626',
              borderRadius: '12px',
              padding: '16px',
              marginTop: '16px'
            }}>
              <p style={{ fontSize: '15px', color: '#991B1B', lineHeight: 1.8, fontWeight: '700' }}>
                ⚠️ 중요 고지사항
              </p>
              <p style={{ fontSize: '14px', color: '#991B1B', lineHeight: 1.8, marginTop: '8px' }}>
                메이플스토리의 현금 거래는 게임 운영정책상 금지되어 있습니다. 현금 거래로 인한 계정 회수, 정지, 제재 등의 모든 법적 책임과 불이익은 이용자 본인에게 있으며, 당사는 이에 대해 어떠한 책임도 지지 않습니다. 거래 전 반드시 게임 운영정책을 확인하시고 본인의 판단과 책임 하에 거래하시기 바랍니다.
              </p>
            </div>
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
          <section style={{ marginTop: '60px', paddingTop: '40px', borderTop: '2px solid #E2E8F0' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '24px', textAlign: 'center' }}>
              사업자 등록증
            </h2>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <img
                src="/business-license.png"
                alt="사업자 등록증"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  border: '1px solid #E2E8F0'
                }}
              />
            </div>
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
