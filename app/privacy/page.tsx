'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function PrivacyPage() {
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
          개인정보처리방침
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
              1. 개인정보의 수집 및 이용 목적
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginBottom: '12px' }}>
              메이플 허브(이하 "사이트")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul style={{ fontSize: '15px', color: '#475569', lineHeight: 2, paddingLeft: '24px' }}>
              <li>서비스 제공 및 운영</li>
              <li>회원 관리 및 본인 확인</li>
              <li>고객 문의 및 불만 처리</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              2. 수집하는 개인정보 항목
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginBottom: '12px' }}>
              사이트는 다음과 같은 개인정보를 수집할 수 있습니다.
            </p>
            <ul style={{ fontSize: '15px', color: '#475569', lineHeight: 2, paddingLeft: '24px' }}>
              <li><strong>필수항목:</strong> 닉네임, 연락처(카카오톡 ID 또는 전화번호)</li>
              <li><strong>자동수집항목:</strong> IP주소, 쿠키, 접속 로그, 서비스 이용 기록</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              3. 개인정보의 보유 및 이용기간
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginBottom: '12px' }}>
              사이트는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
            </p>
            <ul style={{ fontSize: '15px', color: '#475569', lineHeight: 2, paddingLeft: '24px' }}>
              <li><strong>회원 탈퇴 시:</strong> 재가입 방지 및 부정 이용 방지를 위해 30일간 보관 후 파기</li>
              <li><strong>관련 법령에 의한 보존:</strong>
                <ul style={{ paddingLeft: '24px', marginTop: '8px' }}>
                  <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
                  <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
                  <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
                  <li>접속 로그 기록: 3개월 (통신비밀보호법)</li>
                </ul>
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              4. 개인정보의 제3자 제공
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
              사이트는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.
            </p>
            <ul style={{ fontSize: '15px', color: '#475569', lineHeight: 2, paddingLeft: '24px' }}>
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              5. 개인정보의 파기 절차 및 방법
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginBottom: '12px' }}>
              사이트는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </p>
            <ul style={{ fontSize: '15px', color: '#475569', lineHeight: 2, paddingLeft: '24px' }}>
              <li><strong>파기절차:</strong> 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.</li>
              <li><strong>파기방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              6. 이용자 및 법정대리인의 권리와 그 행사방법
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
              이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며, 개인정보의 수집·이용·제공에 대한 동의 철회 및 가입해지(회원탈퇴)를 요청할 수 있습니다.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              7. 개인정보 보호책임자
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginBottom: '12px' }}>
              사이트는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div style={{
              background: '#F8FAFC',
              padding: '24px',
              borderRadius: '12px',
              fontSize: '15px',
              color: '#475569',
              lineHeight: 2
            }}>
              <p><strong>개인정보 보호책임자</strong></p>
              <p>• 연락처: 카카오톡 오픈채팅 - han8246</p>
              <p>• 이메일: 문의 시 제공</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>
              8. 개인정보처리방침 변경
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
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
