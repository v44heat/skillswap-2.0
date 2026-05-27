import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { EmptyState } from '../common/UI';
import { timeAgo } from '../../utils/helpers';

const TYPE_ICON = { REQUEST: '📬', ACCEPTED: '✅', REJECTED: '❌', FEEDBACK: '⭐', ADMIN: '🔧', INFO: '🔔' };

export default function NotificationsPage() {
  const { notifications, markRead, markAllRead, removeNotification } = useNotifications();
  const unread = notifications.filter((n) => !n.isRead);

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>{unread.length} unread</p>
        </div>
        {unread.length > 0 && (
          <button className="btn btn-outline" onClick={markAllRead}>Mark all as read</button>
        )}
      </div>

      {notifications.length === 0
        ? <EmptyState icon="🔔" title="No notifications yet" subtitle="You'll see alerts here when there's activity on your account." />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                className="card"
                style={{ display: 'flex', gap: 14, alignItems: 'flex-start', cursor: 'pointer', opacity: n.isRead ? 0.65 : 1, transition: 'opacity .15s' }}
                onClick={() => !n.isRead && markRead(n.id)}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {TYPE_ICON[n.type] || TYPE_ICON.INFO}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    {!n.isRead && <span className="notif-dot" style={{ flexShrink: 0 }} />}
                    <p style={{ fontSize: 14, fontWeight: n.isRead ? 400 : 600 }}>{n.title}</p>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{n.message}</p>
                  <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{timeAgo(n.createdAt)}</p>
                </div>
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16, padding: 4, flexShrink: 0 }}
                  onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                  aria-label="Delete notification"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
