'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { firebaseConfig } from '@/lib/firebase-config';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { marked } from 'marked';

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

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'reviews' | 'notices'>('reviews');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', category: '공지사항', isPinned: false });
  const [noticeImage, setNoticeImage] = useState<File | null>(null);
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const noticeTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_auth');
    if (savedAuth === 'true') {
      setIsLoggedIn(true);
      fetchReviews();
    }
  }, []);

  // 탭 변경 시 데이터 새로고침
  useEffect(() => {
    if (isLoggedIn) {
      if (activeTab === 'reviews') {
        fetchReviews();
      } else if (activeTab === 'notices') {
        fetchNotices();
      }
    }
  }, [activeTab, isLoggedIn]);

  // 후기 불러오기
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

        reviewsData.sort((a: Review, b: Review) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('후기 로드 실패:', error);
    }
  };

  // 후기 삭제
  const handleDeleteReview = async (reviewId: string, title: string) => {
    if (!confirm(`"${title}" 후기를 삭제하시겠습니까?`)) return;

    try {
      const { projectId, apiKey } = firebaseConfig;
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/reviews/${reviewId}?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      alert('삭제되었습니다.');
      fetchReviews();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  // 공지사항 불러오기
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

        noticesData.sort((a: Notice, b: Notice) => {
          if (a.isPinned !== b.isPinned) {
            return a.isPinned ? -1 : 1;
          }
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        setNotices(noticesData);
      }
    } catch (error) {
      console.error('공지사항 로드 실패:', error);
    }
  };

  // 텍스트 포맷팅 함수
  const insertFormatting = (tag: string, value?: string) => {
    const textarea = noticeTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = noticeForm.content.substring(start, end);

    let formattedText = '';

    if (tag === 'bold') {
      formattedText = `<strong>${selectedText || '굵은 텍스트'}</strong>`;
    } else if (tag === 'color') {
      formattedText = `<span style="color: ${value}">${selectedText || '색상 텍스트'}</span>`;
    } else if (tag === 'size') {
      formattedText = `<span style="font-size: ${value}">${selectedText || '크기 텍스트'}</span>`;
    } else if (tag === 'link') {
      const url = prompt('링크 URL을 입력하세요:', 'https://');
      if (url) {
        formattedText = `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #3B82F6; text-decoration: underline;">${selectedText || url}</a>`;
      } else {
        return;
      }
    } else if (tag === 'table') {
      formattedText = `<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
  <thead>
    <tr style="background: #F1F5F9;">
      <th style="border: 1px solid #CBD5E1; padding: 12px; text-align: left; font-weight: 700;">헤더1</th>
      <th style="border: 1px solid #CBD5E1; padding: 12px; text-align: left; font-weight: 700;">헤더2</th>
      <th style="border: 1px solid #CBD5E1; padding: 12px; text-align: left; font-weight: 700;">헤더3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #CBD5E1; padding: 12px;">내용1</td>
      <td style="border: 1px solid #CBD5E1; padding: 12px;">내용2</td>
      <td style="border: 1px solid #CBD5E1; padding: 12px;">내용3</td>
    </tr>
    <tr>
      <td style="border: 1px solid #CBD5E1; padding: 12px;">내용4</td>
      <td style="border: 1px solid #CBD5E1; padding: 12px;">내용5</td>
      <td style="border: 1px solid #CBD5E1; padding: 12px;">내용6</td>
    </tr>
  </tbody>
</table>`;
    }

    const newContent =
      noticeForm.content.substring(0, start) +
      formattedText +
      noticeForm.content.substring(end);

    setNoticeForm({ ...noticeForm, content: newContent });

    // 포커스 및 커서 위치 조정
    setTimeout(() => {
      textarea.focus();
      const newPos = start + formattedText.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  // 본문에 이미지 삽입
  const insertImageToContent = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const timestamp = Date.now();
        const storageRef = ref(storage, `notices/content/${timestamp}_${file.name}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);

        const textarea = noticeTextareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const imageTag = `<img src="${imageUrl}" alt="이미지" style="max-width: 100%; height: auto; margin: 16px 0; border-radius: 8px;" />`;

        const newContent =
          noticeForm.content.substring(0, start) +
          imageTag +
          noticeForm.content.substring(start);

        setNoticeForm({ ...noticeForm, content: newContent });
        alert('이미지가 삽입되었습니다!');
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    };
    input.click();
  };

  // 공지사항 수정 시작
  const handleEditNotice = (notice: Notice) => {
    setEditingNoticeId(notice.id);
    setNoticeForm({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      isPinned: notice.isPinned
    });
    // 스크롤을 폼으로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 공지사항 수정 취소
  const handleCancelEdit = () => {
    setEditingNoticeId(null);
    setNoticeForm({ title: '', content: '', category: '공지사항', isPinned: false });
    setNoticeImage(null);
  };

  // 공지사항 작성/수정
  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.content) {
      return alert('제목과 내용을 입력하세요.');
    }

    setNoticeLoading(true);
    try {
      // 마크다운을 HTML로 변환 (기존 HTML은 유지)
      marked.setOptions({
        breaks: true,
        gfm: true,
      } as any);

      let htmlContent = '';
      try {
        // HTML로 변환된 콘텐츠인지 더 정확하게 확인
        // 1. <p>...</p> 또는 <h1>...</h1> 같은 완전한 태그 쌍이 있는지
        // 2. 또는 <table> 태그가 있는지 확인
        const hasCompleteHtmlTags =
          /<(p|h[1-6]|div|table|ul|ol)>[\s\S]*?<\/\1>/.test(noticeForm.content) ||
          noticeForm.content.includes('<table>') ||
          noticeForm.content.includes('</table>');

        console.log('=== 마크다운 변환 디버깅 ===');
        console.log('원본 콘텐츠 앞 100자:', noticeForm.content.substring(0, 100));
        console.log('HTML 태그 감지:', hasCompleteHtmlTags);

        if (!hasCompleteHtmlTags) {
          // HTML 태그가 없으면 마크다운으로 간주하고 변환
          const parsed = await marked.parse(noticeForm.content);
          htmlContent = typeof parsed === 'string' ? parsed : String(parsed);

          console.log('변환된 HTML 앞 200자:', htmlContent.substring(0, 200));

          // 빈 태그 및 불필요한 공백 제거
          htmlContent = htmlContent
            .replace(/<p>\s*<\/p>/g, '') // 빈 p 태그 제거
            .replace(/<p><\/p>/g, '') // 완전히 빈 p 태그 제거
            .replace(/(<\/p>)\s*(<p>\s*<\/p>\s*)+/g, '$1') // 연속된 빈 p 태그들 제거
            .replace(/(<p>\s*<\/p>\s*)+(<table)/g, '$2') // 표 바로 앞의 빈 p 태그 제거
            .replace(/(<\/table>)\s*(<p>\s*<\/p>\s*)+/g, '$1') // 표 바로 뒤의 빈 p 태그 제거
            .replace(/<br\s*\/?>\s*(<table)/g, '$1') // 표 바로 앞의 br 태그 제거
            .replace(/(<\/table>)\s*<br\s*\/?>/g, '$1') // 표 바로 뒤의 br 태그 제거
            .trim();

          console.log('정리 후 HTML 앞 200자:', htmlContent.substring(0, 200));
          console.log('마크다운 변환 완료 ✅');
        } else {
          // 이미 HTML이면 그대로 사용
          htmlContent = noticeForm.content;
          console.log('HTML 콘텐츠 그대로 사용 (변환 안 함)');
        }
      } catch (error) {
        console.error('마크다운 변환 실패:', error);
        htmlContent = noticeForm.content;
      }

      let imageUrl = '';

      // 썸네일 이미지 처리
      if (noticeImage) {
        const timestamp = Date.now();
        const storageRef = ref(storage, `notices/${timestamp}_${noticeImage.name}`);
        await uploadBytes(storageRef, noticeImage);
        imageUrl = await getDownloadURL(storageRef);
      } else if (!editingNoticeId) {
        // 신규 작성 시: 썸네일이 없으면 본문에서 첫 이미지 추출
        const imgMatch = htmlContent.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
          imageUrl = imgMatch[1];
        }
      }

      if (editingNoticeId) {
        // 수정 모드
        const updateData: any = {
          title: noticeForm.title,
          content: htmlContent,
          category: noticeForm.category,
          isPinned: noticeForm.isPinned
        };

        // 새 이미지가 있으면 추가
        if (imageUrl) {
          updateData.imageUrl = imageUrl;
        } else {
          // 새 이미지가 없으면 본문에서 추출
          const imgMatch = htmlContent.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) {
            updateData.imageUrl = imgMatch[1];
          }
        }

        await updateDoc(doc(db, 'notices', editingNoticeId), updateData);
        alert('공지사항이 수정되었습니다!');
        setEditingNoticeId(null);
      } else {
        // 신규 작성 모드
        await addDoc(collection(db, 'notices'), {
          title: noticeForm.title,
          content: htmlContent,
          category: noticeForm.category,
          imageUrl,
          isPinned: noticeForm.isPinned,
          createdAt: new Date()
        });
        alert('공지사항이 등록되었습니다!');
      }

      setNoticeForm({ title: '', content: '', category: '공지사항', isPinned: false });
      setNoticeImage(null);
      fetchNotices();
    } catch (error: any) {
      console.error('공지사항 처리 실패:', error);
      alert(`공지사항 처리에 실패했습니다.\n에러: ${error.message || error}`);
    } finally {
      setNoticeLoading(false);
    }
  };

  // 공지사항 삭제
  const handleDeleteNotice = async (noticeId: string, title: string) => {
    if (!confirm(`"${title}" 공지사항을 삭제하시겠습니까?`)) return;

    try {
      const { projectId, apiKey } = firebaseConfig;
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/notices/${noticeId}?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      alert('삭제되었습니다.');
      fetchNotices();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  // 급처템 불러오기

  // 로그인
  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
        localStorage.setItem('admin_auth', 'true');
        fetchReviews();
        alert('로그인 성공!');
      } else {
        alert(data.error || '비밀번호가 틀렸습니다.');
      }
    } catch (error) {
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  // 로그아웃
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('admin_auth');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '48px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          width: '90%',
          maxWidth: '400px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '900',
            color: '#1a1a1a',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            🔐 관리자 로그인
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            컨텐츠 관리
          </p>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '8px'
            }}>
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="관리자 비밀번호를 입력하세요"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid #e5e5e5',
                fontSize: '15px',
                fontWeight: '600'
              }}
            />
          </div>

          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)'
            }}
          >
            로그인
          </button>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#FEF3C7',
            borderRadius: '12px',
            fontSize: '13px',
            color: '#92400E',
            lineHeight: 1.6
          }}>
            💡 관리자 비밀번호를 입력하세요
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* 헤더 */}
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '20px',
          marginBottom: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a1a', marginBottom: '8px' }}>
                🎛️ 관리자 페이지
              </h1>
              <p style={{ fontSize: '14px', color: '#666' }}>
                후기, 공지사항, 급처템을 관리합니다
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => router.push('/')}
                style={{
                  padding: '12px 24px',
                  background: '#0066CC',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                홈으로
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '12px 24px',
                  background: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                로그아웃
              </button>
            </div>
          </div>

          {/* 탭 */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #f1f5f9' }}>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'reviews' ? '#667eea' : 'transparent',
                color: activeTab === 'reviews' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              📝 후기 관리 ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('notices')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'notices' ? '#667eea' : 'transparent',
                color: activeTab === 'notices' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              📢 공지사항 관리 ({notices.length})
            </button>
          </div>
        </div>

        {activeTab === 'reviews' && (
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '900',
              color: '#1a1a1a',
              marginBottom: '24px'
            }}>
              📝 후기 관리 ({reviews.length}개)
            </h2>

            {reviews.length === 0 ? (
              <div style={{
                padding: '80px 20px',
                textAlign: 'center',
                color: '#94A3B8'
              }}>
                등록된 후기가 없습니다.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      padding: '24px',
                      background: '#F8FAFC',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#1E293B',
                          marginBottom: '8px'
                        }}>
                          {review.title}
                        </h3>
                        <div style={{
                          fontSize: '14px',
                          color: '#64748B',
                          marginBottom: '12px'
                        }}>
                          <span>작성자: {review.nickname}</span>
                          <span style={{ margin: '0 8px' }}>•</span>
                          <span>조회수: {review.views}</span>
                          <span style={{ margin: '0 8px' }}>•</span>
                          <span>{new Date(review.createdAt).toLocaleDateString('ko-KR')}</span>
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#475569',
                          lineHeight: 1.6,
                          whiteSpace: 'pre-wrap',
                          maxHeight: '100px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {review.content}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review.id, review.title)}
                        style={{
                          padding: '8px 16px',
                          background: '#EF4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          marginLeft: '16px'
                        }}
                      >
                        삭제
                      </button>
                    </div>
                    {review.imageUrl && (
                      <div style={{ marginTop: '12px' }}>
                        <img
                          src={review.imageUrl}
                          alt="첨부 이미지"
                          style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            borderRadius: '8px',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notices' && (
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '900',
              color: '#1a1a1a',
              marginBottom: '24px'
            }}>
              {editingNoticeId ? '✏️ 공지사항 수정' : '✍️ 공지사항 작성'}
            </h2>

            {editingNoticeId && (
              <div style={{
                padding: '12px 16px',
                background: '#FEF3C7',
                border: '1px solid #FCD34D',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#92400E' }}>
                  📝 수정 모드
                </span>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    padding: '6px 12px',
                    background: 'white',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  취소
                </button>
              </div>
            )}

            <form onSubmit={handleNoticeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                  제목
                </label>
                <input
                  type="text"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  placeholder="공지사항 제목을 입력하세요"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                  카테고리
                </label>
                <input
                  type="text"
                  value={noticeForm.category}
                  onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                  placeholder="카테고리 (예: 공지사항, 점검 등)"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                  내용
                </label>

                {/* 텍스트 편집 툴바 */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '8px',
                  padding: '8px',
                  background: '#F8FAFC',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  flexWrap: 'wrap'
                }}>
                  <button
                    type="button"
                    onClick={() => insertFormatting('bold')}
                    style={{
                      padding: '6px 12px',
                      background: 'white',
                      border: '1px solid #CBD5E1',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                    title="굵게"
                  >
                    <strong>B</strong>
                  </button>

                  <div style={{ borderLeft: '1px solid #CBD5E1', margin: '0 4px' }}></div>

                  <span style={{ fontSize: '12px', color: '#64748B', alignSelf: 'center', marginRight: '4px' }}>크기:</span>
                  <button
                    type="button"
                    onClick={() => insertFormatting('size', '14px')}
                    style={{
                      padding: '6px 12px',
                      background: 'white',
                      border: '1px solid #CBD5E1',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    작게
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('size', '16px')}
                    style={{
                      padding: '6px 12px',
                      background: 'white',
                      border: '1px solid #CBD5E1',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    보통
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('size', '20px')}
                    style={{
                      padding: '6px 12px',
                      background: 'white',
                      border: '1px solid #CBD5E1',
                      borderRadius: '4px',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    크게
                  </button>

                  <div style={{ borderLeft: '1px solid #CBD5E1', margin: '0 4px' }}></div>

                  <span style={{ fontSize: '12px', color: '#64748B', alignSelf: 'center', marginRight: '4px' }}>색상:</span>
                  {['#000000', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => insertFormatting('color', color)}
                      style={{
                        width: '32px',
                        height: '32px',
                        background: color,
                        border: '2px solid white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        boxShadow: '0 0 0 1px #CBD5E1'
                      }}
                      title={color}
                    />
                  ))}

                  <div style={{ borderLeft: '1px solid #CBD5E1', margin: '0 4px' }}></div>

                  <button
                    type="button"
                    onClick={() => insertFormatting('link')}
                    style={{
                      padding: '6px 12px',
                      background: 'white',
                      border: '1px solid #CBD5E1',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="링크 삽입"
                  >
                    🔗 링크
                  </button>

                  <button
                    type="button"
                    onClick={insertImageToContent}
                    style={{
                      padding: '6px 12px',
                      background: 'white',
                      border: '1px solid #CBD5E1',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="본문에 이미지 삽입"
                  >
                    🖼️ 이미지
                  </button>

                  <button
                    type="button"
                    onClick={() => insertFormatting('table')}
                    style={{
                      padding: '6px 12px',
                      background: 'white',
                      border: '1px solid #CBD5E1',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="표 삽입"
                  >
                    📊 표
                  </button>
                </div>

                <textarea
                  ref={noticeTextareaRef}
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  placeholder="공지사항 내용을 입력하세요&#10;&#10;💡 텍스트를 선택한 후 위 버튼을 클릭하면 포맷이 적용됩니다"
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                  썸네일 이미지 (선택)
                </label>
                <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
                  💡 썸네일을 등록하지 않으면 본문의 첫 이미지가 자동으로 썸네일이 됩니다
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNoticeImage(e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={noticeForm.isPinned}
                  onChange={(e) => setNoticeForm({ ...noticeForm, isPinned: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="isPinned" style={{ fontSize: '14px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
                  📌 상단 고정
                </label>
              </div>

              <button
                type="submit"
                disabled={noticeLoading}
                style={{
                  padding: '14px',
                  background: noticeLoading ? '#94A3B8' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: noticeLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {noticeLoading
                  ? (editingNoticeId ? '수정 중...' : '등록 중...')
                  : (editingNoticeId ? '공지사항 수정' : '공지사항 등록')}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'notices' && (
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '900',
              color: '#1a1a1a',
              marginBottom: '24px'
            }}>
              📢 등록된 공지사항 ({notices.length}개)
            </h2>

            {notices.length === 0 ? (
              <div style={{
                padding: '80px 20px',
                textAlign: 'center',
                color: '#94A3B8'
              }}>
                등록된 공지사항이 없습니다.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    style={{
                      padding: '24px',
                      background: '#F8FAFC',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      position: 'relative'
                    }}
                  >
                    {notice.isPinned && (
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        right: '80px',
                        padding: '4px 12px',
                        background: '#FEF3C7',
                        color: '#92400E',
                        fontSize: '12px',
                        fontWeight: '700',
                        borderRadius: '6px'
                      }}>
                        📌 고정
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '12px',
                          color: '#7C3AED',
                          fontWeight: '700',
                          marginBottom: '8px'
                        }}>
                          [{notice.category}]
                        </div>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#1E293B',
                          marginBottom: '8px'
                        }}>
                          {notice.title}
                        </h3>
                        <div style={{
                          fontSize: '14px',
                          color: '#64748B',
                          marginBottom: '12px'
                        }}>
                          <span>{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</span>
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#475569',
                          lineHeight: 1.6,
                          whiteSpace: 'pre-wrap',
                          maxHeight: '100px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {notice.content}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                        <button
                          onClick={() => handleEditNotice(notice)}
                          style={{
                            padding: '8px 16px',
                            background: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(notice.id, notice.title)}
                          style={{
                            padding: '8px 16px',
                            background: '#EF4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    {notice.imageUrl && (
                      <div style={{ marginTop: '12px' }}>
                        <img
                          src={notice.imageUrl}
                          alt="첨부 이미지"
                          style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            borderRadius: '8px',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  );
}
