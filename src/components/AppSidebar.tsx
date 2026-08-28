'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

const items = [
  { href: '/dashboard', label: 'Home', icon: '⌂' },
  { href: '/practice', label: 'Practice', icon: '⌁' },
  { href: '/subjects', label: 'Question Bank', icon: '▣' },
  { href: '/subjects', label: 'Fanlar', icon: '♧' },
  { href: '/terminlar', label: 'Terminlar', icon: '▥' },
  { href: '/study-plan', label: 'Study Plan', icon: '♧' },
];

const secondary = [
  { href: '/analytics', label: 'Analytics', icon: '◒' },
  { href: '/tutor', label: 'AI Tutor', icon: '◎' },
  { href: '/profile', label: 'Sozlamalar', icon: '⚙' },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.replace('/');
    router.refresh();
  }

  return (
    <aside className={`app-sidebar${collapsed ? ' collapsed' : ''}`}>
      <button
        type="button"
        className="sidebar-collapse"
        onClick={() => setCollapsed((value) => !value)}
        aria-label={collapsed ? 'Sidebarni ochish' : 'Sidebarni yig‘ish'}
        title={collapsed ? 'Sidebarni ochish' : 'Sidebarni yig‘ish'}
      >
        {collapsed ? '›' : '‹'}
      </button>

      <Link href="/dashboard" className="sidebar-brand">
        <span className="brand-mark">M</span>
        <span className="sidebar-brand-text">MilliyTest</span>
      </Link>

      <div className="sidebar-section-label">ASOSIY</div>
      <nav className="sidebar-nav" aria-label="Asosiy menyu">
        {items.map((item) => {
          const active = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.label} href={item.href} className={`sidebar-item${active ? ' active' : ''}`} title={collapsed ? item.label : undefined}>
              <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
              <span className="sidebar-item-text">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-focus">
        <span className="sidebar-focus-label">BUGUNGI MAQSAD</span>
        <strong>Savol yechishni davom ettiring.</strong>
        <Link href="/practice">Practice →</Link>
      </div>

      <nav className="sidebar-nav sidebar-secondary" aria-label="Qo‘shimcha menyu">
        {secondary.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.label} href={item.href} className={`sidebar-item${active ? ' active' : ''}`} title={collapsed ? item.label : undefined}>
              <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
              <span className="sidebar-item-text">{item.label}</span>
            </Link>
          );
        })}
        <button type="button" className="sidebar-item sidebar-logout" onClick={logout} disabled={loggingOut} title={collapsed ? 'Chiqish' : undefined}>
          <span className="sidebar-icon" aria-hidden="true">↪</span>
          <span className="sidebar-item-text">{loggingOut ? 'Chiqilmoqda…' : 'Chiqish'}</span>
        </button>
      </nav>
    </aside>
  );
}
