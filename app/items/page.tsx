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
      <style jsx global>{`
        @media (max-width: 768px) {
          .items-title {
            font-size: 28px !important;
          }
          .items-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
          }
          .items-guide-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .items-padding {
            padding: 24px !important;
          }
        }
      `}</style>
      <Navigation currentPage="items" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>

        {/* 페이지 제목 */}
        <div style={{ marginBottom: '40px' }}>
          <h1 className="items-title" style={{ fontSize: '36px', fontWeight: '900', color: '#1E293B', marginBottom: '12px' }}>
            ⚡ 급처템 문의
          </h1>
          <p style={{ fontSize: '16px', color: '#64748B' }}>
            관리자가 등록한 급처템을 확인하세요 ({items.length}개)
          </p>
        </div>

        {/* 거래 방법 안내 */}
        <div className="items-padding" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          borderRadius: '20px',
          marginBottom: '40px',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '24px' }}>
            💡 안전 거래 방법
          </h2>
          <div className="items-guide-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
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
          <a
            href="https://open.kakao.com/o/szxJKLBi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              textDecoration: 'none',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* 클릭 안내 버튼 */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(102, 126, 234, 0.95)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '30px',
              fontSize: '15px',
              fontWeight: '700',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
              zIndex: 10,
              pointerEvents: 'none'
            }}>
              💬 사진을 클릭하면 연락됩니다
            </div>

            <img
              src="/items-banner.png"
              alt="메이플스토리 급처템 거래 - 카카오톡 han8246"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </a>
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

      {/* SEO 텍스트 섹션 */}
      <div style={{
        maxWidth: '1200px',
        margin: '80px auto 0',
        padding: '60px 20px',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '900',
          color: '#1E293B',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          💡 메이플 급처템 완벽 가이드
        </h2>

        {/* 메접하는 5가지 이유 */}
        <section style={{ marginBottom: '60px' }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#667eea',
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '2px solid #667eea'
          }}>
            1. 유저들이 '메접(메이플 접기)'을 선택하는 5가지 결정적 이유
          </h3>
          <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.8, marginBottom: '32px' }}>
            많은 유저들이 오랜 시간 애정을 쏟은 메이플스토리를 떠나게 되는 대표적인 사유입니다. 유저들 사이에서 깊은 공감대를 형성하는 주제이기도 합니다.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '12px', borderLeft: '4px solid #667eea' }}>
              <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                ⚠️ 불합리한 확률과 강화 시스템 (노력의 가치 상실)
              </h4>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
                메이플의 핵심 재미는 성장이지만, 반대로 가장 큰 스트레스도 성장 시스템에서 옵니다. 스타포스 강화 시 발생하는 하락이나 파괴, 큐브(잠재능력) 재설정 등 수십·수백만 원 혹은 수백 시간을 투자해도 운이 나쁘면 스펙이 제자리걸음을 하거나 오히려 떨어지는 구조에 깊은 무력감을 느낍니다. 여기에 리부트 서버 관련 패치나 특정 강화 개편 등 운영진의 패치 한 번에 자신이 들인 시간과 자본의 가치가 폭락할 때 탈력감(현타)을 느끼고 떠나는 유저가 많습니다.
              </p>
            </div>

            <div style={{ padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '12px', borderLeft: '4px solid #667eea' }}>
              <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                ⏰ 과도한 시간 숙제 (일상이 사라지는 재획과 일퀘)
              </h4>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
                메이플은 '시간을 갈아 넣는 게임'의 대명사입니다. 상위 컨텐츠로 가기 위해 매일 몇 시간씩 제자리에서 똑같은 몬스터를 잡는 '재획(재물 획득 비약)' 사냥은 뇌를 비우고 하기에도 한계가 있어, "내가 퇴근하고 또 노동을 하고 있나?" 하는 회의감이 들게 만듭니다. 또한 심볼 세금(업그레이드 비용), 일일 퀘스트, 주간 보스 돌이 등 하루라도 빠지면 뒤처진다는 압박감이 게임을 '즐거움'이 아닌 '의무적인 숙제'로 변질시킵니다.
              </p>
            </div>

            <div style={{ padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '12px', borderLeft: '4px solid #667eea' }}>
              <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                💰 고자본 위주의 높은 진입 장벽 (돈 안 쓰면 진입 불가)
              </h4>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
                중자본에서 고자본으로 넘어가는 구간의 벽이 너무나도 높습니다. 특정 구간(예: 해방, 카링 등 상위 보스 진입)부터는 단순히 시간만 들여서는 불가능하고, 수백만 원 단위의 현금 고액 투자가 강제됩니다. 무과금이나 소과금 유저들이 열심히 재획을 해도 스펙 향상 폭이 미미해지는 '벽'에 부딪히면 자연스럽게 흥미를 잃고 이탈하게 됩니다.
              </p>
            </div>

            <div style={{ padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '12px', borderLeft: '4px solid #667eea' }}>
              <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                👥 인간관계 스트레스와 인맥 피로도
              </h4>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
                보스 레이드와 길드 시스템이 강화되면서 생긴 부작용입니다. 상위 보스를 가기 위해 커뮤니티나 디스코드에서 "무릉 몇 층인가요?", "환산 주스탯 몇인가요?"라며 취업 면접 못지않은 검증을 거쳐야 하는데, 이 과정에서 극심한 피로감을 느낍니다. 아울러 길드 컨텐츠(수로, 노블레스 스킬 유지) 참여 강요나 길드원 간의 파벌, 과도한 친목질, 혹은 먹튀(먹고 튀기) 사건 등에 휘말려 정이 떨어지는 경우도 허다합니다.
              </p>
            </div>

            <div style={{ padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '12px', borderLeft: '4px solid #667eea' }}>
              <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                🌍 현생(현실 인생)의 변화
              </h4>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
                가장 건강하면서도 많은 유저가 겪는 자연스러운 이별 사유입니다. 대학생 때나 취업 준비생 때는 몇 시간씩 사냥할 수 있었지만, 취업을 하고 직장 생활을 시작하거나 결혼을 하면서 도저히 메이플의 무거운 플레이 타임을 감당할 수 없게 됩니다. "이 시간에 자기계발을 하거나 운동을 하는 게 이득이겠다"라는 생각이 들며 자연스럽게 접속 빈도가 줄어들다 결국 계정을 정리하게 됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* 급처 선택 심리 */}
        <section style={{ marginBottom: '60px' }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#667eea',
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '2px solid #667eea'
          }}>
            2. 메접할 때 '아이템 통째로 급처'를 선택하는 유저 심리
          </h3>
          <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginBottom: '24px' }}>
            이러한 사유로 메이플을 접게 될 때, 아이템을 최대한 빠르게 판매하고 깔끔하게 떠나는 것이 핵심입니다. 어차피 마음도 떴는데 게임을 계속 붙잡고 있는 것도 고역일뿐더러, 애매하게 아이템이 한두 개씩 쪼개서 팔리면 남은 템으로는 사냥이나 보스 처리가 힘들어지기 때문에 보통 아이템을 통째로 판매하게 됩니다.
          </p>
          <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginBottom: '24px' }}>
            일부 유저들은 천천히 경매장에 올리기도 하지만, 메이플 급처템 전문 구매자에게 넘기는 분들이 많습니다. 급처템 구매자는 모든 아이템을 한 번에(조금 낮은 가격일지라도) 통째로 사 가기 때문에, 접는 사람 입장에서는 "다 귀찮으니 한 번에 신속하게 정리해 버리자"라는 심리가 크게 작용하기 때문입니다.
          </p>

          <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            color: 'white'
          }}>
            <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>💡 시장의 급처템 구매자 유형</h4>
            <ul style={{ fontSize: '15px', lineHeight: 2, paddingLeft: '20px' }}>
              <li>인게임 고확(고성능 확성기)에서 "급처템 삽니다"라고 외치는 장사꾼</li>
              <li>디스코드 커뮤니티와 제휴를 맺고 전문적으로 매입하는 사람</li>
              <li>유저들이 급하게 경매장에 80% 가격으로 던지는 매물을 실시간 모니터링하여 가로채는 사람</li>
              <li>블로그나 전문 웹사이트를 운영하며 체계적으로 급처템을 매입하는 사람</li>
            </ul>
          </div>
        </section>

        {/* MAPLE HUB 소개 */}
        <section>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#667eea',
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '2px solid #667eea'
          }}>
            3. 사기 걱정 없는 최고가 처분 선택법: MAPLE HUB
          </h3>
          <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginBottom: '24px' }}>
            급처를 결심했을 때 유저들이 가장 조심해야 할 것은 게임 내외를 막론하고 어딜 가나 존재하는 '사기꾼들'과 터무니없이 가치를 깎아내리는 '헐값 후려치기'입니다.
          </p>
          <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, marginBottom: '24px' }}>
            사기꾼들에게 당하지 않고, 아이템 시세를 합리적으로 측정하여 안전하게 거래할 수 있는 가장 확실한 방법이 바로 여기에 있습니다. <strong style={{ color: '#667eea' }}>메이플 급처템 전문 매입 사이트: MAPLE HUB</strong>는 유저분들의 이러한 모든 고민을 완벽하게 해결해 드립니다. 단순한 메이플 급처템을 '부르는 게 값'인 싸구려 취급을 하지 않고, 유저가 그동안 들인 노력과 추억의 가치까지 합리적으로 계산해 드립니다.
          </p>

          <div style={{
            padding: '32px',
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            borderRadius: '12px',
            border: '2px solid #F59E0B',
            marginBottom: '24px'
          }}>
            <h4 style={{ fontSize: '20px', fontWeight: '700', color: '#92400E', marginBottom: '16px' }}>
              📌 최고가 판매를 위한 꿀팁
            </h4>
            <p style={{ fontSize: '15px', color: '#78350F', lineHeight: 1.8, marginBottom: '12px' }}>
              똑같은 메이플 장비 아이템이라도 인게임 확성기로 하루 종일 소리치고 경매장에 올려두어도 일주일 내내 안 팔리던 매물이 있습니다. 하지만 아이템의 상세한 가치와 정확한 시세를 분석하여 최적의 무대에 내놓는다면 나름 최선의 최고가에 신속히 팔려 나가곤 합니다.
            </p>
            <p style={{ fontSize: '16px', color: '#78350F', lineHeight: 1.8, fontWeight: '700', fontStyle: 'italic' }}>
              "장사는 단순한 물건을 파는 게 아니라, 그 물건이 가진 '가치'를 파는 것입니다."
            </p>
          </div>

          <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
            그 가치를 가장 안전하고 정확하게 사줄 사람들이 모인 최적의 공간이 바로 이곳입니다. 아직도 인게임 경매장의 무거운 수수료 때문에 고민이시거나, 비싼 고가 아이템의 처분 타이밍을 못 잡아 발을 동동 구르고 계신다면 지금 MAPLE HUB를 이용해 보세요. <strong style={{ color: '#667eea' }}>안전성, 신속함, 그리고 가격 만족도까지 결과가 완전히 달라질 것입니다.</strong>
          </p>
        </section>
      </div>

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
