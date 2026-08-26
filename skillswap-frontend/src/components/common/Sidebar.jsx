import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from '../common/UI';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

const STUDENT_NAV = [
  { path: '/dashboard',             label: 'Dashboard',       icon: '🏠' },
  { path: '/dashboard/skills/my',   label: 'My Skills',       icon: '⭐' },
  { path: '/dashboard/skills/browse', label: 'Browse Skills', icon: '🔍' },
  { path: '/dashboard/requests',    label: 'My Requests',     icon: '📬' },
  { path: '/dashboard/sessions',    label: 'My Sessions',     icon: '📅' },
  { path: '/dashboard/notifications', label: 'Notifications', icon: '🔔', badge: true },
  { path: '/dashboard/profile',     label: 'My Profile',      icon: '👤' },
  { path: '/dashboard/settings',    label: 'Settings',        icon: '⚙️' },
];

const ADMIN_NAV = [
  { path: '/admin',           label: 'Overview',         icon: '📊' },
  { path: '/admin/users',     label: 'Manage Users',     icon: '👥' },
  { path: '/admin/skills',    label: 'Manage Skills',    icon: '⭐' },
  { path: '/admin/requests',  label: 'Manage Requests',  icon: '📬' },
  { path: '/admin/sessions',  label: 'Manage Sessions',  icon: '📅' },
  { path: '/admin/activity',  label: 'Activity Logs',    icon: '📋' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = user?.role === 'ADMIN' ? ADMIN_NAV : STUDENT_NAV;

  const isActive = (path) => {
    if (path === '/dashboard' || path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: 220, flexShrink: 0, background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', height: '100vh',
      position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>⚡</div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>SkillSwap</span>
      </div>

      {/* User info */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={user?.fullName} />
        <div style={{ overflow: 'hidden' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.fullName}
          </p>
          <p style={{ fontSize: 11, color: 'var(--text3)' }}>
            {user?.role === 'ADMIN' ? 'Administrator' : user?.department || 'Student'}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-item${isActive(item.path) ? ' active' : ''}`}
            onClick={() => navigate(item.path)}
            type="button"
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
            {item.badge && unreadCount > 0 && (
              <span style={{ marginLeft: 'auto', background: 'var(--red)', color: '#fff', borderRadius: 10, fontSize: 11, padding: '1px 7px', fontWeight: 700 }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '10px 10px', borderTop: '1px solid var(--border)' }}>
        <button className="sidebar-item" style={{ color: 'var(--red)' }} onClick={handleLogout} type="button">
          <span className="sidebar-icon">🚪</span>
          Sign out
// sign out button 
        </button>
      </div>
    </aside>
  );
}
