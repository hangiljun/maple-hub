'use client';

import { Bell, Calendar } from 'lucide-react';

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  important: boolean;
}

const mockNotices: Notice[] = [
  {
    id: 1,
    title: '사이트 리뉴얼 안내',
    content: 'MAPLE HUB가 더욱 편리한 UI/UX로 새롭게 단장했습니다. 모바일 환경에서도 최적화된 환경으로 거래하실 수 있습니다. 앞으로도 유저 여러분의 편의를 위해 지속적으로 개선해나가겠습니다.',
    date: '2026-06-20',
    important: true,
  },
  {
    id: 2,
    title: '여름 이벤트 홍보글 작성 가이드',
    content: '여름 시즌을 맞이하여 많은 유저분들이 거래를 진행하고 계십니다. 효과적인 홍보글 작성을 위해서는 정확한 아이템 정보와 가격, 그리고 신뢰할 수 있는 연락처를 명시해주세요. 사진 첨부 시 거래 성사율이 약 40% 증가합니다.',
    date: '2026-06-18',
    important: false,
  },
  {
    id: 3,
    title: '안전거래 체크리스트 업데이트',
    content: '안전한 거래를 위한 체크리스트가 업데이트되었습니다. 1) 거래 전 상대방 프로필 확인, 2) 소액 분할 거래 진행, 3) 게임 내 거래 스크린샷 저장, 4) 의심스러운 거래는 즉시 중단. 여러분의 안전한 거래를 위해 꼭 숙지해주세요.',
    date: '2026-06-15',
    important: true,
  },
  {
    id: 4,
    title: '신규 서버 카테고리 추가',
    content: '많은 요청에 따라 메이플랜드 서버 카테고리가 신규 추가되었습니다. 메이플랜드 유저분들도 이제 더욱 편리하게 거래하실 수 있습니다.',
    date: '2026-06-10',
    important: false,
  },
  {
    id: 5,
    title: '디스코드 홍보 카테고리 오픈',
    content: '커뮤니티의 요청으로 디스코드 채널 홍보 카테고리가 새롭게 오픈했습니다. 길드 모집, 보스런 파티, 거래 커뮤니티 등 다양한 디스코드를 자유롭게 홍보해보세요.',
    date: '2026-06-05',
    important: false,
  },
  {
    id: 6,
    title: '사기 신고 시스템 도입 예정',
    content: '유저 여러분의 안전한 거래 환경 조성을 위해 사기 신고 시스템이 7월 중 도입될 예정입니다. 신고된 유저는 검증 후 서비스 이용이 제한될 수 있습니다.',
    date: '2026-06-01',
    important: true,
  },
];

export default function NoticePage() {
  return (
    <div className="bg-slate-900 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">공지사항 & 소식</h1>
          <p className="text-sm text-slate-400">MAPLE HUB의 최신 소식을 확인하세요</p>
        </div>

        {/* Notice List */}
        <div className="space-y-4">
          {mockNotices.map((notice) => (
            <div
              key={notice.id}
              className="bg-slate-800/30 border border-slate-700/50 rounded-lg overflow-hidden hover:bg-slate-800/40 transition-all duration-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    notice.important ? 'bg-amber-500/20' : 'bg-slate-700/50'
                  }`}>
                    <Bell className={`w-5 h-5 ${notice.important ? 'text-amber-500' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {notice.important && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-xs font-semibold rounded">
                          중요
                        </span>
                      )}
                      <h2 className="text-lg font-semibold text-slate-100">{notice.title}</h2>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>{notice.date}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm text-slate-300 leading-relaxed pl-13">
                  {notice.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
