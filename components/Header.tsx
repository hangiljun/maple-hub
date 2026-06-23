'use client';

import Link from 'next/link';
import { PenSquare } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center gap-2">
            🍁 MAPLE HUB
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/items" className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              급처템 홍보
            </Link>
            <Link href="/meso" className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              메소 거래
            </Link>
            <Link href="/discord" className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              디스코드 홍보
            </Link>
            <Link href="/reviews" className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              이용후기
            </Link>
            <Link href="/notice" className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              공지/소식
            </Link>
            <Link
              href="/write"
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <PenSquare className="w-4 h-4" />
              글쓰기
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700 hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
