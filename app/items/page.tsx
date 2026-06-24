'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import Navigation from '@/components/Navigation';
import FAB from '@/components/FAB';

interface Item {
  id: string;
  server: string;
  itemName: string;
  price: string;
  seller: string;
  contact: string;
  contactId: string;
  description: string;
  imageUrl?: string;
  createdAt: any;
  password: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedServer, setSelectedServer] = useState('전체');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    server: '스카니아',
    itemName: '',
    price: '',
    seller: '',
    contact: '카카오톡',
    contactId: '',
    description: '',
    password: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const servers = ['전체', '스카니아', '루나', '크로아', '리부트', '메이플랜드', '기타'];
  const contacts = ['카카오톡', '디스코드', '문자', '게임내'];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const itemsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Item[];
      setItems(itemsData);
    } catch (error) {
      console.error('아이템 불러오기 실패:', error);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const storageRef = ref(storage, `items/${timestamp}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.itemName || !form.price || !form.seller || !form.contactId || !form.password) {
      return alert('필수 항목을 모두 입력하세요.');
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
      await addDoc(collection(db, 'items'), {
        server: form.server,
        itemName: form.itemName,
        price: form.price,
        seller: form.seller,
        contact: form.contact,
        contactId: form.contactId,
        description: form.description,
        imageUrl,
        password: form.password,
        createdAt: new Date()
      });
      console.log('Firestore 저장 완료');

      alert('거래글이 등록되었습니다!');
      setShowForm(false);
      setForm({
        server: '스카니아',
        itemName: '',
        price: '',
        seller: '',
        contact: '카카오톡',
        contactId: '',
        description: '',
        password: ''
      });
      setImage(null);
      fetchItems();
    } catch (error: any) {
      console.error('등록 실패:', error);
      alert(`등록에 실패했습니다.\n에러: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    const password = prompt('비밀번호를 입력하세요:');
    if (!password) return;

    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (item.password !== password) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteDoc(doc(db, 'items', itemId));
      alert('삭제되었습니다.');
      setSelectedItem(null);
      fetchItems();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const filteredItems = items;

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' });
  };

  return (
    <div style={{ backgroundColor: '#FAFBFC', minHeight: '100vh' }}>
      <Navigation currentPage="items" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>

        {/* 페이지 제목 */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1E293B', marginBottom: '12px' }}>
            ⚡ 급처템 문의
          </h1>
          <p style={{ fontSize: '16px', color: '#64748B' }}>
            관리자가 등록한 급처템을 확인하세요 ({items.length}개)
          </p>
        </div>

        {/* 거래 방법 안내 */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          borderRadius: '20px',
          marginBottom: '40px',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '24px' }}>
            💡 안전 거래 방법
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '900', marginBottom: '12px' }}>1</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>원하는 아이템 찾기</h3>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>서버별로 필터링하여 원하는 아이템을 검색합니다</p>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '900', marginBottom: '12px' }}>2</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>판매자 연락</h3>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>카톡 또는 디스코드로 판매자에게 연락합니다</p>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '900', marginBottom: '12px' }}>3</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>가격 협의</h3>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>판매자와 가격 및 거래 방법을 협의합니다</p>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '900', marginBottom: '12px' }}>4</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>게임 내 거래</h3>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>약속한 시간에 게임 접속 후 안전하게 거래합니다</p>
            </div>
          </div>

          <div style={{
            marginTop: '32px',
            padding: '20px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
            lineHeight: 1.8
          }}>
            <strong>⚠️ 안전 거래 팁:</strong><br />
            • 선입금은 절대 하지 마세요<br />
            • 게임 내에서 직접 거래하세요<br />
            • 거래 전 판매자 캐릭터를 확인하세요<br />
            • 의심스러운 거래는 피하세요
          </div>
        </div>

        {/* 아이템 목록 */}
        {filteredItems.length === 0 ? (
          <div style={{
            padding: '80px 20px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎁</div>
            <p style={{ fontSize: '18px', color: '#64748B', fontWeight: '600', marginBottom: '12px' }}>
              등록된 거래글이 없습니다
            </p>
            <p style={{ fontSize: '14px', color: '#94A3B8' }}>
              첫 번째 거래글을 등록해보세요!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #E5E7EB',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                }}
              >
                {item.imageUrl && (
                  <div style={{ width: '100%', height: '200px', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
                    <img
                      src={item.imageUrl}
                      alt={item.itemName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      {item.server}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
                    {item.itemName}
                  </h3>
                  <p style={{ fontSize: '20px', fontWeight: '900', color: '#667eea', marginBottom: '12px' }}>
                    {item.price}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748B' }}>
                    <span>판매자: {item.seller}</span>
                    <span>{item.contact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 상세보기 모달 */}
      {selectedItem && (
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
          backdropFilter: 'blur(4px)',
          padding: '20px'
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
            {selectedItem.imageUrl && (
              <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden' }}>
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.itemName}
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{
                  padding: '6px 16px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  {selectedItem.server}
                </span>
                <span style={{ fontSize: '13px', color: '#94A3B8' }}>
                  {formatDate(selectedItem.createdAt)}
                </span>
              </div>

              <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1E293B', marginBottom: '12px' }}>
                {selectedItem.itemName}
              </h3>
              <p style={{ fontSize: '28px', fontWeight: '900', color: '#667eea', marginBottom: '20px' }}>
                {selectedItem.price}
              </p>

              {selectedItem.description && (
                <div style={{
                  padding: '20px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  whiteSpace: 'pre-wrap',
                  fontSize: '14px',
                  lineHeight: '1.8',
                  color: '#475569'
                }}>
                  {selectedItem.description}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>판매자</p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>{selectedItem.seller}</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>연락 방법</p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>{selectedItem.contact}</p>
                </div>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#FEF3C7',
                border: '1px solid #FDE68A',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <p style={{ fontSize: '14px', color: '#92400E', fontWeight: '600', marginBottom: '8px' }}>
                  📞 연락처
                </p>
                <p style={{ fontSize: '18px', fontWeight: '900', color: '#78350F' }}>
                  {selectedItem.contactId}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleDelete(selectedItem.id)}
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
                onClick={() => setSelectedItem(null)}
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
