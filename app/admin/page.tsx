'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { firebaseConfig } from '@/lib/firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

interface PriceTier {
  label: string;
  maxQty: number | null;
  price: number;
  hot: boolean;
}

interface PriceTable {
  buy: PriceTier[];
  sell: PriceTier[];
}

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
}

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'price' | 'reviews' | 'notices' | 'items'>('price');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', category: '공지사항', isPinned: false });
  const [noticeImage, setNoticeImage] = useState<File | null>(null);
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [itemForm, setItemForm] = useState({ server: '스카니아', itemName: '', price: '', seller: '', contact: '카카오톡', contactId: '', description: '' });
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [itemLoading, setItemLoading] = useState(false);
  const [priceTable, setPriceTable] = useState<PriceTable>({
    buy: [
      { label: '1 ~ 100억', maxQty: 100, price: 1300, hot: false },
      { label: '101 ~ 300억', maxQty: 300, price: 1350, hot: false },
      { label: '301억 이상', maxQty: null, price: 1370, hot: true }
    ],
    sell: [
      { label: '1 ~ 100억', maxQty: 100, price: 1550, hot: true },
      { label: '101 ~ 300억', maxQty: 300, price: 1530, hot: false },
      { label: '301억 이상', maxQty: null, price: 1520, hot: false }
    ]
  });

  // 파일에서 가격 불러오기
  useEffect(() => {
    fetch('/api/meso-prices')
      .then(res => res.json())
      .then(data => setPriceTable(data))
      .catch(err => console.error('가격 로드 실패:', err));

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
      } else if (activeTab === 'items') {
        fetchItems();
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

  // 공지사항 작성
  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.content) {
      return alert('제목과 내용을 입력하세요.');
    }

    setNoticeLoading(true);
    try {
      let imageUrl = '';
      if (noticeImage) {
        const timestamp = Date.now();
        const storageRef = ref(storage, `notices/${timestamp}_${noticeImage.name}`);
        await uploadBytes(storageRef, noticeImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'notices'), {
        title: noticeForm.title,
        content: noticeForm.content,
        category: noticeForm.category,
        imageUrl,
        isPinned: noticeForm.isPinned,
        createdAt: new Date()
      });

      alert('공지사항이 등록되었습니다!');
      setNoticeForm({ title: '', content: '', category: '공지사항', isPinned: false });
      setNoticeImage(null);
      fetchNotices();
    } catch (error: any) {
      console.error('공지사항 등록 실패:', error);
      alert(`공지사항 등록에 실패했습니다.\n에러: ${error.message || error}`);
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
  const fetchItems = async () => {
    try {
      const { projectId, apiKey } = firebaseConfig;
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/items?key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.documents) {
        const itemsData = data.documents.map((doc: any) => {
          const docId = doc.name.split('/').pop();
          return {
            id: docId,
            server: doc.fields.server?.stringValue || '',
            itemName: doc.fields.itemName?.stringValue || '',
            price: doc.fields.price?.stringValue || '',
            seller: doc.fields.seller?.stringValue || '',
            contact: doc.fields.contact?.stringValue || '',
            contactId: doc.fields.contactId?.stringValue || '',
            description: doc.fields.description?.stringValue || '',
            imageUrl: doc.fields.imageUrl?.stringValue || '',
            createdAt: doc.fields.createdAt?.timestampValue || doc.createTime
          };
        });

        itemsData.sort((a: Item, b: Item) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        setItems(itemsData);
      }
    } catch (error) {
      console.error('급처템 로드 실패:', error);
    }
  };

  // 급처템 등록
  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.itemName || !itemForm.price || !itemForm.seller || !itemForm.contactId) {
      return alert('필수 항목을 모두 입력하세요.');
    }

    setItemLoading(true);
    try {
      let imageUrl = '';
      if (itemImage) {
        const timestamp = Date.now();
        const storageRef = ref(storage, `items/${timestamp}_${itemImage.name}`);
        await uploadBytes(storageRef, itemImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'items'), {
        server: itemForm.server,
        itemName: itemForm.itemName,
        price: itemForm.price,
        seller: itemForm.seller,
        contact: itemForm.contact,
        contactId: itemForm.contactId,
        description: itemForm.description,
        imageUrl,
        createdAt: new Date()
      });

      alert('급처템이 등록되었습니다!');
      setItemForm({ server: '스카니아', itemName: '', price: '', seller: '', contact: '카카오톡', contactId: '', description: '' });
      setItemImage(null);
      fetchItems();
    } catch (error: any) {
      console.error('급처템 등록 실패:', error);
      alert(`급처템 등록에 실패했습니다.\n에러: ${error.message || error}`);
    } finally {
      setItemLoading(false);
    }
  };

  // 급처템 삭제
  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (!confirm(`"${itemName}" 급처템을 삭제하시겠습니까?`)) return;

    try {
      const { projectId, apiKey } = firebaseConfig;
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/items/${itemId}?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      alert('삭제되었습니다.');
      fetchItems();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

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

  // 가격 변경
  const handlePriceChange = (type: 'buy' | 'sell', index: number, newPrice: number) => {
    const newTable = { ...priceTable };
    newTable[type][index].price = newPrice;
    setPriceTable(newTable);
  };

  // 저장
  const handleSave = async () => {
    try {
      const response = await fetch('/api/meso-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(priceTable)
      });

      if (response.ok) {
        alert('가격이 저장되었습니다!');
      } else {
        alert('저장 실패!');
      }
    } catch (error) {
      alert('저장 중 오류 발생!');
    }
  };

  // 초기화
  const handleReset = async () => {
    if (confirm('정말 초기화하시겠습니까?')) {
      const defaultTable: PriceTable = {
        buy: [
          { label: '1 ~ 100억', maxQty: 100, price: 1300, hot: false },
          { label: '101 ~ 300억', maxQty: 300, price: 1350, hot: false },
          { label: '301억 이상', maxQty: null, price: 1370, hot: true }
        ],
        sell: [
          { label: '1 ~ 100억', maxQty: 100, price: 1550, hot: true },
          { label: '101 ~ 300억', maxQty: 300, price: 1530, hot: false },
          { label: '301억 이상', maxQty: null, price: 1520, hot: false }
        ]
      };
      setPriceTable(defaultTable);

      try {
        await fetch('/api/meso-prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(defaultTable)
        });
        alert('초기화되었습니다!');
      } catch (error) {
        alert('초기화 중 오류 발생!');
      }
    }
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
            메소 가격 관리
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
                메소 가격 및 후기를 관리합니다
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
              onClick={() => setActiveTab('price')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'price' ? '#667eea' : 'transparent',
                color: activeTab === 'price' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              💰 메소 가격 관리
            </button>
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
            <button
              onClick={() => setActiveTab('items')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'items' ? '#667eea' : 'transparent',
                color: activeTab === 'items' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ⚡ 급처템 관리 ({items.length})
            </button>
          </div>
        </div>

        {activeTab === 'price' && (
          <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', marginBottom: '32px' }}>

          {/* 구매가 (사이트가 유저로부터 메소를 구매) */}
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '900',
              color: '#7C3AED',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🪙 구매가 (사이트 → 유저)
            </h2>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px' }}>
              유저가 사이트에 메소를 판매할 때 가격
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {priceTable.buy.map((tier, index) => (
                <div key={index} style={{
                  padding: '20px',
                  background: '#F3E8FF',
                  borderRadius: '12px',
                  border: '1px solid #E4D1FF'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#7C3AED', marginBottom: '12px' }}>
                    {tier.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>1억당</span>
                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) => handlePriceChange('buy', index, parseInt(e.target.value))}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #E4D1FF',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#7C3AED'
                      }}
                    />
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>원</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 판매가 (사이트가 유저에게 메소를 판매) */}
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '900',
              color: '#0066CC',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💰 판매가 (유저 → 사이트)
            </h2>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px' }}>
              유저가 사이트에서 메소를 구매할 때 가격
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {priceTable.sell.map((tier, index) => (
                <div key={index} style={{
                  padding: '20px',
                  background: '#E6F3FF',
                  borderRadius: '12px',
                  border: '1px solid #B3D9FF'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0066CC', marginBottom: '12px' }}>
                    {tier.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>1억당</span>
                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) => handlePriceChange('sell', index, parseInt(e.target.value))}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #B3D9FF',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#0066CC'
                      }}
                    />
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>원</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 하단 버튼 */}
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          gap: '16px',
          justifyContent: 'center'
        }}>
          <button
            onClick={handleSave}
            style={{
              padding: '16px 48px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
            }}
          >
            💾 저장하기
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '16px 48px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
            }}
          >
            🔄 초기화
          </button>
        </div>
        </>
        )}

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
              ✍️ 공지사항 작성
            </h2>

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
                <textarea
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  placeholder="공지사항 내용을 입력하세요"
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
                  이미지 (선택)
                </label>
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
                {noticeLoading ? '등록 중...' : '공지사항 등록'}
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
                          cursor: 'pointer',
                          marginLeft: '16px'
                        }}
                      >
                        삭제
                      </button>
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

        {activeTab === 'items' && (
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
              ✍️ 급처템 등록
            </h2>

            <form onSubmit={handleItemSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                    서버
                  </label>
                  <input
                    type="text"
                    value={itemForm.server}
                    onChange={(e) => setItemForm({ ...itemForm, server: e.target.value })}
                    placeholder="서버명"
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
                    가격
                  </label>
                  <input
                    type="text"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    placeholder="가격 (예: 50억)"
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
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                  아이템명
                </label>
                <input
                  type="text"
                  value={itemForm.itemName}
                  onChange={(e) => setItemForm({ ...itemForm, itemName: e.target.value })}
                  placeholder="아이템 이름"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                    판매자
                  </label>
                  <input
                    type="text"
                    value={itemForm.seller}
                    onChange={(e) => setItemForm({ ...itemForm, seller: e.target.value })}
                    placeholder="판매자 닉네임"
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
                    연락 방법
                  </label>
                  <input
                    type="text"
                    value={itemForm.contact}
                    onChange={(e) => setItemForm({ ...itemForm, contact: e.target.value })}
                    placeholder="연락 방법 (예: 카카오톡)"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                  연락처 ID
                </label>
                <input
                  type="text"
                  value={itemForm.contactId}
                  onChange={(e) => setItemForm({ ...itemForm, contactId: e.target.value })}
                  placeholder="카톡ID/디코ID 등"
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
                  상세 설명
                </label>
                <textarea
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="아이템 상세 설명"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                  이미지 (선택)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setItemImage(e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={itemLoading}
                style={{
                  padding: '14px',
                  background: itemLoading ? '#94A3B8' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: itemLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {itemLoading ? '등록 중...' : '급처템 등록'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'items' && (
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
              ⚡ 등록된 급처템 ({items.length}개)
            </h2>

            {items.length === 0 ? (
              <div style={{
                padding: '80px 20px',
                textAlign: 'center',
                color: '#94A3B8'
              }}>
                등록된 급처템이 없습니다.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '24px',
                      background: '#F8FAFC',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '12px',
                          color: '#7C3AED',
                          fontWeight: '700',
                          marginBottom: '8px'
                        }}>
                          [{item.server}] {item.price}
                        </div>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#1E293B',
                          marginBottom: '8px'
                        }}>
                          {item.itemName}
                        </h3>
                        <div style={{
                          fontSize: '14px',
                          color: '#64748B',
                          marginBottom: '12px'
                        }}>
                          <span>판매자: {item.seller}</span>
                          <span style={{ margin: '0 8px' }}>•</span>
                          <span>{item.contact}: {item.contactId}</span>
                          <span style={{ margin: '0 8px' }}>•</span>
                          <span>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</span>
                        </div>
                        {item.description && (
                          <div style={{
                            fontSize: '14px',
                            color: '#475569',
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap'
                          }}>
                            {item.description}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteItem(item.id, item.itemName)}
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
                    {item.imageUrl && (
                      <div style={{ marginTop: '12px' }}>
                        <img
                          src={item.imageUrl}
                          alt="아이템 이미지"
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
