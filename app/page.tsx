'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navigation from '@/components/Navigation';
import FAB from '@/components/FAB';
import { firebaseConfig } from '@/lib/firebase-config';

interface Review {
  id: string;
  title: string;
  nickname: string;
  content: string;
  imageUrl?: string;
  views: number;
  createdAt: any;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  isPinned: boolean;
  createdAt: any;
}

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    fetchReviews();
    fetchNotices();
  }, []);

  const fetchReviews = async () => {
    try {
      const { projectId, apiKey } = firebaseConfig;
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/reviews?key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.documents) {
        const reviewsData = data.documents.map((doc: any) => {
          const docId = doc.name.split('/').pop();
          return {
            id: docId,
            title: doc.fields.title?.stringValue || '',
            nickname: doc.fields.nickname?.stringValue || '',
            content: doc.fields.content?.stringValue || '',
            imageUrl: doc.fields.imageUrl?.stringValue || '',
            views: parseInt(doc.fields.views?.integerValue || '0'),
            createdAt: doc.fields.createdAt?.timestampValue || doc.createTime
          };
        });

        // 최신순 정렬 후 최대 3개만
        reviewsData.sort((a: Review, b: Review) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        setReviews(reviewsData.slice(0, 3));
      }
    } catch (error) {
      console.error('후기 로드 실패:', error);
    }
  };

  const fetchNotices = async () => {
    try {
      const { projectId, apiKey } = firebaseConfig;
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/notices?key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.documents) {
        const noticesData = data.documents.map((doc: any) => {
          const docId = doc.name.split('/').pop();
          return {
            id: docId,
            title: doc.fields.title?.stringValue || '',
            content: doc.fields.content?.stringValue || '',
            category: doc.fields.category?.stringValue || '공지사항',
            imageUrl: doc.fields.imageUrl?.stringValue || '',
            isPinned: doc.fields.isPinned?.booleanValue || false,
            createdAt: doc.fields.createdAt?.timestampValue || doc.createTime
          };
        });

        // 고정 공지를 우선으로, 그 다음 최신순 정렬
        noticesData.sort((a: Notice, b: Notice) => {
          if (a.isPinned !== b.isPinned) {
            return a.isPinned ? -1 : 1;
          }
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        setNotices(noticesData.slice(0, 3));
      }
    } catch (error) {
      console.error('공지사항 로드 실패:', error);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '');
  };

  return (
    <>
      <Script id="structured-data" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "MAPLE HUB",
          "url": "https://www.maplehub.co.kr",
          "description": "메이플급처, 메이플스토리 급처템, 메소, 아이템 전 서버 최고가 매입. 24시간 상담 및 검증된 업체 리스트를 통해 안전하게 메이플급처 거래하세요.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.maplehub.co.kr/reviews?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </Script>
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

      <Navigation currentPage="home" />

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
            메이플스토리 거래를 한곳에서
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#64748B',
            marginBottom: '40px'
          }}>
            카카오톡 기반 거래 중개 플랫폼
          </p>
        </div>

        {/* 배너 그리드 (급처템, 메소, 디스코드) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>

          {/* 급처템 문의 배너 */}
          <Link href="/items" style={{ textDecoration: 'none' }}>
            <div className="card-hover" style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              transition: 'all 0.3s'
            }}>
              <img
                src="/급처템.png"
                alt="급처템 문의"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
              <div style={{
                background: 'white',
                padding: '16px 20px',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1E293B',
                  marginBottom: '4px'
                }}>급처템 문의</h3>
                <p style={{
                  fontSize: '13px',
                  color: '#64748B'
                }}>
                  빠른 아이템 거래
                </p>
              </div>
            </div>
          </Link>

          {/* 메소 거래 배너 */}
          <Link href="/meso" style={{ textDecoration: 'none' }}>
            <div className="card-hover" style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              transition: 'all 0.3s'
            }}>
              <img
                src="/메소.png"
                alt="메소 거래"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
              <div style={{
                background: 'white',
                padding: '16px 20px',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1E293B',
                  marginBottom: '4px'
                }}>메이플 메소 거래</h3>
                <p style={{
                  fontSize: '13px',
                  color: '#64748B'
                }}>
                  실시간 시세 확인
                </p>
              </div>
            </div>
          </Link>

          {/* 디스코드 홍보 배너 */}
          <div style={{ textDecoration: 'none' }}>
            <div className="card-hover" style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              transition: 'all 0.3s'
            }}>
              <img
                src="/discord.png"
                alt="디스코드"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
              <div style={{
                background: 'white',
                padding: '16px 20px',
                textAlign: 'center'
              }}>
                <Link href="/discord" style={{ textDecoration: 'none', width: '100%', display: 'block' }}>
                  <button style={{
                    width: '100%',
                    padding: '12px 24px',
                    background: '#5865F2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(88, 101, 242, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#4752C4';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#5865F2';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    디스코드 바로가기 →
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* 왜 메이플허브 인가요? */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '60px 48px',
          borderRadius: '28px',
          marginBottom: '60px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-50px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
            borderRadius: '50%'
          }}></div>

          <h2 style={{
            fontSize: '36px',
            fontWeight: '900',
            color: 'white',
            marginBottom: '16px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            왜 메이플허브 인가요?
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            marginBottom: '48px',
            position: 'relative',
            zIndex: 1
          }}>
            다른 서비스와 차별화된 메이플허브만의 장점
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
            gap: '24px',
            position: 'relative',
            zIndex: 1
          }}>
            {[
              {
                icon: '⚡',
                title: '빠른 응답',
                desc: '평균 5분 이내 카카오톡 응답으로 신속한 거래 진행'
              },
              {
                icon: '🛡️',
                title: '안전한 거래',
                desc: '사업자등록을 하고 안전하게 운영 하고있습니다'
              },
              {
                icon: '💯',
                title: '실시간 시세',
                desc: '메소 시세를 실시간으로 확인하고 합리적인 가격에 거래'
              },
              {
                icon: '🌙',
                title: '24시간 운영',
                desc: '언제든지 편한 시간에 거래 문의 및 상담 가능'
              }
            ].map((feature, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                padding: '32px 24px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '12px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.6
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* 공지사항 + 거래방법 2분할 섹션 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))',
          gap: '32px',
          marginBottom: '60px'
        }}>
          {/* 공지사항 */}
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '900',
                color: '#1E293B',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📢 공지사항
              </h2>
              <Link href="/notice" style={{
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                color: '#667eea'
              }}>
                더보기 →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notices.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#94A3B8',
                  fontSize: '14px'
                }}>
                  등록된 공지사항이 없습니다.
                </div>
              ) : (
                notices.map((notice) => {
                  const badge = notice.category === '공지사항' ? '공지' : notice.category;
                  const noticeDate = new Date(notice.createdAt);
                  const formattedDate = `${noticeDate.getMonth() + 1}/${noticeDate.getDate()}(${['일','월','화','수','목','금','토'][noticeDate.getDay()]})`;

                  return (
                    <Link key={notice.id} href="/notice" style={{
                      textDecoration: 'none',
                      padding: '16px',
                      background: '#F8FAFC',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s'
                    }}>
                      <span style={{
                        padding: '4px 10px',
                        background: badge === '점검' ? '#FEF3C7' : '#E0E7FF',
                        color: badge === '점검' ? '#92400E' : '#4C1D95',
                        fontSize: '12px',
                        fontWeight: '700',
                        borderRadius: '6px',
                        flexShrink: 0
                      }}>
                        {badge}
                      </span>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1E293B',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {notice.title}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: '#94A3B8',
                        flexShrink: 0
                      }}>
                        {formattedDate}
                      </span>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* 거래방법 */}
          <div style={{
            background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
            padding: '32px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.15)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '900',
              color: '#4C1D95',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💡 거래방법
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { step: '1', title: '원하는 메뉴 선택', desc: '급처템, 메소거래, 디스코드 중 선택' },
                { step: '2', title: '해당 채널 거래 방법 확인', desc: '거래 정보를 확인 하세요' },
                { step: '3', title: '연락하기', desc: '카카오톡으로 문의 하기' },
                { step: '4', title: '안전 거래', desc: '거래 완료 후 후기 작성' }
              ].map((step, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'start'
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
                    {step.step}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#4C1D95',
                      marginBottom: '4px'
                    }}>
                      {step.title}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: '#5B21B6',
                      lineHeight: 1.5
                    }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 이용후기 섹션 */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '900',
              color: '#1E293B',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              ⭐ 이용후기
            </h2>
            <Link href="/reviews" style={{
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '600',
              color: '#667eea',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              더보기 →
            </Link>
          </div>
          <div style={{
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E1 #F1F5F9'
          }}>
            {reviews.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#94A3B8',
                fontSize: '15px'
              }}>
                아직 등록된 후기가 없습니다.
              </div>
            ) : (
              <div style={{
                display: 'flex',
                gap: '20px',
                paddingBottom: '20px'
              }}>
                {reviews.map((review) => (
                  <div key={review.id} style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '400px',
                    minWidth: 'calc(25% - 15px)',
                    flexShrink: 0
                  }}
                  onClick={() => window.location.href = '/reviews'}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  }}
                  >
                    <div style={{
                      marginBottom: '12px'
                    }}>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>{review.nickname}</span>
                    </div>
                    {review.imageUrl && (
                      <div style={{
                        marginBottom: '12px',
                        borderRadius: '12px',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={review.imageUrl}
                          alt="후기 이미지"
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    )}
                    <div style={{
                      marginTop: 'auto'
                    }}>
                      <p style={{
                        fontSize: '14px',
                        color: '#475569',
                        lineHeight: 1.7,
                        marginBottom: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {review.content}
                      </p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '12px', color: '#94A3B8' }}>{formatDate(review.createdAt)}</span>
                        <span style={{ fontSize: '12px', color: '#94A3B8' }}>조회 {review.views}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 푸터 */}
      <footer style={{
        background: '#1E293B',
        padding: '60px 20px 40px',
        color: 'white',
        marginTop: '80px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}>
            {/* 로고 및 설명 */}
            <div>
              <div style={{ fontSize: '24px', fontWeight: '900', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/logo.ico" alt="MAPLE HUB" style={{ width: '32px', height: '32px' }} />
                메이플 허브
              </div>
              <p style={{ fontSize: '14px', opacity: 0.7, lineHeight: 1.7 }}>
                메이플스토리 거래를 한곳에서<br />
                카카오톡 기반 거래 중개 플랫폼
              </p>
            </div>

            {/* 바로가기 */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>바로가기</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="/items" style={{ color: 'white', opacity: 0.7, textDecoration: 'none', fontSize: '14px', transition: 'opacity 0.2s' }}>
                  급처템 거래
                </Link>
                <Link href="/meso" style={{ color: 'white', opacity: 0.7, textDecoration: 'none', fontSize: '14px', transition: 'opacity 0.2s' }}>
                  메소 거래
                </Link>
                <Link href="/discord" style={{ color: 'white', opacity: 0.7, textDecoration: 'none', fontSize: '14px', transition: 'opacity 0.2s' }}>
                  디스코드
                </Link>
                <Link href="/reviews" style={{ color: 'white', opacity: 0.7, textDecoration: 'none', fontSize: '14px', transition: 'opacity 0.2s' }}>
                  이용후기
                </Link>
              </div>
            </div>

            {/* 고객지원 */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>고객지원</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="/notice" style={{ color: 'white', opacity: 0.7, textDecoration: 'none', fontSize: '14px', transition: 'opacity 0.2s' }}>
                  공지사항
                </Link>
                <a href="https://open.kakao.com/o/sfxfJyAi" target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.7, textDecoration: 'none', fontSize: '14px', transition: 'opacity 0.2s' }}>
                  카카오톡 문의
                </a>
                <Link href="/terms" style={{ color: 'white', opacity: 0.7, textDecoration: 'none', fontSize: '14px', transition: 'opacity 0.2s' }}>
                  이용약관
                </Link>
                <Link href="/privacy" style={{ color: 'white', opacity: 0.7, textDecoration: 'none', fontSize: '14px', transition: 'opacity 0.2s' }}>
                  개인정보처리방침
                </Link>
              </div>
            </div>
          </div>

          {/* 하단 구분선 */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '32px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '13px', opacity: 0.6, lineHeight: 1.8, marginBottom: '8px' }}>
              본 사이트는 카카오톡 기반 거래 중개 플랫폼입니다.
            </p>
            <p style={{ fontSize: '12px', opacity: 0.5, lineHeight: 1.7, marginBottom: '12px' }}>
              메이플스토리의 현금 거래는 게임 운영정책상 금지되어 있으며,<br />
              이로 인한 계정 회수, 정지, 제재 등 모든 책임은 이용자 본인에게 있습니다.<br />
              당사는 게임 운영사의 제재 조치에 대해 어떠한 책임도 지지 않습니다.
            </p>
            <p style={{ fontSize: '13px', opacity: 0.5 }}>
              © 2026 메이플 허브. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <FAB type="kakao" />
      </div>
    </>
  );
}
