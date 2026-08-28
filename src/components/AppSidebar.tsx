'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

const items = [
  { href: '/dashboard', label: 'Home', icon: '⌂' },
  { href: '/practice', label: 'Practice', icon: '⌁' },
  { href: '/subjects', label: 'Question Bank', icon: '▣', badge: 'Free' },
  { href: '/subjects', label: 'Fanlar', icon: '♧' },
  { href: '/terminlar', label: 'Terminlar', icon: '▥' },
  { href: '/study-plan', label: 'Study Plan', icon: '♧' },
];

const secondary = [
  { href: '/dashboard', label: 'Performance Analytics', icon: '▥' },
  { href: '/tutor', label: 'Support', icon: '◎' },
  { href: '/profile', label: 'Settings', icon: '⚙' },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  return (
    <aside className="app-sidebar">
      <Link href="/dashboard" className="sidebar-brand">
        <span className="brand-mark">M</span>
        <span>MilliyTest</span>
      </Link>

      <div className="sidebar-section-label">MENU</div>
      <nav className="sidebar-nav" aria-label="Asosiy menyu">
        {items.map((item) => {
          const active = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.label} href={item.href} className={`sidebar-item${active ? ' active' : ''}`}>
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-streak">
        <div className="sidebar-streak-head"><span>♨ Daily Streak</span><b>ACTIVE</b></div>
        <div className="sidebar-streak-row"><strong>7 days</strong><span>→ 14</span></div>
        <div className="sidebar-progress"><span /></div>
        <div className="sidebar-streak-row"><small>Active today ✓</small><small>7 to go</small></div>
      </div>

      <Link href="/study-plan" className="sidebar-upgrade">Upgrade to Pro</Link>

      <nav className="sidebar-nav sidebar-secondary" aria-label="Qo‘shimcha menyu">
        {secondary.map((item) => (
          <Link key={item.label} href={item.href} className="sidebar-item">
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        <button type="button" className="sidebar-item sidebar-logout" onClick={logout}>
          <span className="sidebar-icon">↪</span>
          <span>Chiqish</span>
        </button>
      </nav>
    </aside>
  );
}
