'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews();
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

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '');
  };

  return (
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
            메이플스토리 거래의 모든 것
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#64748B',
            marginBottom: '40px'
          }}>
            안전하고 빠른 거래를 시작하세요
          </p>
        </div>

        {/* 메인 카드 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: '24px',
          marginBottom: '60px',
          perspective: '1000px'
        }}>

          {/* 급처템 홍보 카드 */}
          <Link href="/items" style={{ textDecoration: 'none' }}>
            <div className="card-hover" style={{
              background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
              padding: '48px 32px',
              borderRadius: '24px',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 20px 60px rgba(102, 126, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            }}>
              {/* 배경 장식 */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                borderRadius: '50%'
              }}></div>

              <div>
                <div className="float-animation" style={{
                  fontSize: '72px',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 4px 12px rgba(102, 126, 234, 0.3))'
                }}>⚡</div>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  marginBottom: '16px',
                  color: '#4C1D95'
                }}>급처템 홍보</h3>
                <p style={{
                  fontSize: '15px',
                  color: '#5B21B6',
                  lineHeight: 1.7,
                  opacity: 0.9
                }}>
                  아이템을 빠르게 판매하거나<br />구매할 수 있습니다
                </p>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#667eea',
                fontWeight: '700',
                marginTop: '24px'
              }}>
                → 거래 방법 보러가기
              </div>
            </div>
          </Link>

          {/* 메소 거래 카드 */}
          <Link href="/meso" style={{ textDecoration: 'none' }}>
            <div className="card-hover" style={{
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              padding: '48px 32px',
              borderRadius: '24px',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 20px 60px rgba(245, 158, 11, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            }}>
              {/* 배경 장식 */}
              <div style={{
                position: 'absolute',
                bottom: '-50px',
                left: '-50px',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                borderRadius: '50%'
              }}></div>

              <div>
                <div className="float-animation" style={{
                  fontSize: '72px',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 4px 12px rgba(245, 158, 11, 0.3))',
                  animationDelay: '1s'
                }}>💰</div>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  marginBottom: '16px',
                  color: '#92400E'
                }}>메소 거래</h3>
                <p style={{
                  fontSize: '15px',
                  color: '#B45309',
                  lineHeight: 1.7,
                  opacity: 0.9
                }}>
                  안전한 메소 거래<br />실시간 시세 확인
                </p>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#f59e0b',
                fontWeight: '700',
                marginTop: '24px'
              }}>
                → 시세 보러가기
              </div>
            </div>
          </Link>

          {/* 디스코드 홍보 카드 */}
          <Link href="/discord" style={{ textDecoration: 'none' }}>
            <div className="card-hover" style={{
              background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
              padding: '48px 32px',
              borderRadius: '24px',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 20px 60px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            }}>
              {/* 배경 장식 */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                left: '-30px',
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                borderRadius: '50%'
              }}></div>

              <div>
                <div className="float-animation" style={{
                  fontSize: '72px',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3))',
                  animationDelay: '2s'
                }}>💬</div>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  marginBottom: '16px',
                  color: '#1E3A8A'
                }}>디스코드 홍보</h3>
                <p style={{
                  fontSize: '15px',
                  color: '#1E40AF',
                  lineHeight: 1.7,
                  opacity: 0.9
                }}>
                  길드, 파티 모집<br />커뮤니티 홍보
                </p>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#3b82f6',
                fontWeight: '700',
                marginTop: '24px'
              }}>
                → 디스코드 보러가기
              </div>
            </div>
          </Link>

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
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: '20px'
          }}>
            {reviews.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '60px 20px',
                color: '#94A3B8',
                fontSize: '15px'
              }}>
                아직 등록된 후기가 없습니다.
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} style={{
                  background: 'white',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
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
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>{review.nickname}</span>
                    <span style={{ fontSize: '18px' }}>⭐⭐⭐⭐⭐</span>
                  </div>
                  {review.imageUrl && (
                    <div style={{
                      marginBottom: '12px',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={review.imageUrl}
                        alt={review.title}
                        style={{
                          width: '100%',
                          height: '160px',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#475569',
                    marginBottom: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {review.title}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748B',
                    lineHeight: 1.6,
                    marginBottom: '12px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
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
              ))
            )}
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
              {[
                { badge: '공지', title: '사이트 오픈 안내', date: '6/22(월)' },
                { badge: '공지', title: '6/22(월) 메이플 옥션 개편 사항 관련 안내', date: '6/22(월)' },
                { badge: '점검', title: '[패치완료] 6/23(화) 마이너버전(7) 패치', date: '6/23(화)' }
              ].map((notice, i) => (
                <Link key={i} href="/notice" style={{
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
                    background: notice.badge === '점검' ? '#FEF3C7' : '#E0E7FF',
                    color: notice.badge === '점검' ? '#92400E' : '#4C1D95',
                    fontSize: '12px',
                    fontWeight: '700',
                    borderRadius: '6px',
                    flexShrink: 0
                  }}>
                    {notice.badge}
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
                    {notice.date}
                  </span>
                </Link>
              ))}
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
                { step: '2', title: '거래글 확인', desc: '실시간 거래 정보를 확인하세요' },
                { step: '3', title: '연락하기', desc: '카카오톡으로 판매자에게 연락' },
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
                desc: '검증된 거래자들과 안전하고 믿을 수 있는 거래 환경'
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
                메이플스토리 거래의 모든 것<br />
                안전하고 편리한 거래 플랫폼
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
            <p style={{ fontSize: '13px', opacity: 0.5, lineHeight: 1.8, marginBottom: '12px' }}>
              본 사이트는 거래 중개 플랫폼이 아닌 홍보 공간이며,<br />
              당사자 간의 직거래로 인해 발생하는 피해에 대해 책임을 지지 않습니다.
            </p>
            <p style={{ fontSize: '13px', opacity: 0.5 }}>
              © 2026 메이플 허브. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <FAB type="kakao" />
    </div>
  );
}
