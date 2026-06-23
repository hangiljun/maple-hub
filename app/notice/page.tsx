'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Calendar } from 'lucide-react';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  important: boolean;
  createdAt: any;
}

const ADMIN_PASSWORD = 'maple2026'; // 관리자 비밀번호 (나중에 환경 변수로 변경)

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', important: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const noticesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000).toLocaleDateString('ko-KR') : ''
      })) as Notice[];
      setNotices(noticesData);
    } catch (error) {
      console.error('공지사항 불러오기 실패:', error);
    }
  };

  const handleAdminLogin = () => {
    const password = prompt('관리자 비밀번호를 입력하세요:');
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminForm(true);
    } else if (password) {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      return alert('제목과 내용을 입력하세요.');
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'notices'), {
        title: form.title,
        content: form.content,
        important: form.important,
        createdAt: new Date()
      });

      alert('공지사항이 등록되었습니다!');
      setShowAdminForm(false);
      setForm({ title: '', content: '', important: false });
      fetchNotices();
    } catch (error) {
      console.error('공지사항 등록 실패:', error);
      alert('공지사항 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noticeId: string) => {
    if (!isAdmin) {
      const password = prompt('관리자 비밀번호를 입력하세요:');
      if (password !== ADMIN_PASSWORD) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
    }

    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteDoc(doc(db, 'notices', noticeId));
      alert('삭제되었습니다.');
      fetchNotices();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', padding: '32px 0', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 16px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#F1F5F9', marginBottom: '8px' }}>공지사항 & 소식</h1>
            <p style={{ fontSize: '14px', color: '#94A3B8' }}>MAPLE HUB의 최신 소식을 확인하세요</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              href="/"
              style={{
                padding: '10px 20px',
                backgroundColor: '#334155',
                color: '#F1F5F9',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              홈으로
            </Link>
            <button
              onClick={handleAdminLogin}
              style={{
                padding: '10px 20px',
                backgroundColor: '#667eea',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              관리자
            </button>
          </div>
        </div>

        {/* Notice List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notices.length === 0 ? (
            <div style={{
              backgroundColor: 'rgba(30, 41, 59, 0.3)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '12px',
              padding: '80px 20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📢</div>
              <p style={{ fontSize: '18px', color: '#94A3B8', fontWeight: '600', marginBottom: '12px' }}>
                등록된 공지사항이 없습니다
              </p>
            </div>
          ) : (
            notices.map((notice) => (
              <div
                key={notice.id}
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.3)',
                  border: '1px solid rgba(71, 85, 105, 0.5)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.4)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.3)'}
              >
                <div style={{ padding: '24px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      flexShrink: 0,
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: notice.important ? 'rgba(251, 191, 36, 0.2)' : 'rgba(71, 85, 105, 0.5)'
                    }}>
                      <Bell style={{ width: '20px', height: '20px', color: notice.important ? '#FBBF24' : '#94A3B8' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        {notice.important && (
                          <span style={{
                            padding: '2px 8px',
                            backgroundColor: 'rgba(251, 191, 36, 0.2)',
                            color: '#FBBF24',
                            fontSize: '12px',
                            fontWeight: '600',
                            borderRadius: '4px'
                          }}>
                            중요
                          </span>
                        )}
                        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#F1F5F9' }}>{notice.title}</h2>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748B' }}>
                        <Calendar style={{ width: '12px', height: '12px' }} />
                        <span>{notice.date}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(notice.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#EF4444',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        삭제
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <p style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: '1.8', paddingLeft: '52px', whiteSpace: 'pre-wrap' }}>
                    {notice.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Admin Form Modal */}
      {showAdminForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#1E293B',
            padding: '30px',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '600px',
            border: '1px solid #334155',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{
              marginBottom: '20px',
              fontWeight: 'bold',
              fontSize: '20px',
              borderBottom: '1px solid #334155',
              paddingBottom: '10px',
              color: '#F1F5F9'
            }}>
              공지사항 작성 (관리자)
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#94A3B8' }}>제목 *</p>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  style={darkInputStyle}
                  placeholder="제목을 입력하세요"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#94A3B8' }}>내용 *</p>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  style={{ ...darkInputStyle, height: '200px', resize: 'none' }}
                  placeholder="내용을 입력하세요"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.important}
                    onChange={e => setForm({ ...form, important: e.target.checked })}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>중요 공지로 표시</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '15px',
                    backgroundColor: loading ? '#475569' : '#667eea',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  {loading ? '등록 중...' : '등록'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminForm(false);
                    setForm({ title: '', content: '', important: false });
                  }}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '15px',
                    backgroundColor: '#334155',
                    color: '#94A3B8',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
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

const darkInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: '1px solid #334155',
  borderRadius: '8px',
  fontSize: '14px',
  backgroundColor: '#0F172A',
  color: '#F1F5F9',
  outline: 'none'
};
