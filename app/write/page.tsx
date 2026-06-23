'use client';

import { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';

export default function WritePage() {
  const [formData, setFormData] = useState({
    category: 'items',
    server: '스카니아',
    type: '팝니다',
    title: '',
    description: '',
    price: '',
    contactType: 'kakaotalk',
    contactLink: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">등록 완료!</h2>
          <p className="text-sm text-slate-400">
            홍보글이 성공적으로 등록되었습니다.<br />
            잠시 후 메인 페이지로 이동합니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">홍보글 작성</h1>
          <p className="text-sm text-slate-400">정확한 정보를 입력하여 빠른 거래를 시작하세요</p>
        </div>

        {/* Safety Notice */}
        <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-500 mb-1">작성 전 확인사항</h3>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• 연락처(오픈카톡 또는 디스코드 링크)를 정확히 입력해주세요</li>
              <li>• 허위 정보 작성 시 게시글이 삭제될 수 있습니다</li>
              <li>• 사기 거래 방지를 위해 소액 분할 거래를 권장합니다</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-100 mb-2">카테고리</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
            >
              <option value="items">급처템 홍보</option>
              <option value="meso">메소 거래</option>
              <option value="discord">디스코드 홍보</option>
            </select>
          </div>

          {/* Server Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-100 mb-2">서버</label>
            <select
              name="server"
              value={formData.server}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
            >
              <option value="스카니아">스카니아</option>
              <option value="루나">루나</option>
              <option value="크로아">크로아</option>
              <option value="리부트">리부트</option>
              <option value="메이플랜드">메이플랜드</option>
            </select>
          </div>

          {/* Type Selection */}
          {formData.category !== 'discord' && (
            <div>
              <label className="block text-sm font-semibold text-slate-100 mb-2">거래 유형</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: '팝니다' })}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    formData.type === '팝니다'
                      ? 'bg-amber-500 text-slate-900'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700'
                  }`}
                >
                  팝니다
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: '삽니다' })}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    formData.type === '삽니다'
                      ? 'bg-amber-500 text-slate-900'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700'
                  }`}
                >
                  삽니다
                </button>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-100 mb-2">제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder={
                formData.category === 'items' ? '예: 22성 앱솔 완판 급처합니다' :
                formData.category === 'meso' ? '예: 메소 100억 급처 판매' :
                '예: 스카니아 보스런 파티 디스코드'
              }
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-100 mb-2">상세 설명</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="거래 아이템이나 서비스에 대한 자세한 설명을 입력해주세요"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200 resize-none"
            />
          </div>

          {/* Price */}
          {formData.category !== 'discord' && (
            <div>
              <label className="block text-sm font-semibold text-slate-100 mb-2">가격</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="예: 80억 또는 협의"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
              />
            </div>
          )}

          {/* Contact Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-100 mb-2">연락 방법</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, contactType: 'kakaotalk' })}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  formData.contactType === 'kakaotalk'
                    ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/50'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                오픈카톡
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, contactType: 'discord' })}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  formData.contactType === 'discord'
                    ? 'bg-indigo-500/20 text-indigo-400 border-2 border-indigo-500/50'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                디스코드
              </button>
            </div>
          </div>

          {/* Contact Link */}
          <div>
            <label className="block text-sm font-semibold text-slate-100 mb-2">
              {formData.contactType === 'kakaotalk' ? '오픈카톡 링크' : '디스코드 초대 링크'}
            </label>
            <input
              type="url"
              name="contactLink"
              value={formData.contactLink}
              onChange={handleChange}
              required
              placeholder={
                formData.contactType === 'kakaotalk'
                  ? 'https://open.kakao.com/...'
                  : 'https://discord.gg/...'
              }
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:bg-amber-400 transition-all duration-200"
            >
              <Send className="w-5 h-5" />
              홍보글 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
