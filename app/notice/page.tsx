'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import FAB from '@/components/FAB';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  isPinned: boolean;
  createdAt: any;
}

const ADMIN_PASSWORD = 'rlfwns55';

export default function NoticePage() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeTab, setActiveTab] = useState('전체');
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: '공지사항', isPinned: false });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = ['전체', '공지사항', '메이플 패치', '이벤트', '업데이트'];

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      let noticesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notice[];

      // 고정된 공지를 맨 위로
      noticesData.sort((a, b) => {
        if (a.isPinned === b.isPinned) return 0;
        return a.isPinned ? -1 : 1;
      });

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

  const uploadImage = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const storageRef = ref(storage, `notices/${timestamp}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      return alert('제목과 내용을 입력하세요.');
    }

    setLoading(true);
    try {
      let imageUrl = '';
      if (image) {
        console.log('이미지 업로드 시작:', image.name);
        imageUrl = await uploadImage(image);
        console.log('이미지 업로드 완료:', imageUrl);
      }

      console.log('Firestore에 데이터 저장 시작');
      await addDoc(collection(db, 'notices'), {
        title: form.title,
        content: form.content,
        category: form.category,
        imageUrl,
        isPinned: form.isPinned,
        createdAt: new Date()
      });
      console.log('Firestore 저장 완료');

      alert('공지사항이 등록되었습니다!');
      setShowAdminForm(false);
      setForm({ title: '', content: '', category: '공지사항', isPinned: false });
      setImage(null);
      fetchNotices();
    } catch (error: any) {
      console.error('공지사항 등록 실패:', error);
      alert(`공지사항 등록에 실패했습니다.\n에러: ${error.message || error}`);
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

  const filteredNotices = activeTab === '전체' ? notices : notices.filter(n => n.category === activeTab);

  const extractFirstImg = (content: string) => {
    if (!content) return null;
    const imgReg = /<img[^>]+src=["']([^"']+)["']/;
    const match = imgReg.exec(content);
    return match ? match[1] : null;
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: '#1E293B' }}>
      {/* 네비게이션 */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px 5%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderBottom: '1px solid #E2E8F0',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textDecoration: 'none' }}>
          <img src="/logo.ico" alt="MAPLE HUB" style={{ width: '40px', height: '40px' }} />
          <span style={{ fontSize: '20px', fontWeight: '900', color: '#667eea' }}>메이플 허브</span>
        </Link>
        <div style={{ display: 'flex', gap: '25px', fontSize: '15px', fontWeight: '600' }}>
          <Link href="/" style={{ color: '#64748B', textDecoration: 'none', cursor: 'pointer' }}>홈</Link>
          <Link href="/items" style={{ color: '#64748B', textDecoration: 'none', cursor: 'pointer' }}>급처템</Link>
          <Link href="/meso" style={{ color: '#64748B', textDecoration: 'none', cursor: 'pointer' }}>메소거래</Link>
          <Link href="/discord" style={{ color: '#64748B', textDecoration: 'none', cursor: 'pointer' }}>디스코드</Link>
          <Link href="/reviews" style={{ color: '#64748B', textDecoration: 'none', cursor: 'pointer' }}>이용후기</Link>
          <span style={{ color: '#667eea', cursor: 'pointer' }}>공지사항</span>
        </div>
      </nav>

      {/* 배너 */}
      <div style={{ width: '100%', backgroundColor: '#E2E8F0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1200px', aspectRatio: '4/1', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>공지사항</h1>
            <p style={{ fontSize: '16px', marginTop: '10px', color: 'rgba(255,255,255,0.9)' }}>새로운 소식과 이벤트를 확인하세요.</p>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto' }}>

        {/* 카테고리 탭 + 관리자 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '30px',
                  border: activeTab === tab ? '1px solid #667eea' : '1px solid #E2E8F0',
                  backgroundColor: activeTab === tab ? '#667eea' : '#FFFFFF',
                  color: activeTab === tab ? '#FFF' : '#64748B',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: '0.3s',
                  boxShadow: activeTab === tab ? '0 2px 8px rgba(102,126,234,0.3)' : 'none'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={handleAdminLogin}
            style={{
              padding: '10px 20px',
              backgroundColor: '#667eea',
              color: '#FFF',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 2px 8px rgba(102,126,234,0.3)'
            }}
          >
            관리자
          </button>
        </div>

        {/* 공지사항 카드 그리드 */}
        {filteredNotices.length === 0 ? (
          <div style={{
            padding: '80px 20px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📢</div>
            <p style={{ fontSize: '18px', color: '#64748B', fontWeight: '600', marginBottom: '12px' }}>
              등록된 공지사항이 없습니다
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {filteredNotices.map((notice) => {
              const thumbnail = notice.imageUrl || extractFirstImg(notice.content);
              return (
                <div
                  key={notice.id}
                  onClick={() => router.push(`/notice/${notice.id}`)}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: notice.isPinned ? '2px solid #667eea' : '1px solid #E2E8F0',
                    boxShadow: notice.isPinned ? '0 4px 20px rgba(102, 126, 234, 0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = notice.isPinned ? '0 4px 20px rgba(102, 126, 234, 0.15)' : '0 2px 8px rgba(0,0,0,0.06)';
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#F1F5F9' }}>
                    {thumbnail ? (
                      <img src={thumbnail} alt={notice.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94A3B8', fontSize: '13px' }}>
                        이미지 없음
                      </div>
                    )}
                    {notice.isPinned && (
                      <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '24px' }}>📌</div>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      left: '15px',
                      backgroundColor: '#667eea',
                      color: '#FFF',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      padding: '4px 10px',
                      borderRadius: '5px'
                    }}>
                      {notice.category || '공지'}
                    </div>
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notice.id);
                        }}
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          padding: '6px 12px',
                          backgroundColor: '#EF4444',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: '700'
                        }}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#1E293B' }}>
                      {notice.title}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{notice.createdAt?.toDate ? notice.createdAt.toDate().toLocaleDateString() : ''}</span>
                      <span style={{ color: '#667eea', fontWeight: 'bold' }}>자세히 →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 관리자 작성 모달 */}
      {showAdminForm && (
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
            maxWidth: '600px',
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
              공지사항 작성 (관리자)
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#64748B' }}>제목 *</p>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  style={inputStyle}
                  placeholder="제목을 입력하세요"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#64748B' }}>카테고리 *</p>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={inputStyle}
                >
                  {categories.filter(c => c !== '전체').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#64748B' }}>내용 *</p>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  style={{ ...inputStyle, height: '200px', resize: 'none' }}
                  placeholder="내용을 입력하세요"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#64748B' }}>이미지 첨부</p>
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.isPinned}
                    onChange={e => setForm({ ...form, isPinned: e.target.checked })}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>상단 고정</span>
                </label>
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
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? '등록 중...' : '등록'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminForm(false);
                    setForm({ title: '', content: '', category: '공지사항', isPinned: false });
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

      <FAB type="kakao" />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: '1px solid #E2E8F0',
  borderRadius: '8px',
  fontSize: '14px',
  backgroundColor: '#F8FAFC',
  color: '#1E293B',
  outline: 'none'
};
