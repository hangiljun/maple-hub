'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { firebaseConfig } from '@/lib/firebase-config';
import Navigation from '@/components/Navigation';
import FAB from '@/components/FAB';

interface Review {
  id: string;
  title: string;
  nickname: string;
  content: string;
  imageUrl?: string;
  views: number;
  createdAt: any;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ title: '', nickname: '', content: '' });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // 리뷰 목록 불러오기
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      console.log('🔍 REST API로 후기 불러오기 시작...');
      const { projectId, apiKey } = firebaseConfig;
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/reviews?key=${apiKey}`;
      console.log('📡 요청 URL:', url.replace(apiKey, 'API_KEY_HIDDEN'));

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.documents) {
        const reviewsData = data.documents.map((doc: any) => {
          const docId = doc.name.split('/').pop();
          return {
            id: docId,
            title: doc.fields.title?.stringValue || '',
            nickname: doc.fields.nickname?.stringValue || '',
            password: doc.fields.password?.stringValue || '',
            content: doc.fields.content?.stringValue || '',
            imageUrl: doc.fields.imageUrl?.stringValue || '',
            views: parseInt(doc.fields.views?.integerValue || '0'),
            createdAt: doc.fields.createdAt?.timestampValue || doc.createTime
          };
        });

        // 최신순 정렬
        reviewsData.sort((a: Review, b: Review) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        setReviews(reviewsData);
        console.log(`✅ ${reviewsData.length}개의 후기 로드 완료!`);
      } else {
        setReviews([]);
        console.log('후기가 없습니다.');
      }
    } catch (error) {
      console.error('❌ 리뷰 불러오기 실패:', error);
    }
  };

  // 이미지 업로드
  const uploadImage = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const storageRef = ref(storage, `reviews/${timestamp}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // 리뷰 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 입력값 검증
    if (!form.title || !form.nickname || !form.content) {
      alert('모든 항목을 입력하세요.');
      return;
    }

    // 이미 로딩 중이면 중복 실행 방지
    if (loading) {
      console.log('이미 처리 중입니다.');
      return;
    }

    setLoading(true);
    console.log('=== 후기 등록 시작 ===');
    console.log('Firebase 프로젝트 ID:', firebaseConfig.projectId);

    try {
      let imageUrl = '';

      // 이미지 업로드
      if (image) {
        console.log('1. 이미지 업로드 시작:', image.name);
        try {
          imageUrl = await uploadImage(image);
          console.log('1. 이미지 업로드 완료:', imageUrl);
        } catch (imgError: any) {
          console.error('이미지 업로드 실패:', imgError);
          throw new Error(`이미지 업로드 실패: ${imgError.message}`);
        }
      }

      // Firestore에 REST API로 저장
      console.log('2. REST API로 Firestore에 데이터 저장 시작');
      console.log('저장할 데이터:', {
        title: form.title,
        nickname: form.nickname,
        content: form.content.substring(0, 50) + '...',
        imageUrl: imageUrl || '없음',
      });

      const { projectId, apiKey } = firebaseConfig;
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/reviews?key=${apiKey}`;
      console.log('📡 요청 URL:', url.replace(apiKey, 'API_KEY_HIDDEN'));

      const body = {
        fields: {
          title: { stringValue: form.title },
          nickname: { stringValue: form.nickname },
          content: { stringValue: form.content },
          imageUrl: { stringValue: imageUrl || '' },
          views: { integerValue: 0 },
          createdAt: { timestampValue: new Date().toISOString() }
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      const docId = result.name.split('/').pop();
      console.log('2. Firestore 저장 완료, ID:', docId);

      // 성공 처리
      alert('후기가 등록되었습니다!');
      setShowForm(false);
      setForm({ title: '', nickname: '', content: '' });
      setImage(null);

      // 목록 새로고침
      console.log('3. 목록 새로고침 시작');
      await fetchReviews();
      console.log('=== 후기 등록 완료 ===');

    } catch (error: any) {
      console.error('❌ 후기 등록 실패:', error);
      console.error('에러 타입:', typeof error);
      console.error('에러 상세:', {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack
      });

      let errorMessage = '후기 등록에 실패했습니다.';

      if (error.code === 'permission-denied') {
        errorMessage = '❌ Firebase 권한 오류\n\nFirebase Console에서:\n1. Firestore Database 규칙 탭 클릭\n2. 규칙 확인\n3. "게시" 버튼 클릭했는지 확인\n4. 5분 정도 기다린 후 다시 시도';
      } else if (error.message.includes('시간 초과') || error.message.includes('timeout')) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage += `\n\n오류: ${error.message}`;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
      console.log('로딩 상태 해제');
    }
  };



  const filteredReviews = reviews.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' });
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: '#1E293B' }}>
      <style jsx global>{`
        @media (max-width: 768px) {
          .reviews-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .reviews-table-header {
            display: none !important;
          }
          .reviews-table-row > div:nth-child(1),
          .reviews-table-row > div:nth-child(4),
          .reviews-table-row > div:nth-child(5) {
            display: none !important;
          }
          .reviews-table-row > div:nth-child(2) {
            width: 70% !important;
          }
          .reviews-table-row > div:nth-child(3) {
            width: 30% !important;
          }
          .reviews-search-input {
            width: 100% !important;
            max-width: 350px !important;
          }
        }
      `}</style>
      <Navigation currentPage="reviews" />

      {/* 배너 영역 */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1200px', height: '300px', position: 'relative', overflow: 'hidden' }}>
          <img
            src="/reviews-banner.png"
            alt="메이플 허브 이용후기 - 실제 고객 거래 후기"
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>

        {/* 헤더 */}
        <div className="reviews-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1E293B', margin: 0 }}>이용후기 ({reviews.length})</h2>
          <button
            onClick={() => setShowForm(true)}
            style={{
              backgroundColor: '#667eea',
              color: '#FFF',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(102,126,234,0.3)'
            }}
          >
            + 후기 쓰기
          </button>
        </div>

        {/* 테이블 헤더 */}
        <div className="reviews-table-header" style={{
          borderTop: '2px solid #667eea',
          borderBottom: '1px solid #E2E8F0',
          padding: '15px 0',
          display: 'flex',
          fontWeight: 'bold',
          textAlign: 'center',
          backgroundColor: '#F8FAFC',
          fontSize: '14px',
          color: '#64748B'
        }}>
          <div style={{ width: '10%' }}>번호</div>
          <div style={{ width: '55%' }}>제목</div>
          <div style={{ width: '15%' }}>작성자</div>
          <div style={{ width: '10%' }}>작성일</div>
          <div style={{ width: '10%' }}>조회</div>
        </div>

        {/* 리뷰 목록 */}
        {filteredReviews.length === 0 ? (
          <div style={{
            padding: '80px 20px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
            <p style={{ fontSize: '18px', color: '#64748B', fontWeight: '600', marginBottom: '12px' }}>
              아직 등록된 후기가 없습니다
            </p>
            <p style={{ fontSize: '14px', color: '#94A3B8' }}>
              첫 번째 후기를 남겨주세요!
            </p>
          </div>
        ) : (
          filteredReviews.map((review, index) => (
            <Link
              key={review.id}
              href={`/reviews/${review.id}`}
              className="reviews-table-row"
              style={{
                display: 'flex',
                padding: '18px 0',
                borderBottom: '1px solid #E2E8F0',
                cursor: 'pointer',
                backgroundColor: '#FFFFFF',
                textAlign: 'center',
                fontSize: '14px',
                transition: 'background-color 0.2s',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              <div style={{ width: '10%', color: '#94A3B8' }}>{reviews.length - index}</div>
              <div style={{ width: '55%', textAlign: 'left', paddingLeft: '20px', color: '#1E293B', fontWeight: '500' }}>
                {review.imageUrl && '📷 '}{review.title}
              </div>
              <div style={{ width: '15%', color: '#64748B' }}>{review.nickname}</div>
              <div style={{ width: '10%', color: '#94A3B8' }}>{formatDate(review.createdAt)}</div>
              <div style={{ width: '10%', color: '#94A3B8' }}>{review.views}</div>
            </Link>
          ))
        )}

        {/* 검색 영역 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '10px' }}>
          <input
            placeholder="제목 및 작성자 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="reviews-search-input"
            style={{
              padding: '12px 20px',
              border: '1px solid #E2E8F0',
              width: '350px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              color: '#1E293B',
              outline: 'none',
              fontSize: '14px'
            }}
          />
        </div>

        {/* SEO 텍스트 섹션 1: 이용 후기가 중요한 이유 */}
        <div style={{
          marginTop: '80px',
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
            📝 왜 이용 후기가 중요할까요?
          </h2>
          <div style={{
            fontSize: '15px',
            color: '#475569',
            lineHeight: 1.9,
            textAlign: 'left'
          }}>
            <p style={{ marginBottom: '20px' }}>
              메이플스토리 아이템 거래 시장에서 가장 큰 걱정거리는 바로 '사기'입니다.
              인게임 거래든 현금 거래든, 얼굴을 모르는 상대와 고가의 아이템을 주고받는 것은 언제나 위험이 따릅니다.
              이러한 불안감을 해소하는 가장 확실한 방법이 바로 <strong style={{ color: '#667eea' }}>실제 이용자들의 솔직한 후기</strong>입니다.
            </p>
            <p style={{ marginBottom: '20px' }}>
              메이플 허브의 이용 후기는 실제로 급처템 거래를 완료한 유저들이 직접 작성한 생생한 경험담입니다.
              거래 과정의 투명성, 시세의 합리성, 응대의 친절함, 정산 속도 등 실제 거래에서 중요한 모든 요소들을 확인할 수 있습니다.
              특히 사진 인증과 함께 올라오는 후기는 거래의 신뢰도를 객관적으로 검증할 수 있는 강력한 증거가 됩니다.
            </p>
            <p style={{ marginBottom: '20px' }}>
              또한 이용 후기를 통해 다른 유저들이 어떤 아이템을 얼마에 판매했는지, 어떤 서버의 매물이 많은지,
              거래 시 주의할 점은 무엇인지 등 실질적인 정보를 얻을 수 있습니다.
              메이플 급처 거래를 고민 중이라면 먼저 후기를 꼼꼼히 읽어보고 안전한 거래를 시작하세요.
            </p>
          </div>
        </div>

        {/* SEO 텍스트 섹션 2: 실제 거래 후기 하이라이트 */}
        <div style={{
          marginBottom: '60px',
          padding: '48px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '24px',
          color: 'white',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '900',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            ⭐ 실제 고객들의 생생한 거래 경험
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '28px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>💰</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
                합리적인 시세 평가
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                "다른 곳에서는 헐값에 후려치려고 했는데, 여기는 경매장 시세 그대로 쳐줘서 만족스러웠어요.
                무엇보다 시세 산정 과정을 투명하게 설명해줘서 신뢰가 갔습니다."
              </p>
              <p style={{ fontSize: '12px', marginTop: '12px', opacity: 0.8, fontStyle: 'italic' }}>
                - 스카니아 유저 김**님
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '28px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
                빠른 정산 속도
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                "카톡으로 문의하고 10분 만에 시세 확인 → 게임 접속 → 거래 완료까지 끝났어요.
                급하게 템 처분해야 했는데 정말 신속하게 처리해주셔서 감사했습니다!"
              </p>
              <p style={{ fontSize: '12px', marginTop: '12px', opacity: 0.8, fontStyle: 'italic' }}>
                - 루나 유저 이**님
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '28px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🛡️</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
                안전한 거래 진행
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                "처음 거래라 걱정했는데, 인게임에서 직접 만나서 아이템 확인하고 거래하니까 안심됐어요.
                사기 걱정 없이 깔끔하게 정산 받았습니다. 다음에도 이용할게요!"
              </p>
              <p style={{ fontSize: '12px', marginTop: '12px', opacity: 0.8, fontStyle: 'italic' }}>
                - 크로아 유저 박**님
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '28px',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>💬</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
                친절한 상담 서비스
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.95 }}>
                "템 가격을 몰라서 물어봤더니 하나하나 자세히 설명해주시고,
                어떤 게 더 비싸게 팔리는지까지 알려주셨어요. 초보자도 안심하고 이용할 수 있어요."
              </p>
              <p style={{ fontSize: '12px', marginTop: '12px', opacity: 0.8, fontStyle: 'italic' }}>
                - 챌린저스 유저 최**님
              </p>
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '28px',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>
                ⚡ 평균 정산 시간: <span style={{ fontSize: '28px', fontWeight: '900' }}>15분</span>
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                문의부터 정산까지 빠르게 처리됩니다
              </div>
            </div>
            <div style={{
              padding: '16px 24px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '700', lineHeight: 1.6 }}>
                ✅ 사업자 등록증도 가지고 있어요
              </div>
              <div style={{ fontSize: '13px', opacity: 0.95, marginTop: '4px' }}>
                정식 사업자로 안전하게 거래하세요
              </div>
            </div>
          </div>
        </div>

        {/* SEO 텍스트 섹션 3: 후기 작성 가이드 */}
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
            ✍️ 이용 후기 작성 가이드
          </h2>
          <div style={{
            fontSize: '15px',
            color: '#475569',
            lineHeight: 1.9,
            textAlign: 'left'
          }}>
            <p style={{ marginBottom: '24px' }}>
              여러분의 소중한 경험을 다른 유저들과 공유해주세요!
              좋은 후기는 커뮤니티의 신뢰를 높이고, 더 많은 유저들이 안전하게 거래할 수 있도록 돕습니다.
            </p>

            <div style={{
              background: '#F8FAFC',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '20px',
              border: '1px solid #E2E8F0'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#667eea', marginBottom: '16px' }}>
                📌 후기에 꼭 포함하면 좋은 내용
              </h3>
              <ul style={{ fontSize: '14px', lineHeight: 2, paddingLeft: '20px', color: '#475569' }}>
                <li><strong>거래 서버:</strong> 스카니아, 루나, 크로아, 챌린저스 등</li>
                <li><strong>거래 아이템:</strong> 어떤 아이템을 판매했는지</li>
                <li><strong>가격 만족도:</strong> 시세가 합리적이었는지</li>
                <li><strong>정산 속도:</strong> 문의부터 정산까지 걸린 시간</li>
                <li><strong>거래 과정:</strong> 응대, 안전성, 편의성 등</li>
                <li><strong>사진 인증:</strong> 거래 스크린샷이나 대화 내역 (개인정보 제외)</li>
              </ul>
            </div>

            <div style={{
              background: '#FEF3C7',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '20px',
              border: '1px solid #F59E0B'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#92400E', marginBottom: '16px' }}>
                💡 후기 작성 TIP
              </h3>
              <ul style={{ fontSize: '14px', lineHeight: 2, paddingLeft: '20px', color: '#78350F' }}>
                <li>구체적인 금액보다는 "시세 대비 만족스러웠다" 정도로 표현해주세요</li>
                <li>거래 과정에서 특히 좋았던 점이나 아쉬웠던 점을 솔직하게 작성해주세요</li>
                <li>사진은 개인정보(닉네임, 연락처 등)를 모자이크 처리 후 업로드해주세요</li>
                <li>욕설이나 비방은 자제하고, 건설적인 피드백을 남겨주세요</li>
                <li>광고성 글이나 허위 후기는 운영 정책상 삭제될 수 있습니다</li>
              </ul>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #A5B4FC',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#4C1D95', marginBottom: '12px' }}>
                🎁 후기 작성 혜택
              </p>
              <p style={{ fontSize: '14px', color: '#5B21B6', lineHeight: 1.8 }}>
                소중한 후기를 남겨주신 분들께는 다음 거래 시 <strong>우대 시세</strong>를 적용해드립니다!<br />
                여러분의 한 줄 후기가 메이플 커뮤니티의 신뢰를 만듭니다.
              </p>
            </div>
          </div>
        </div>

        {/* SEO 텍스트 섹션 4: 투명한 거래 문화 */}
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
            🛡️ 투명한 거래 문화를 함께 만들어요
          </h2>
          <div style={{
            fontSize: '15px',
            color: '#475569',
            lineHeight: 1.9,
            textAlign: 'left'
          }}>
            <p style={{ marginBottom: '20px' }}>
              메이플스토리 아이템 거래 시장은 오랫동안 사기와 불신의 문제로 고통받아 왔습니다.
              하지만 <strong style={{ color: '#10b981' }}>이용 후기 시스템</strong>을 통해 우리는 더욱 투명하고 안전한 거래 문화를 만들어갈 수 있습니다.
            </p>
            <p style={{ marginBottom: '20px' }}>
              모든 거래 내역이 후기로 공개되면, 불합리한 가격 책정이나 불친절한 응대는 자연스럽게 걸러집니다.
              반대로 합리적인 시세와 신속한 정산, 친절한 상담을 제공하는 곳은 긍정적인 후기를 통해 더욱 성장할 수 있습니다.
              이것이 바로 <strong style={{ color: '#10b981' }}>투명한 시장의 힘</strong>입니다.
            </p>
            <p style={{ marginBottom: '20px' }}>
              메이플 허브는 모든 이용 후기를 소중히 여기며, 여러분의 피드백을 바탕으로 더 나은 서비스를 제공하기 위해 노력합니다.
              좋은 점은 더욱 발전시키고, 아쉬운 점은 개선해 나가며, 메이플스토리 급처 거래의 새로운 기준을 만들어가겠습니다.
              여러분의 솔직한 후기가 더 안전하고 신뢰할 수 있는 메이플 거래 문화를 만드는 초석이 됩니다.
            </p>

            <div style={{
              marginTop: '32px',
              padding: '24px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '16px', color: '#1E293B', lineHeight: 1.8 }}>
                <strong style={{ color: '#667eea' }}>지금 바로 여러분의 거래 경험을 공유해주세요!</strong><br />
                <span style={{ fontSize: '14px', color: '#64748B' }}>
                  한 줄의 후기가 수천 명의 안전한 거래를 지켜냅니다.
                </span>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 후기 작성 모달 */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '30px',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            color: '#1E293B'
          }}>
            <h3 style={{
              marginBottom: '20px',
              fontWeight: 'bold',
              fontSize: '20px',
              borderBottom: '1px solid #F1F5F9',
              paddingBottom: '10px',
              color: '#667eea'
            }}>
              후기 작성
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#64748B' }}>제목 *</p>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  style={lightInputStyle}
                  placeholder="제목을 입력하세요"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#64748B' }}>작성자 *</p>
                <input
                  placeholder="닉네임"
                  value={form.nickname}
                  onChange={e => setForm({ ...form, nickname: e.target.value })}
                  style={lightInputStyle}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#64748B' }}>내용 *</p>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  style={{ ...lightInputStyle, height: '200px', resize: 'none' }}
                  placeholder="내용을 입력하세요"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#64748B' }}>사진 첨부</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImage(e.target.files?.[0] || null)}
                  style={{ color: '#475569' }}
                />
                {image && (
                  <p style={{ fontSize: '12px', color: '#10b981', marginTop: '5px' }}>✓ {image.name}</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '15px',
                    backgroundColor: loading ? '#94A3B8' : '#667eea',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(102,126,234,0.3)'
                  }}
                >
                  {loading ? '등록 중...' : '작성 완료'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm({ title: '', nickname: '', content: '' });
                    setImage(null);
                  }}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '15px',
                    backgroundColor: '#F1F5F9',
                    color: '#64748B',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 리뷰 상세보기 모달 */}
      {selectedReview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '30px',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            color: '#1E293B'
          }}>
            <div style={{ borderBottom: '2px solid #667eea', paddingBottom: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', color: '#1E293B' }}>
                {selectedReview.title}
              </h3>
              <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#64748B' }}>
                <span>작성자: {selectedReview.nickname}</span>
                <span>|</span>
                <span>작성일: {formatDate(selectedReview.createdAt)}</span>
                <span>|</span>
                <span>조회: {selectedReview.views}</span>
              </div>
            </div>

            {selectedReview.imageUrl && (
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <img
                  src={selectedReview.imageUrl}
                  alt="리뷰 이미지"
                  style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </div>
            )}

            <div style={{
              padding: '20px',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              minHeight: '200px',
              fontSize: '15px',
              lineHeight: '1.8',
              color: '#1E293B',
              whiteSpace: 'pre-wrap',
              marginBottom: '20px'
            }}>
              {selectedReview.content}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setSelectedReview(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#667eea',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <FAB type="kakao" />
    </div>
  );
}

const lightInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: '1px solid #E2E8F0',
  borderRadius: '8px',
  fontSize: '14px',
  backgroundColor: '#F8FAFC',
  color: '#1E293B',
  outline: 'none'
};
