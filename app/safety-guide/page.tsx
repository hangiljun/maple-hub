'use client';

import React from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import FAB from '@/components/FAB';

export default function SafetyGuidePage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <Navigation currentPage="safety-guide" />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
        {/* 헤더 */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1E293B', marginBottom: '16px' }}>
            🛡️ 안전거래 가이드
          </h1>
          <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.7 }}>
            카카오톡 기반 거래 중개 서비스 - 안전한 거래를 위한 필수 가이드
          </p>
        </div>

        {/* 중요 공지 */}
        <div style={{
          background: 'linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%)',
          padding: '24px 32px',
          borderRadius: '20px',
          border: '2px solid #DC2626',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '900',
            color: '#DC2626',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ⚠️ 필독: 게임 운영정책 관련 안내
          </h2>
          <div style={{ fontSize: '15px', color: '#991B1B', lineHeight: 1.8 }}>
            <p style={{ marginBottom: '12px', fontWeight: '700' }}>
              메이플스토리의 현금 거래는 게임 운영정책상 금지되어 있습니다.
            </p>
            <p style={{ marginBottom: '12px' }}>
              • 현금 거래로 인한 계정 회수, 정지, 제재 등의 모든 책임은 거래 당사자에게 있습니다.<br />
              • 당사는 게임 운영사의 정책 변경 및 제재 조치에 대해 어떠한 책임도 지지 않습니다.<br />
              • 거래 전 반드시 게임 운영정책을 확인하시고, 본인의 판단 하에 거래하시기 바랍니다.
            </p>
            <p style={{ fontWeight: '700' }}>
              ※ 거래 시 발생하는 모든 법적 책임은 이용자 본인에게 있습니다.
            </p>
          </div>
        </div>

        {/* 사업자 등록증 */}
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: '#1E293B',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📋 사업자 등록 정보
          </h2>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginBottom: '16px' }}>
              메이플 허브는 정식 사업자등록을 완료한 거래 중개 플랫폼입니다.<br />
              <strong style={{ color: '#1E293B' }}>※ 당사는 거래를 중개하는 플랫폼이며, 사이트 내에서 직접 거래가 이루어지지 않습니다.</strong>
            </p>
            <img
              src="/사업자 등록증.png"
              alt="사업자 등록증"
              style={{
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                display: 'block',
                margin: '0 auto'
              }}
            />
          </div>
        </div>

        {/* 안전거래 원칙 */}
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: '#1E293B',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ✅ 안전거래 5대 원칙
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              {
                number: '1',
                title: '공식 채널로만 거래하세요',
                desc: '메이플 허브에 등록된 공식 카카오톡 채널을 통해서만 거래를 진행하세요. 개인 메시지로 유도하는 경우 사기일 수 있습니다.'
              },
              {
                number: '2',
                title: '선입금 요구 주의',
                desc: '거래 전 선입금을 요구하는 경우 반드시 의심하세요. 정상적인 거래는 아이템/메소 확인 후 결제가 이루어집니다.'
              },
              {
                number: '3',
                title: '시세 확인',
                desc: '비정상적으로 저렴한 가격이나 높은 가격은 사기의 신호일 수 있습니다. 항상 시세를 확인하세요.'
              },
              {
                number: '4',
                title: '거래 증빙 보관',
                desc: '카카오톡 대화 내용, 거래 스크린샷 등 모든 거래 증빙을 보관하세요. 문제 발생 시 중요한 증거가 됩니다.'
              },
              {
                number: '5',
                title: '의심되면 즉시 중단',
                desc: '조금이라도 의심스러운 부분이 있다면 거래를 중단하고 관리자에게 문의하세요.'
              }
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '16px',
                padding: '20px',
                background: '#F8FAFC',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '900',
                  color: 'white',
                  flexShrink: 0
                }}>
                  {item.number}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1E293B',
                    marginBottom: '8px'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#475569',
                    lineHeight: 1.7
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 사기 유형 */}
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: '#1E293B',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ⚠️ 주의해야 할 사기 유형
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { type: '선입금 사기', desc: '아이템/메소를 보여주지 않고 먼저 입금을 요구합니다.' },
              { type: '중간 취소 사기', desc: '거래 도중 갑자기 연락이 끊기거나 계정을 삭제합니다.' },
              { type: '피싱 사기', desc: '가짜 사이트나 링크로 유도하여 개인정보를 탈취합니다.' },
              { type: '저가 미끼 사기', desc: '비정상적으로 저렴한 가격으로 유인 후 추가 금액을 요구합니다.' },
              { type: '계정 도용', desc: '타인의 계정을 도용하여 거래하는 척 합니다.' }
            ].map((item, i) => (
              <div key={i} style={{
                padding: '16px',
                background: '#FEF2F2',
                border: '1px solid #FEE2E2',
                borderRadius: '8px'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#DC2626', marginBottom: '4px' }}>
                  {item.type}
                </h4>
                <p style={{ fontSize: '14px', color: '#991B1B' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 신고 안내 */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px',
          borderRadius: '20px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '900',
            marginBottom: '16px'
          }}>
            의심스러운 거래를 발견하셨나요?
          </h2>
          <p style={{
            fontSize: '16px',
            marginBottom: '24px',
            opacity: 0.9
          }}>
            신속하게 신고해주시면 더 안전한 거래 환경을 만들 수 있습니다.
          </p>
          <Link href="/discord" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '16px 32px',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              고객센터 문의하기
            </button>
          </Link>
        </div>
      </div>

      <FAB type="kakao" />
    </div>
  );
}
