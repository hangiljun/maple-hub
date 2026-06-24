'use client';

import React from 'react';

interface FABProps {
  type: 'kakao' | 'discord';
  href?: string;
}

export default function FAB({ type, href }: FABProps) {
  const defaultLinks = {
    kakao: 'https://open.kakao.com/o/sfxfJyAi',
    discord: 'https://discord.gg/2UwBw8dnSv'
  };

  const link = href || defaultLinks[type];

  const config = {
    kakao: {
      label: '카카오톡 ID : han8246',
      icon: '💬',
      background: 'linear-gradient(135deg, #FEE500 0%, #FFD400 100%)',
      shadowColor: 'rgba(254, 229, 0, 0.4)',
      shadowHoverColor: 'rgba(254, 229, 0, 0.6)'
    },
    discord: {
      label: '디스코드 참가하기',
      icon: '💬',
      background: 'linear-gradient(135deg, #5865F2 0%, #7289DA 100%)',
      shadowColor: 'rgba(88, 101, 242, 0.4)',
      shadowHoverColor: 'rgba(88, 101, 242, 0.6)'
    }
  };

  const { label, icon, background, shadowColor, shadowHoverColor } = config[type];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      <div
        className="fab-label"
        style={{
          background: '#3C3C3C',
          color: 'white',
          padding: '10px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          opacity: 1,
          transform: 'translateX(0)',
          transition: 'all 0.3s ease',
          pointerEvents: 'none'
        }}
      >
        {label}
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: '60px',
          height: '60px',
          background,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 32px ${shadowColor}`,
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
          e.currentTarget.style.boxShadow = `0 12px 40px ${shadowHoverColor}`;
          const label = e.currentTarget.previousElementSibling as HTMLElement;
          if (label) {
            label.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = `0 8px 32px ${shadowColor}`;
          const label = e.currentTarget.previousElementSibling as HTMLElement;
          if (label) {
            label.style.transform = 'scale(1)';
          }
        }}
      >
        <span style={{ fontSize: '28px' }}>{icon}</span>
      </a>
    </div>
  );
}
