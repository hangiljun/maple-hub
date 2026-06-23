'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ReviewsPage() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ title: '', nickname: '', password: '', content: '' });
  const [image, setImage] = useState<File | null>(null);

  // 구글 연동 전까지는 빈 배열
  const reviews: any[] = [];

  const filteredReviews = reviews.filter(r =>
    r.title.includes(searchTerm) || r.nickname.includes(searchTerm)
  );

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.nickname || !form.password || !form.content) {
      return alert('모든 항목을 입력하세요.');
    }
    alert('후기 등록 완료! (구글 연동 후 실제 저장됩니다)');
    setShowForm(false);
    setForm({ title: '', nickname: '', password: '', content: '' });
    setImage(null);
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: '#1E293B' }}>

      {/* 네비게이션 */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px 5%',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        alignItems: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textDecoration: 'none' }}>
          <div style={{ fontWeight: '900', color: '#667eea', fontSize: '20px' }}>🍁 메이플 허브</div>
        </Link>
        <div style={{ display: 'flex', gap: '20px', fontWeight: '600', fontSize: '15px', color: '#64748B' }}>
          <Link href="/" style={{ cursor: 'pointer', textDecoration: 'none', color: '#64748B' }}>홈</Link>
          <Link href="/notice" style={{ cursor: 'pointer', textDecoration: 'none', color: '#64748B' }}>공지사항</Link>
          <Link href="/items" style={{ cursor: 'pointer', textDecoration: 'none', color: '#64748B' }}>거래방법</Link>
          <span style={{ color: '#667eea', cursor: 'pointer' }}>이용후기</span>
        </div>
      </nav>

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
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1E293B', margin: 0 }}>이용후기</h2>
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

        {/* 안내 메시지 */}
        <div style={{
          background: '#FEF3C7',
          border: '1px solid #FDE68A',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '15px', color: '#92400E', fontWeight: '600' }}>
            💡 이용후기는 구글 연동 후 실제로 저장됩니다. 현재는 테스트 모드입니다.
          </p>
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

        {/* 빈 상태 */}
        {filteredReviews.length === 0 && (
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
        )}

        {/* 검색 영역 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '10px' }}>
          <input
            placeholder="제목 및 내용 검색"
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
          <button
            style={{
              padding: '10px 25px',
              backgroundColor: '#667eea',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#FFF',
              boxShadow: '0 2px 8px rgba(102,126,234,0.3)'
            }}
          >
            검색
          </button>
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

            <form onSubmit={handleUpload}>
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
                  onChange={e => setImage(e.target.files?.[0] || null)}
                  style={{ color: '#475569' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '15px',
                    backgroundColor: '#667eea',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(102,126,234,0.3)'
                  }}
                >
                  작성 완료
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1,
                    padding: '15px',
                    backgroundColor: '#F1F5F9',
                    color: '#64748B',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
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
