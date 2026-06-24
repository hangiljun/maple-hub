'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc, increment, deleteDoc, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import app from '@/lib/firebase';
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
  password: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ title: '', nickname: '', password: '', content: '' });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // 리뷰 목록 불러오기
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
    } catch (error) {
      console.error('리뷰 불러오기 실패:', error);
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
    if (!form.title || !form.nickname || !form.password || !form.content) {
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
    console.log('Firebase 프로젝트 ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

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

      // Firestore에 저장 (타임아웃 10초로 단축)
      console.log('2. Firestore에 데이터 저장 시작');
      console.log('저장할 데이터:', {
        title: form.title,
        nickname: form.nickname,
        content: form.content.substring(0, 50) + '...',
        imageUrl: imageUrl || '없음',
      });

      // 타임아웃을 10초로 줄이고 더 명확한 에러 메시지
      let timeoutId: NodeJS.Timeout;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          console.error('⏰ 10초 타임아웃 발생!');
          reject(new Error('Firebase 저장 시간 초과 (10초)\n\n가능한 원인:\n1. Firebase 규칙이 제대로 게시되지 않음\n2. 네트워크 연결 문제\n3. 브라우저 확장 프로그램이 차단\n\n개발자 도구 > Network 탭을 확인해주세요.'));
        }, 10000);
      });

      const savePromise = addDoc(collection(db, 'reviews'), {
        title: form.title,
        nickname: form.nickname,
        password: form.password,
        content: form.content,
        imageUrl: imageUrl || '',
        views: 0,
        createdAt: new Date()
      }).then((result) => {
        clearTimeout(timeoutId);
        return result;
      });

      const docRef = await Promise.race([savePromise, timeoutPromise]) as any;
      console.log('2. Firestore 저장 완료, ID:', docRef.id);

      // 성공 처리
      alert('후기가 등록되었습니다!');
      setShowForm(false);
      setForm({ title: '', nickname: '', password: '', content: '' });
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

      // Firebase 연결 상태 확인
      console.log('Firebase 앱 이름:', app?.name);
      console.log('Firestore 인스턴스:', db ? '존재함' : '없음');

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

  // 리뷰 클릭 (조회수 증가)
  const handleReviewClick = async (review: Review) => {
    try {
      const reviewRef = doc(db, 'reviews', review.id);
      await updateDoc(reviewRef, {
        views: increment(1)
      });
      setSelectedReview({ ...review, views: review.views + 1 });
    } catch (error) {
      console.error('조회수 증가 실패:', error);
      setSelectedReview(review);
    }
  };

  // 리뷰 삭제
  const handleDelete = async (reviewId: string) => {
    const password = prompt('비밀번호를 입력하세요:');
    if (!password) return;

    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    if (review.password !== password) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      alert('삭제되었습니다.');
      setSelectedReview(null);
      fetchReviews();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
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

      <Navigation currentPage="reviews" />

      {/* 배너 영역 */}
      <div style={{ width: '100%', backgroundColor: '#E2E8F0', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          aspectRatio: '4/1',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
          }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>이용후기</h1>
            <p style={{ fontSize: '16px', marginTop: '10px', color: 'rgba(255,255,255,0.9)' }}>고객님들의 소중한 거래 후기를 확인하세요.</p>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>

        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
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
        <div style={{
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
            <div
              key={review.id}
              onClick={() => handleReviewClick(review)}
              style={{
                display: 'flex',
                padding: '18px 0',
                borderBottom: '1px solid #E2E8F0',
                cursor: 'pointer',
                backgroundColor: '#FFFFFF',
                textAlign: 'center',
                fontSize: '14px',
                transition: 'background-color 0.2s'
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
            </div>
          ))
        )}

        {/* 검색 영역 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '10px' }}>
          <input
            placeholder="제목 및 작성자 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

              <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#64748B' }}>작성자 *</p>
                  <input
                    placeholder="닉네임"
                    value={form.nickname}
                    onChange={e => setForm({ ...form, nickname: e.target.value })}
                    style={lightInputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#64748B' }}>비밀번호 *</p>
                  <input
                    type="password"
                    placeholder="수정/삭제용 비밀번호"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    style={lightInputStyle}
                  />
                </div>
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
                    setForm({ title: '', nickname: '', password: '', content: '' });
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
                onClick={() => handleDelete(selectedReview.id)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#EF4444',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                삭제
              </button>
              <button
                onClick={() => setSelectedReview(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#F1F5F9',
                  color: '#64748B',
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
