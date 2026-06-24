'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import FAB from '@/components/FAB';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: '거래 방법',
      questions: [
        {
          q: '메이플 허브는 어떤 서비스인가요?',
          a: '메이플 허브는 거래를 중개하는 플랫폼입니다. 사이트 내에서 직접 거래가 이루어지지 않으며, 카카오톡을 통해 판매자와 구매자를 연결해드립니다.'
        },
        {
          q: '메소는 어떻게 거래하나요?',
          a: '메소 거래 페이지에서 현재 시세를 확인하신 후, 카카오톡으로 문의주시면 판매자와 연결해드립니다. 실제 거래는 게임 내에서 직접 만나거나 우편으로 이루어집니다.'
        },
        {
          q: '급처템은 어떻게 구매하나요?',
          a: '급처템 페이지에서 원하는 아이템을 확인하신 후, 카카오톡으로 문의주시면 판매자와 연결해드립니다. 당사는 중개만 담당하며, 실제 거래는 판매자와 직접 진행하시면 됩니다.'
        },
        {
          q: '문의 시간은 어떻게 되나요?',
          a: '24시간 카카오톡 문의 가능하며, 평균 5분 이내에 응답드립니다. 실제 거래는 판매자와 구매자가 합의한 시간에 진행됩니다.'
        }
      ]
    },
    {
      category: '결제 및 환불',
      questions: [
        {
          q: '결제 방법은 어떻게 되나요?',
          a: '계좌이체를 통한 결제를 기본으로 하고 있습니다. 거래 전 계좌번호를 안내받으시고, 입금 확인 후 아이템/메소가 전달됩니다.'
        },
        {
          q: '환불이 가능한가요?',
          a: '거래 전 취소는 100% 환불 가능하며, 거래 후에는 쌍방 합의 하에 환불이 진행됩니다. 단, 고객의 단순 변심으로 인한 환불은 제한될 수 있습니다.'
        },
        {
          q: '입금했는데 아이템을 받지 못했어요',
          a: '즉시 카카오톡으로 문의주세요. 거래 증빙(입금 내역, 대화 내역)을 보관하고 계시면 신속하게 처리해드립니다.'
        }
      ]
    },
    {
      category: '안전거래',
      questions: [
        {
          q: '메이플스토리 현금 거래가 허용되나요?',
          a: '메이플스토리의 현금 거래는 게임 운영정책상 금지되어 있습니다. 현금 거래로 인한 계정 회수, 정지, 제재 등의 모든 책임은 거래 당사자에게 있으며, 당사는 게임 운영사의 정책 변경 및 제재 조치에 대해 어떠한 책임도 지지 않습니다.'
        },
        {
          q: '거래가 안전한가요?',
          a: '메이플 허브는 정식 사업자등록을 완료한 중개 플랫폼입니다. 당사는 신뢰할 수 있는 판매자만 선별하여 연결해드리며, 거래 관련 문의사항은 언제든 상담 가능합니다. 단, 게임사의 제재는 당사의 책임 범위가 아님을 유의해주세요.'
        },
        {
          q: '거래 중개는 어떻게 이루어지나요?',
          a: '고객이 카카오톡으로 문의하시면 당사가 검증된 판매자와 연결해드립니다. 실제 거래는 판매자와 구매자 간 직접 진행되며, 당사는 중개 역할만 담당합니다.'
        },
        {
          q: '문제가 생기면 어떻게 하나요?',
          a: '거래 과정에서 문제가 발생하면 즉시 카카오톡으로 신고해주세요. 거래 증빙 자료를 보관하고 계시면 빠른 해결이 가능합니다. 단, 게임 운영사의 제재는 당사가 관여할 수 없습니다.'
        }
      ]
    },
    {
      category: '계정 및 이용',
      questions: [
        {
          q: '회원가입이 필요한가요?',
          a: '대부분의 서비스는 회원가입 없이 이용 가능합니다. 이용후기 작성 등 일부 기능만 닉네임 입력이 필요합니다.'
        },
        {
          q: '서버 제한이 있나요?',
          a: '모든 메이플스토리 서버(스카니아, 루나, 크로아, 리부트, 메이플랜드 등)에서 거래 가능합니다.'
        },
        {
          q: '디스코드는 왜 필요한가요?',
          a: '디스코드는 커뮤니티 공간으로, 길드/파티 모집, 공지사항 확인, 실시간 소통 등을 위해 운영되고 있습니다. 선택사항입니다.'
        }
      ]
    },
    {
      category: '기타',
      questions: [
        {
          q: '시세는 어떻게 결정되나요?',
          a: '메이플스토리 게임 내 경제 상황과 시장 수급에 따라 실시간으로 변동됩니다. 메소 거래 페이지에서 최신 시세를 확인하실 수 있습니다.'
        },
        {
          q: '대량 거래도 가능한가요?',
          a: '네, 대량 거래 시 별도 할인 혜택을 제공하고 있습니다. 카카오톡으로 문의주시면 상담해드립니다.'
        },
        {
          q: '문의는 어디로 하나요?',
          a: '카카오톡 채널 또는 디스코드를 통해 문의 가능합니다. 평균 5분 이내에 답변드립니다.'
        }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <Navigation currentPage="faq" />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
        {/* 헤더 */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1E293B', marginBottom: '16px' }}>
            ❓ 자주 묻는 질문
          </h1>
          <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.7 }}>
            거래 중개 서비스 이용 관련 궁금하신 내용을 확인하세요
          </p>
        </div>

        {/* FAQ 목록 */}
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex} style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '900',
              color: '#1E293B',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '2px solid #667eea'
            }}>
              {category.category}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {category.questions.map((faq, questionIndex) => {
                const globalIndex = categoryIndex * 100 + questionIndex;
                const isOpen = openIndex === globalIndex;

                return (
                  <div key={questionIndex} style={{
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}>
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                      style={{
                        width: '100%',
                        padding: '20px 24px',
                        background: isOpen ? '#F8FAFC' : 'white',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1E293B',
                        flex: 1
                      }}>
                        Q. {faq.q}
                      </span>
                      <span style={{
                        fontSize: '20px',
                        color: '#667eea',
                        transition: 'transform 0.2s',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}>
                        ▼
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{
                        padding: '20px 24px',
                        borderTop: '1px solid #E2E8F0',
                        background: '#FAFBFC'
                      }}>
                        <p style={{
                          fontSize: '15px',
                          color: '#475569',
                          lineHeight: 1.8,
                          margin: 0
                        }}>
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* 추가 문의 */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          color: 'white',
          marginTop: '48px'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '900',
            marginBottom: '12px'
          }}>
            찾으시는 답변이 없으신가요?
          </h3>
          <p style={{
            fontSize: '16px',
            marginBottom: '24px',
            opacity: 0.9
          }}>
            카카오톡 또는 디스코드로 문의주시면 친절하게 답변해드립니다.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://open.kakao.com/o/sfxfJyAi" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '14px 28px',
                background: '#FEE500',
                color: '#000000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                💬 카카오톡 문의
              </button>
            </a>
            <a href="/discord" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '14px 28px',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                💬 디스코드 문의
              </button>
            </a>
          </div>
        </div>
      </div>

      <FAB type="kakao" />
    </div>
  );
}
