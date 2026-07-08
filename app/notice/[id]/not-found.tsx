import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function NotFound() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <Navigation currentPage="notice" />

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '100px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '900',
          color: '#1E293B',
          marginBottom: '16px'
        }}>
          404
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#64748B',
          marginBottom: '32px'
        }}>
          공지사항을 찾을 수 없습니다.
        </p>

        <Link href="/notice" style={{
          display: 'inline-block',
          padding: '14px 32px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: '700',
          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
        }}>
          목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
