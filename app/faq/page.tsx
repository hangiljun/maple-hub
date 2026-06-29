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
          a: '메소 거래 페이지에서 현재 시세를 확인하신 후, 카카오톡으로 문의주시면 문자로 연락 드립니다. 거래는 게임 내에서 직접 만나서 거래합니다.'
        },
        {
          q: '급처템은 어떻게 판매하나요?',
          a: '급처템은 카카오톡 han8246으로 연락 주시고 아이템 사진이나 캐릭터 닉네임을 알려주시면 현재 실시간 경매장 시세를 파악해서 80~90% 가격에 구매합니다.'
        },
        {
          q: '문의 시간은 어떻게 되나요?',
          a: '24시간 카카오톡 문의 가능하며, 평균 5분 이내에 응답드립니다.'
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
          a: '거래 전 취소는 100% 환불 가능하며, 거래 후에는 쌍방 합의 하에 환불이 진행됩니다. 단, 고객의 단순 변심으로 인한 환불은 제한될 수 있습니다. 메소 거래의 경우 수수료 문제가 있어서 환불이 불가능합니다.'
        }
      ]
    },
    {
      category: '안전거래',
      questions: [
        {
          q: '거래가 안전한가요?',
          a: '메이플 허브는 안전하게 운영되는 플랫폼입니다. 거래 관련 문의사항은 언제든 상담 가능합니다.'
        },
        {
          q: '거래는 어떻게 진행되나요?',
          a: '메소거래의 경우 메소 거래 폼을 작성해서 카카오톡으로 연락 주시고, 급처템 문의는 han8246으로 카카오톡 연락 주세요. 물론 메소 거래도 han8246으로 연락 주셔도 됩니다.'
        },
        {
          q: '문제가 생기면 어떻게 하나요?',
          a: '지금까지 사고율 0%입니다. 안전하게 거래를 진행하고 있으며 문의사항은 언제든 연락 주세요.'
        }
      ]
    },
    {
      category: '계정 및 이용',
      questions: [
        {
          q: '회원가입이 필요한가요?',
          a: '회원가입 없이 이용이 가능합니다.'
        },
        {
          q: '서버 제한이 있나요?',
          a: '모든 메이플스토리 서버(챌린저스, 스카니아, 루나, 엘리시움, 크로아, 베라, 오로라, 레드, 유니온, 제니스, 이노시스, 에오스, 헬리오스)에서 가능합니다.'
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

  // FAQ 스키마 생성
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.flatMap(category =>
      category.questions.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    )
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navigation currentPage="faq" />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
        {/* 헤더 */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1E293B', marginBottom: '16px' }}>
            ❓ Q&A
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

        {/* 안전거래 가이드 */}
        <div style={{ marginTop: '80px', paddingTop: '60px', borderTop: '3px solid #E2E8F0' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '900',
            color: '#1E293B',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            🛡️ 안전거래 가이드
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#64748B',
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            안전한 거래를 위한 필수 정보를 확인하세요
          </p>

          {/* 안전거래 원칙 */}
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            marginBottom: '32px'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '900',
              color: '#1E293B',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ✅ 안전거래 5대 원칙
            </h3>
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
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1E293B',
                      marginBottom: '8px'
                    }}>
                      {item.title}
                    </h4>
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
            marginBottom: '48px'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '900',
              color: '#1E293B',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⚠️ 주의해야 할 사기 유형
            </h3>
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
        </div>

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
