'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavigationProps {
  currentPage: 'home' | 'items' | 'meso' | 'discord' | 'reviews' | 'notice' | 'faq' | 'safety-guide';
}

export default function Navigation({ currentPage }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { key: 'home', label: '홈', href: '/' },
    { key: 'items', label: '급처템', href: '/items' },
    { key: 'meso', label: '메소거래', href: '/meso' },
    { key: 'discord', label: '디스코드', href: '/discord' },
    { key: 'reviews', label: '이용후기', href: '/reviews' },
    { key: 'notice', label: '공지사항', href: '/notice' },
    { key: 'faq', label: 'FAQ', href: '/faq' },
    { key: 'safety-guide', label: '안전거래', href: '/safety-guide' }
  ];

  return (
    <>
      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-button { display: flex !important; }
        }
        @media (min-width: 769px) {
          .desktop-menu { display: flex !important; }
          .mobile-menu-button { display: none !important; }
        }
      `}</style>

      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'white',
        borderBottom: '2px solid #667eea',
        padding: '20px 5%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.ico" alt="MAPLE HUB" style={{ width: '40px', height: '40px' }} />
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#667eea' }}>메이플 허브</span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="desktop-menu" style={{ display: 'flex', gap: '32px', fontSize: '16px', fontWeight: '600' }}>
            {menuItems.map(item => (
              <Link
                key={item.key}
                href={item.href}
                style={{
                  color: currentPage === item.key ? '#667eea' : '#64748B',
                  textDecoration: 'none',
                  borderBottom: currentPage === item.key ? '2px solid #667eea' : 'none',
                  paddingBottom: '4px',
                  transition: 'color 0.2s'
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* 모바일 햄버거 버튼 */}
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ width: '28px', height: '3px', background: '#667eea', borderRadius: '2px', transition: 'all 0.3s' }} />
            <div style={{ width: '28px', height: '3px', background: '#667eea', borderRadius: '2px', transition: 'all 0.3s' }} />
            <div style={{ width: '28px', height: '3px', background: '#667eea', borderRadius: '2px', transition: 'all 0.3s' }} />
          </button>
        </div>

        {/* 모바일 메뉴 드롭다운 */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            borderBottom: '2px solid #667eea',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            animation: 'slideDown 0.3s ease'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 5%' }}>
              {menuItems.map(item => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '16px 20px',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: currentPage === item.key ? '#667eea' : '#64748B',
                    textDecoration: 'none',
                    borderLeft: currentPage === item.key ? '4px solid #667eea' : '4px solid transparent',
                    background: currentPage === item.key ? 'rgba(102, 126, 234, 0.05)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
