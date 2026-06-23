export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
              🍁 MAPLE HUB
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              메이플스토리 유저들을 위한 아이템 거래, 메소 거래, 디스코드 홍보 플랫폼입니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">바로가기</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/items" className="hover:text-blue-600 transition-colors duration-200">급처템 홍보</a></li>
              <li><a href="/meso" className="hover:text-blue-600 transition-colors duration-200">메소 거래</a></li>
              <li><a href="/discord" className="hover:text-blue-600 transition-colors duration-200">디스코드 홍보</a></li>
              <li><a href="/reviews" className="hover:text-blue-600 transition-colors duration-200">이용후기</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">이용 안내</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              본 사이트는 개인 간 거래를 위한 정보 공유 플랫폼입니다.
              모든 거래는 당사자 간 직접 진행되며, 사이트는 중개 서비스를 제공하지 않습니다.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 leading-relaxed">
            © 2026 MAPLE HUB. All rights reserved.
            <span className="block mt-2">
              본 사이트는 거래 중개 플랫폼이 아닌 홍보 공간이며, 당사자 간의 직거래로 인해 발생하는 피해에 대해 책임을 지지 않습니다.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
